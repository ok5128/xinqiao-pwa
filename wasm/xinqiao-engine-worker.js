/**
 * 心桥 Engine Worker — 云端版
 * 模型从 HuggingFace 远程加载，首次打开需下载
 * - STT: onnx-community/whisper-base (automatic-speech-recognition)
 * - Chat: onnx-community/Qwen3-0.6B-ONNX (text-generation, q4f16, 流式)
 * - TTS: 浏览器内置 speechSynthesis（不在 Worker 中）
 * - Image: 后续集成 Stable Diffusion，当前返回提示
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
  "npc-yunlan": "名字：云岚。你是温暖的情绪陪伴者，先倾听再帮对方整理情绪。直接回复对方说的话，绝不自我介绍、不复读设定、不提及你是AI。",
  "npc-qingwu": "名字：青梧。你擅长东方文化，用轻松方式讲诗词典故。直接回复对方说的话，绝不自我介绍、不复读设定、不提及你是AI。",
  "npc-aluo": "名字：阿洛。你是行动教练，帮对方把目标拆成可执行的三步。直接回复对方说的话，绝不自我介绍、不复读设定、不提及你是AI。",
  "npc-misheng": "名字：弥生。你是创作灵感伙伴，帮对方扩展画面和故事。直接回复对方说的话，绝不自我介绍、不复读设定、不提及你是AI。",
  "npc-xinghe": "名字：星河。你是关系连接者，帮对方找到匹配。直接回复对方说的话，绝不自我介绍、不复读设定、不提及你是AI。",
  agent: "名字：心桥助手。用简洁中文回复。直接回答问题，绝不复读设定、不自我介绍、不提及你是AI。",
};
const DEFAULT_SYSTEM = "你是心桥的AI伙伴。直接用简短中文回复对方的话，绝不复读设定、不自我介绍、不提及你是AI。像真人聊天一样自然。";

/* ── 模块状态 ── */
const moduleState = {
  whisperBase: { status: "pending", sizeMb: 82, progress: 0, queue: "01" },
  qwenTiny:    { status: "pending", sizeMb: 488, progress: 0, queue: "02" },
  dreamLite:   { status: "pending", sizeMb: 720, progress: 0, queue: "03" },
};

/* ── Pipeline 缓存 ── */
let transcriberPromise = null;
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

function getTranscriber() {
  if (!transcriberPromise) {
    moduleState.whisperBase.status = "loading";
    transcriberPromise = pipeline("automatic-speech-recognition", "onnx-community/whisper-base", {
      dtype: "q8",
      device: "webgpu",
      progress_callback: mkProgress("whisperBase"),
    }).catch((e) => {
      console.warn("WebGPU 不可用，回退 WASM:", e.message);
      moduleState.whisperBase.status = "loading";
      transcriberPromise = pipeline("automatic-speech-recognition", "onnx-community/whisper-base", {
        dtype: "q8",
        device: "wasm",
        progress_callback: mkProgress("whisperBase"),
      });
    }).catch((e) => { moduleState.whisperBase.status = "error"; transcriberPromise = null; throw e; });
  }
  return transcriberPromise;
}

function getGenerator() {
  if (!generatorPromise) {
    moduleState.qwenTiny.status = "loading";
    generatorPromise = pipeline("text-generation", "onnx-community/Qwen3-0.6B-ONNX", {
      dtype: "q4f16",
      device: "webgpu",
      progress_callback: mkProgress("qwenTiny"),
    }).catch((e) => {
      console.warn("WebGPU 不可用，回退 WASM:", e.message);
      moduleState.qwenTiny.status = "loading";
      generatorPromise = pipeline("text-generation", "onnx-community/Qwen3-0.6B-ONNX", {
        dtype: "q4f16",
        device: "wasm",
        progress_callback: mkProgress("qwenTiny"),
      });
    }).catch((e) => { moduleState.qwenTiny.status = "error"; generatorPromise = null; throw e; });
  }
  return generatorPromise;
}

/* ── 语音识别 ── */
async function transcribeAudio(id, payload) {
  try {
    const pipe = await getTranscriber();
    const audio = payload.audio || payload.transfer;
    const result = await pipe(audio, { language: "zh", task: "transcribe" });
    self.postMessage({ id, type: "transcript", payload: { text: result.text || "" } });
  } catch (e) {
    self.postMessage({ id, type: "chatError", payload: { message: `语音识别失败：${e.message}` } });
  }
}

/* ── 输出清洗：去掉模型可能回显的设定内容 ── */
const LEAK_PATTERNS = [
  /你是[云青阿弥星心][岚梧洛生河桥].{0,30}/g,
  /名字[：:][云青阿弥星心][岚梧洛生河桥].{0,20}/g,
  /绝不[复读自我].{0,15}/g,
  /不提及你是AI/g,
  /直接回复对方说的话/g,
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

    /* 流式缓冲，用于过滤泄露 */
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
      max_new_tokens: 256,
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

/* ── 文生图 ── */
function generateImage(id, payload) {
  const prompt = String(payload.prompt || "").trim();
  self.postMessage({
    id,
    type: "imageDone",
    payload: {
      image: "",
      caption: prompt
        ? `「${prompt}」— 文生图功能需要 WebGPU，后续版本将集成 Stable Diffusion Turbo。`
        : "文生图功能需要 WebGPU，后续版本将集成。",
      model: "pending",
    },
  });
}

/* ── 消息分发 ── */
self.addEventListener("message", (event) => {
  const { id, type, payload = {}, transfer } = event.data || {};
  switch (type) {
    case "init":
      self.postMessage({ id, type: "ready", payload: { modules: moduleState, runtime: "cloud-tjs-3.8.1" } });
      break;
    case "transcribe":
      if (transfer) payload.audio = transfer;
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
