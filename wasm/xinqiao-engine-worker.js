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
  "npc-yunlan": "你是云岚，一个温暖的情绪陪伴者。你会先倾听，再帮对方整理情绪。回复要温柔简短。",
  "npc-qingwu": "你是青梧，一个擅长东方文化的讲解者。用轻松的方式讲解诗词典故。回复要生动有趣。",
  "npc-aluo": "你是阿洛，一个行动教练。帮对方把目标拆成可执行的三步。回复要简洁有力。",
  "npc-misheng": "你是弥生，一个创作灵感伙伴。帮对方扩展画面和故事。回复要有画面感。",
  "npc-xinghe": "你是星河，一个关系连接者。帮对方找到人、技能或愿望的匹配。回复要精准直接。",
  agent: "你是心桥的智能体助手，用简洁的中文回复用户的问题和请求。",
};
const DEFAULT_SYSTEM = "你是心桥的AI助手。必须只用简体中文回答，像真人聊天一样简短有温度。";

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
      progress_callback: mkProgress("whisperBase"),
    }).catch((e) => { moduleState.whisperBase.status = "error"; transcriberPromise = null; throw e; });
  }
  return transcriberPromise;
}

function getGenerator() {
  if (!generatorPromise) {
    moduleState.qwenTiny.status = "loading";
    generatorPromise = pipeline("text-generation", "onnx-community/Qwen3-0.6B-ONNX", {
      dtype: "q4f16",
      progress_callback: mkProgress("qwenTiny"),
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

    const streamer = new TextStreamer(pipe.tokenizer, {
      skip_prompt: true,
      skip_special_tokens: true,
      callback_function: (token) => {
        self.postMessage({ id, type: "chatToken", payload: { token } });
      },
    });

    const output = await pipe(messages, {
      max_new_tokens: 256,
      do_sample: true,
      temperature: 0.7,
      top_p: 0.9,
      repetition_penalty: 1.08,
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
