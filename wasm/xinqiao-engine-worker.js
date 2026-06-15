/**
 * 心桥 Engine Worker — 云端版
 * - STT: 浏览器内置 SpeechRecognition（不在 Worker）
 * - Chat: onnx-community/Qwen2.5-1.5B-Instruct (text-generation, 流式)
 * - TTS: 浏览器内置 speechSynthesis（不在 Worker）
 * - Image: 后续集成
 */

import {
  pipeline,
  env,
  TextStreamer,
} from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1";

env.allowRemoteModels = true;
env.allowLocalModels = false;

/* ── NPC 角色设定 ── */
const NPC_PROMPTS = {
  "npc-yunlan": "你是云岚，温暖的情绪陪伴者。先倾听，再帮对方整理情绪。回复温柔简短，像朋友聊天。",
  "npc-qingwu": "你是青梧，擅长东方文化的讲解者。用轻松方式讲诗词典故，回复生动有趣。",
  "npc-aluo": "你是阿洛，行动教练。帮对方把目标拆成可执行的三步，回复简洁有力。",
  "npc-misheng": "你是弥生，创作灵感伙伴。帮对方扩展画面和故事，回复有画面感。",
  "npc-xinghe": "你是星河，关系连接者。帮对方找到匹配，回复精准直接。",
  agent: "你是心桥的AI伙伴，用简短自然的中文回复，像真人聊天。",
};
const DEFAULT_SYSTEM = "你是心桥的AI伙伴。用简短中文回复对方的话，像真人聊天一样自然。不要自我介绍。";

/* ── 模块状态 ── */
const moduleState = {
  qwenChat: { status: "pending", sizeMb: 1100, progress: 0, queue: "01" },
};

/* ── 设备检测 ── */
const IS_MOBILE = /iPad|iPhone|iPod|Android/i.test(typeof navigator !== "undefined" ? navigator.userAgent : "");
const PREFER_WEBGPU = !IS_MOBILE;

/* ── Pipeline 缓存 ── */
let generatorPromise = null;

function mkProgress(stage) {
  return (p) => {
    if (p.status === "progress" && p.progress != null) {
      const pct = Math.round(p.progress);
      moduleState[stage].progress = pct;
      self.postMessage({ type: "modelProgress", payload: { stage, progress: pct, file: p.file || "" } });
    }
    if (p.status === "done") {
      moduleState[stage].status = "ready";
      moduleState[stage].progress = 100;
      self.postMessage({ type: "modelProgress", payload: { stage, progress: 100, file: "" } });
    }
  };
}

async function getGenerator() {
  if (!generatorPromise) {
    moduleState.qwenChat.status = "loading";
    generatorPromise = (async () => {
      /* 桌面端优先 WebGPU（快），移动端直接 WASM（省显存） */
      if (PREFER_WEBGPU) {
        try {
          return await pipeline("text-generation", "onnx-community/Qwen2.5-1.5B-Instruct", {
            dtype: "q4f16",
            device: "webgpu",
            progress_callback: mkProgress("qwenChat"),
          });
        } catch (e) {
          console.warn("WebGPU 失败，回退 WASM:", e.message);
        }
      }
      moduleState.qwenChat.status = "loading";
      return await pipeline("text-generation", "onnx-community/Qwen2.5-1.5B-Instruct", {
        dtype: "q4",
        device: "wasm",
        progress_callback: mkProgress("qwenChat"),
      });
    })().catch((e) => { moduleState.qwenChat.status = "error"; generatorPromise = null; throw e; });
  }
  return generatorPromise;
}

/* ── 输出清洗 ── */
const LEAK_PATTERNS = [
  /你是[云青阿弥星心][岚梧洛生河桥].{0,30}/g,
  /名字[：:][云青阿弥星心][岚梧洛生河桥].{0,20}/g,
];

function cleanOutput(text) {
  let out = text;
  for (const p of LEAK_PATTERNS) {
    out = out.replace(p, "");
  }
  return out.trim();
}

/* ── 聊天（流式） ── */
async function streamChat(id, payload) {
  try {
    const pipe = await getGenerator();
    const role = payload.role || "agent";
    const text = payload.text || "";
    const systemPrompt = NPC_PROMPTS[role] || DEFAULT_SYSTEM;
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: text },
    ];

    let buffer = "";
    let sentLen = 0;

    const streamer = new TextStreamer(pipe.tokenizer, {
      skip_prompt: true,
      skip_special_tokens: true,
      callback_function: (token) => {
        buffer += token;
        const cleaned = cleanOutput(buffer);
        if (cleaned.length > sentLen) {
          const newPart = cleaned.slice(sentLen);
          sentLen = cleaned.length;
          self.postMessage({ id, type: "chatToken", payload: { token: newPart } });
        }
      },
    });

    const output = await pipe(messages, {
      max_new_tokens: 512,
      do_sample: true,
      temperature: 0.7,
      top_p: 0.9,
      repetition_penalty: 1.15,
      streamer,
    });

    let fullText = "";
    if (Array.isArray(output) && output[0]?.generated_text) {
      const gen = output[0].generated_text;
      if (Array.isArray(gen)) {
        const last = gen[gen.length - 1];
        fullText = last?.content || "";
      } else {
        fullText = String(gen);
      }
    }
    fullText = cleanOutput(fullText);
    self.postMessage({ id, type: "chatDone", payload: { text: fullText } });
  } catch (e) {
    self.postMessage({ id, type: "chatError", payload: { message: `聊天生成失败：${e.message}` } });
  }
}

/* ── 语音识别（已改用浏览器内置，这里保留兼容） ── */
async function transcribeAudio(id, payload) {
  self.postMessage({ id, type: "transcript", payload: { text: "" } });
}

/* ── 文生图 ── */
function generateImage(id, payload) {
  const prompt = String(payload.prompt || "").trim();
  self.postMessage({
    id, type: "imageDone",
    payload: {
      image: "",
      caption: prompt ? `「${prompt}」— 文生图功能后续版本集成。` : "文生图功能后续版本集成。",
      model: "pending",
    },
  });
}

/* ── 消息分发 ── */
self.addEventListener("message", (event) => {
  const { id, type, payload = {}, transfer } = event.data || {};
  switch (type) {
    case "init":
      self.postMessage({ id, type: "ready", payload: { modules: moduleState, runtime: "cloud-qwen2.5-1.5b" } });
      break;
    case "transcribe":
      transcribeAudio(id, payload);
      break;
    case "chat":
      streamChat(id, payload);
      break;
    case "textToImage":
      generateImage(id, payload);
      break;
    case "syncPolicy":
      self.postMessage({ id, type: "policyReady", payload: { modules: moduleState } });
      break;
  }
});
