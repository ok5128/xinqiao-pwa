/**
 * 心桥 Voice Worker — 离线语音交互管线
 * 
 * 管线: Mic → VAD(能量检测) → ASR(Whisper-tiny) → [chat] → TTS(Kokoro-82M) → Audio
 * 
 * PWA 阶段: transformers.js (Whisper + Kokoro ONNX)
 * 原生壳阶段: 切换 sherpa-onnx 原生引擎, 接口不变, 适配 Duix-Mobile
 */

import {
  pipeline,
  env,
} from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1";

/* 国内镜像 */
env.allowRemoteModels = true;
env.allowLocalModels = false;
env.remoteHost = "https://hf-mirror.com";
env.remotePathTemplate = "{model}/resolve/{revision}/";

/* ── 模型配置 ── */
const ASR_MODEL = "onnx-community/whisper-tiny";       /* 39MB, 中英文 */
const TTS_MODEL = "onnx-community/Kokoro-82M-v1.0-ONNX"; /* ~189MB, 53 speakers, 24kHz */

/* 中文 TTS 音色: zf_xiaoxiao(47) 女声, zm_yunyang(52) 男声 */
const TTS_VOICE_ZH_F = 47;  /* zf_xiaoxiao */
const TTS_VOICE_ZH_M = 52;  /* zm_yunyang */

/* ── 状态 ── */
const state = {
  asrReady: false,
  ttsReady: false,
  asrLoading: false,
  ttsLoading: false,
  asrProgress: 0,
  ttsProgress: 0,
};

let asrPipeline = null;
let ttsInstance = null;

/* ── 加载 ASR (Whisper-tiny) ── */
async function loadASR(onProgress) {
  if (state.asrReady) return;
  if (state.asrLoading) return;
  state.asrLoading = true;

  try {
    asrPipeline = await pipeline("automatic-speech-recognition", ASR_MODEL, {
      dtype: "q8",
      device: "wasm",
      progress_callback: (p) => {
        if (p.status === "progress" && p.progress != null) {
          state.asrProgress = Math.round(p.progress);
          onProgress?.({ stage: "asr", progress: state.asrProgress });
        }
        if (p.status === "done") {
          state.asrProgress = 100;
          onProgress?.({ stage: "asr", progress: 100 });
        }
      },
    });
    state.asrReady = true;
  } finally {
    state.asrLoading = false;
  }
}

/* ── 加载 TTS (Kokoro-82M) ── */
async function loadTTS(onProgress) {
  if (state.ttsReady) return;
  if (state.ttsLoading) return;
  state.ttsLoading = true;

  try {
    /* kokoro-js 提供封装好的 Kokoro TTS API */
    const { KokoroTTS } = await import(
      "https://cdn.jsdelivr.net/npm/kokoro-js@1.3.0/dist/kokoro-js.mjs"
    );

    ttsInstance = await KokoroTTS.from_pretrained(TTS_MODEL, {
      dtype: "q8",
      progress_callback: (p) => {
        if (p.status === "progress" && p.progress != null) {
          state.ttsProgress = Math.round(p.progress);
          onProgress?.({ stage: "tts", progress: state.ttsProgress });
        }
        if (p.status === "done") {
          state.ttsProgress = 100;
          onProgress?.({ stage: "tts", progress: 100 });
        }
      },
    });
    state.ttsReady = true;
  } catch (err) {
    /* kokoro-js 加载失败, 回退到浏览器 speechSynthesis */
    console.warn("Kokoro TTS 加载失败，回退浏览器 TTS:", err.message);
    state.ttsReady = false;
  } finally {
    state.ttsLoading = false;
  }
}

/* ── ASR: 音频 → 文字 ── */
async function transcribe(audioData, sampleRate = 16000) {
  if (!state.asrReady || !asrPipeline) {
    throw new Error("ASR 模型未加载");
  }

  const result = await asrPipeline(audioData, {
    language: "zh",
    task: "transcribe",
    return_timestamps: false,
  });

  return result?.text || "";
}

/* ── TTS: 文字 → 音频 PCM ── */
async function synthesize(text, voiceId = TTS_VOICE_ZH_F, speed = 0.95) {
  if (!state.ttsReady || !ttsInstance) {
    throw new Error("TTS 模型未加载");
  }

  const audio = await ttsInstance.generate(text, {
    sid: voiceId,
    speed,
  });

  /* audio: { audio: Float32Array, sampling_rate: number } */
  return {
    samples: audio.audio,
    sampleRate: audio.sampling_rate || 24000,
  };
}

/* ── VAD: 简单能量检测 (后续替换 Silero-VAD) ── */
function detectVoiceEnd(audioData, threshold = 0.008, silenceFrames = 8) {
  const frameSize = 480; /* 30ms @ 16kHz */
  let silenceCount = 0;
  let lastVoiceFrame = -1;

  for (let i = 0; i < audioData.length; i += frameSize) {
    const frame = audioData.subarray(i, i + frameSize);
    const rms = Math.sqrt(frame.reduce((sum, s) => sum + s * s, 0) / frame.length);
    if (rms > threshold) {
      silenceCount = 0;
      lastVoiceFrame = i + frameSize;
    } else {
      silenceCount++;
    }
  }

  /* 尾部连续静音帧超过阈值 → 语音已结束 */
  return silenceCount >= silenceFrames && lastVoiceFrame > 0;
}

/* ── 音频格式转换: PCM Float32 → Int16 WAV ── */
function encodeWAV(samples, sampleRate) {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * bitsPerSample / 8;
  const blockAlign = numChannels * bitsPerSample / 8;
  const dataSize = samples.length * (bitsPerSample / 8);
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  /* RIFF header */
  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);  /* PCM */
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(view, 36, "data");
  view.setUint32(40, dataSize, true);

  /* PCM samples (float32 → int16) */
  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    offset += 2;
  }

  return buffer;
}

function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

/* ── 重采样: 24kHz → 16kHz (Duix-Mobile 兼容) ── */
function resample(samples, fromRate, toRate) {
  if (fromRate === toRate) return samples;
  const ratio = fromRate / toRate;
  const newLength = Math.round(samples.length / ratio);
  const output = new Float32Array(newLength);
  for (let i = 0; i < newLength; i++) {
    const srcIdx = i * ratio;
    const idx = Math.floor(srcIdx);
    const frac = srcIdx - idx;
    if (idx + 1 < samples.length) {
      output[i] = samples[idx] * (1 - frac) + samples[idx + 1] * frac;
    } else {
      output[i] = samples[idx] || 0;
    }
  }
  return output;
}

/* ── 消息处理 ── */
self.onmessage = async (event) => {
  const { id, type, payload = {} } = event.data;

  try {
    switch (type) {
      /* ── 初始化 ── */
      case "init": {
        self.postMessage({
          id, type: "ready",
          payload: { asrReady: state.asrReady, ttsReady: state.ttsReady },
        });
        break;
      }

      /* ── 加载模型 ── */
      case "loadASR": {
        await loadASR(({ stage, progress }) => {
          self.postMessage({ id, type: "loadProgress", payload: { stage, progress } });
        });
        self.postMessage({ id, type: "loadDone", payload: { stage: "asr", ready: state.asrReady } });
        break;
      }

      case "loadTTS": {
        await loadTTS(({ stage, progress }) => {
          self.postMessage({ id, type: "loadProgress", payload: { stage, progress } });
        });
        self.postMessage({ id, type: "loadDone", payload: { stage: "tts", ready: state.ttsReady } });
        break;
      }

      /* ── ASR: 语音转文字 ── */
      case "transcribe": {
        const { audio, sampleRate = 16000 } = payload;
        if (!state.asrReady) throw new Error("ASR 模型未加载");

        self.postMessage({ id, type: "asrProgress", payload: { status: "recognizing" } });
        const text = await transcribe(audio, sampleRate);
        self.postMessage({ id, type: "transcript", payload: { text } });
        break;
      }

      /* ── TTS: 文字转语音 ── */
      case "synthesize": {
        const { text, voice, speed = 0.95, outputSampleRate } = payload;
        if (!state.ttsReady) throw new Error("TTS 模型未加载");

        self.postMessage({ id, type: "ttsProgress", payload: { status: "synthesizing" } });
        const voiceId = voice === "male" ? TTS_VOICE_ZH_M : TTS_VOICE_ZH_F;
        const result = await synthesize(text, voiceId, speed);

        /* 可选重采样 (Duix-Mobile 需要 16kHz) */
        const finalRate = outputSampleRate || result.sampleRate;
        const finalSamples = outputSampleRate
          ? resample(result.samples, result.sampleRate, outputSampleRate)
          : result.samples;

        /* 编码为 WAV */
        const wavBuffer = encodeWAV(finalSamples, finalRate);

        self.postMessage({
          id, type: "audioReady",
          payload: {
            audioBuffer: wavBuffer,
            sampleRate: finalRate,
            duration: finalSamples.length / finalRate,
            format: "wav",
          },
        }, [wavBuffer]);
        break;
      }

      /* ── VAD: 检测语音端点 ── */
      case "detectVoiceEnd": {
        const { audio, threshold, silenceFrames } = payload;
        const ended = detectVoiceEnd(audio, threshold, silenceFrames);
        self.postMessage({ id, type: "vadResult", payload: { ended } });
        break;
      }

      /* ── 状态查询 ── */
      case "getStatus": {
        self.postMessage({
          id, type: "status",
          payload: {
            asrReady: state.asrReady,
            ttsReady: state.ttsReady,
            asrLoading: state.asrLoading,
            ttsLoading: state.ttsLoading,
            asrModel: ASR_MODEL,
            ttsModel: TTS_MODEL,
          },
        });
        break;
      }

      default:
        break;
    }
  } catch (err) {
    self.postMessage({
      id, type: "error",
      payload: { message: err.message, stage: type },
    });
  }
};
