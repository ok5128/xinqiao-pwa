/**
 * 心桥 SD-Turbo 文生图 Worker
 * 模型: schmuell/sd-turbo-ort-web (v-prediction, 1-4 steps)
 * 推理: ONNX Runtime Web + WebGPU
 */

importScripts("https://cdn.jsdelivr.net/npm/onnxruntime-web@1.21.0/dist/ort.all.min.js");

/* WebGPU 配置 */
ort.env.webgpu.powerPreference = "high-performance";

/* 模型 URL (通过 hf-mirror.com 加速中国访问) */
const HF_BASE = "https://hf-mirror.com/schmuell/sd-turbo-ort-web/resolve/main";
const MODEL_URLS = {
  textEncoder: `${HF_BASE}/text_encoder/model.onnx`,
  unet: `${HF_BASE}/unet/model.onnx`,
  vaeDecoder: `${HF_BASE}/vae_decoder/model.onnx`,
  tokenizerVocab: `${HF_BASE}/tokenizer/vocab.json`,
  tokenizerMerges: `${HF_BASE}/tokenizer/merges.txt`,
};

/* 全局状态 */
let textEncoderSession = null;
let unetSession = null;
let vaeDecoderSession = null;
let tokenizer = null;
let isReady = false;
let isLoading = false;

/* WebGPU 支持 */
const hasWebGPU = typeof navigator !== "undefined" && "gpu" in navigator;
if (!hasWebGPU) {
  console.warn("SD-Turbo 需要 WebGPU，当前环境不支持");
}

/* ────────────────────────────────────────────────────────── */
/* Tokenizer (CLIP BPE) */
/* ────────────────────────────────────────────────────────── */

function createBPETokenizer(vocab, merges) {
  const specialTokens = {
    "<|startoftext|>": 49406,
    "<|endoftext|>": 49407,
  };

  const vocabReverse = {};
  for (const [token, id] of Object.entries(vocab)) {
    vocabReverse[id] = token;
  }

  function bytesToUnicode() {
    const bs = [...Array(256).keys()];
    const cs = bs.map((b) => b);
    let n = 0;
    for (let b = 0; b < 256; b++) {
      if (b < 128 || b >= 128 && b < 160) continue;
      if (n === 0) cs[b] = 65533;
      else cs[b] = 128 + ((n - 1) % 32);
      n += 1;
    }
    const result = {};
    for (let i = 0; i < 256; i++) result[bs[i]] = cs[i];
    return result;
  }

  const byteEncoder = bytesToUnicode();
  const byteDecoder = Object.fromEntries(Object.entries(byteEncoder).map(([k, v]) => [v, k]));

  function getPairs(word) {
    const pairs = new Set();
    let prevChar = word[0];
    for (let i = 1; i < word.length; i++) {
      const char = word[i];
      pairs.add([prevChar, char]);
      prevChar = char;
    }
    return pairs;
  }

  function bpe(token) {
    if (token in specialTokens) return [token];
    const word = token.split("").map((c) => byteEncoder[c.charCodeAt(0)]);

    let pairs = getPairs(word);
    if (!pairs.size) return token;

    while (true) {
      const bigram = [...merges].find((merge) => pairs.has(merge));
      if (!bigram) break;
      const [first, second] = bigram;
      const newWord = [];
      let i = 0;
      while (i < word.length) {
        if (i < word.length - 1 && word[i] === first && word[i + 1] === second) {
          newWord.push(first + second);
          i += 2;
        } else {
          newWord.push(word[i]);
          i += 1;
        }
      }
      word = newWord;
      if (word.length === 1) break;
      pairs = getPairs(word);
    }

    return word;
  }

  return {
    encode: (text) => {
      const tokens = [];
      for (const token of text.split(" ")) {
        const bpeTokens = bpe(token);
        for (const t of bpeTokens) {
          if (t in vocab) tokens.push(vocab[t]);
          else if (t in byteDecoder) tokens.push(vocab[byteDecoder[t]]);
        }
      }
      return tokens;
    },

    encodeText: (text) => {
      const tokens = [specialTokens["<|startoftext|>"]];
      tokens.push(...tokenize.encode(text));
      tokens.push(specialTokens["<|endoftext|>"]);
      return tokens;
    },

    vocabReverse,
  };
}

const tokenize = {
  encode: (text) => [], // placeholder, will be set after loading
};

/* ────────────────────────────────────────────────────────── */
/* 加载器 */
/* ────────────────────────────────────────────────────────── */

async function loadTokenizer() {
  const [vocabResp, mergesResp] = await Promise.all([
    fetch(MODEL_URLS.tokenizerVocab),
    fetch(MODEL_URLS.tokenizerMerges),
  ]);

  if (!vocabResp.ok || !mergesResp.ok) {
    throw new Error("Tokenizer 文件加载失败");
  }

  const vocab = await vocabResp.json();
  const mergesText = await mergesResp.text();

  const merges = mergesText.trim().split("\n").map((line) => {
    const parts = line.split(" ");
    return [parts[0], parts[1]];
  });

  const bpeTokenizer = createBPETokenizer(vocab, merges);
  tokenize.encode = bpeTokenizer.encode.bind(bpeTokenizer);

  return bpeTokenizer;
}

async function fetchModel(url, onProgress) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${url}`);

  const contentLength = response.headers.get("content-length");
  const total = contentLength ? parseInt(contentLength, 10) : null;
  const reader = response.body.getReader();
  const chunks = [];
  let received = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.length;
    if (onProgress && total) onProgress(received, total);
  }

  const buffer = new Uint8Array(received);
  let pos = 0;
  for (const chunk of chunks) {
    buffer.set(chunk, pos);
    pos += chunk.length;
  }
  return buffer;
}

async function loadModels(onProgress) {
  if (isLoading) return;
  isLoading = true;

  try {
    // 加载 tokenizer
    onProgress({ stage: "tokenizer", progress: 0 });
    tokenizer = await loadTokenizer();
    onProgress({ stage: "tokenizer", progress: 100 });

    // 加载 text_encoder
    onProgress({ stage: "text_encoder", progress: 0 });
    const teData = await fetchModel(MODEL_URLS.textEncoder, (received, total) => {
      onProgress({ stage: "text_encoder", progress: Math.round((received / total) * 100) });
    });
    textEncoderSession = await ort.InferenceSession.create(teData.buffer, {
      executionProviders: ["webgpu"],
      graphOptimizationLevel: "all",
    });
    onProgress({ stage: "text_encoder", progress: 100 });

    // 加载 unet
    onProgress({ stage: "unet", progress: 0 });
    const unetData = await fetchModel(MODEL_URLS.unet, (received, total) => {
      onProgress({ stage: "unet", progress: Math.round((received / total) * 100) });
    });
    unetSession = await ort.InferenceSession.create(unetData.buffer, {
      executionProviders: ["webgpu"],
      graphOptimizationLevel: "all",
    });
    onProgress({ stage: "unet", progress: 100 });

    // 加载 vae_decoder
    onProgress({ stage: "vae_decoder", progress: 0 });
    const vaeData = await fetchModel(MODEL_URLS.vaeDecoder, (received, total) => {
      onProgress({ stage: "vae_decoder", progress: Math.round((received / total) * 100) });
    });
    vaeDecoderSession = await ort.InferenceSession.create(vaeData.buffer, {
      executionProviders: ["webgpu"],
      graphOptimizationLevel: "all",
    });
    onProgress({ stage: "vae_decoder", progress: 100 });

    isReady = true;
  } catch (err) {
    isLoading = false;
    throw err;
  }
  isLoading = false;
}

/* ────────────────────────────────────────────────────────── */
/* 推理辅助 */
/* ────────────────────────────────────────────────────────── */

function createTensor(data, dims) {
  const tensorData = Float32Array.from(data);
  return new ort.Tensor("float32", tensorData, dims);
}

/* 生成随机噪声 */
function generateNoise(width, height) {
  const size = width * height * 4;
  const noise = new Float32Array(size);
  for (let i = 0; i < size; i++) {
    noise[i] = (Math.random() * 2 - 1) * 14.6146;
  }
  return noise;
}

/* ────────────────────────────────────────────────────────── */
/* Scheduler (Karras Euler-a for v-prediction) */
/* ────────────────────────────────────────────────────────── */

function createScheduler(numSteps = 4) {
  const sigmaMin = 0.0291675;
  const sigmaMax = 14.6146;

  // Karras sigma schedule
  const sigmas = [];
  const rho = 7;
  const stepIndices = [...Array(numSteps + 1).keys()].map((i) => i / numSteps);

  for (const stepIdx of stepIndices) {
    const uMin = Math.pow(sigmaMin, 1 / rho);
    const uMax = Math.pow(sigmaMax, 1 / rho);
    const u = uMax + stepIdx * (uMin - uMax);
    sigmas.push(Math.pow(u, rho));
  }

  let stepIndex = 0;

  return {
    sigmas,
    stepIndex,

    timesteps: sigmas.slice(0, -1),

    step: (modelOutput, sample, sigma) => {
      const sigmaNext = sigmas[stepIndex + 1];

      // v-prediction conversion
      // v = sigma * noise - sample => noise = (v + sample) / sigma
      // Wait, for v-prediction in EDM: v = sigma * noise - sample
      // So: predicted_original_sample = (sample * sigma - modelOutput) / (sigma^2 + 1)

      const predOriginalSample = (sample * sigma - modelOutput) / (sigma * sigma + 1);

      // Euler step
      const derivative = (sample - predOriginalSample) / sigma;
      const dt = sigmaNext - sigma;
      const prevSample = sample + derivative * dt;

      stepIndex++;
      return prevSample;
    },

    scaleModelInput: (sample, sigma) => {
      return sample / (Math.sqrt(sigma * sigma + 1));
    },
  };
}

/* ────────────────────────────────────────────────────────── */
/* 文生图流程 */
/* ────────────────────────────────────────────────────────── */

async function generateImage(prompt, width = 512, height = 512, numSteps = 4, seed = 42, onProgress) {
  if (!isReady) throw new Error("模型未加载");

  // Seed
  const rng = (seed) => {
    let s = seed;
    return () => {
      s = Math.imul(1664525, s) + 1013904223;
      return (s >>> 0) / 4294967296;
    };
  };
  const random = rng(seed);

  // Tokenize
  const tokens = tokenizer.encodeText(prompt);
  const maxLength = 77;
  const paddedTokens = tokens.slice(0, maxLength);
  while (paddedTokens.length < maxLength) paddedTokens.push(0);

  // Text embeddings
  onProgress({ stage: "text_encoding", progress: 0 });
  const inputIds = createTensor(paddedTokens, [1, paddedTokens.length]);
  const attentionMask = createTensor(paddedTokens.map((t) => t > 0 ? 1 : 0), [1, paddedTokens.length]);

  const teInputs = { input_ids: inputIds, attention_mask: attentionMask };
  const teOutputs = await textEncoderSession.run(teInputs);
  const textEmbeddings = teOutputs.last_hidden_state.data;
  onProgress({ stage: "text_encoding", progress: 100 });

  // Initialize latent with noise
  const latentWidth = width / 8;
  const latentHeight = height / 8;
  const latentChannels = 4;
  const latentSize = latentWidth * latentHeight * latentChannels;

  const latent = new Float32Array(latentSize);
  for (let i = 0; i < latentSize; i++) {
    latent[i] = (random() * 2 - 1) * sigmas[0];
  }

  // Scheduler
  const scheduler = createScheduler(numSteps);
  const sigmas = scheduler.sigmas;

  // Denoising loop
  onProgress({ stage: "denoising", progress: 0, step: 0, totalSteps: numSteps });
  for (let i = 0; i < numSteps; i++) {
    const sigma = sigmas[i];

    // Scale latent
    const scaledLatent = latent.map((v) => v / Math.sqrt(sigma * sigma + 1));

    // UNet input
    const latentTensor = createTensor(scaledLatent, [1, latentChannels, latentHeight, latentWidth]);
    const timestepTensor = createTensor([sigma], [1]);
    const textEmbTensor = createTensor(textEmbeddings, [1, 77, 1024]);

    const unetInputs = {
      sample: latentTensor,
      timestep: timestepTensor,
      encoder_hidden_states: textEmbTensor,
    };

    const unetOutputs = await unetSession.run(unetInputs);
    const noisePred = unetOutputs.out.data;

    // Scheduler step
    const prevSample = scheduler.step(noisePred, scaledLatent, sigma);
    for (let j = 0; j < latentSize; j++) {
      latent[j] = prevSample[j];
    }

    onProgress({
      stage: "denoising",
      progress: Math.round(((i + 1) / numSteps) * 100),
      step: i + 1,
      totalSteps: numSteps,
    });
  }

  // VAE decode
  onProgress({ stage: "decoding", progress: 0 });
  const finalLatent = createTensor(latent, [1, latentChannels, latentHeight, latentWidth]);
  const vaeInputs = { latent_sample: finalLatent };
  const vaeOutputs = await vaeDecoderSession.run(vaeInputs);
  const decoded = vaeOutputs.sample.data;

  // Post-process: convert to RGB
  const outputSize = width * height * 3;
  const rgbData = new Uint8Array(outputSize);
  for (let i = 0; i < width * height; i++) {
    const r = Math.min(255, Math.max(0, Math.round((decoded[i] / 0.18215 + 1) * 127.5)));
    const g = Math.min(255, Math.max(0, Math.round((decoded[i + width * height] / 0.18215 + 1) * 127.5)));
    const b = Math.min(255, Math.max(0, Math.round((decoded[i + width * height * 2] / 0.18215 + 1) * 127.5)));
    rgbData[i * 3] = r;
    rgbData[i * 3 + 1] = g;
    rgbData[i * 3 + 2] = b;
  }

  onProgress({ stage: "decoding", progress: 100 });

  // Create image data and base64
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext("2d");
  const imageData = new ImageData(new Uint8ClampedArray(rgbData), width, height);
  ctx.putImageData(imageData, 0, 0);
  const bitmap = await canvas.transferToImageBitmap();
  const blob = await (await createImageBitmap(bitmap) ? null : null);

  // Fallback: convert to data URL via canvas
  const dataUrl = canvas.toDataURL("image/png");

  return { image: dataUrl, seed };
}

/* ────────────────────────────────────────────────────────── */
/* 消息处理 */
/* ────────────────────────────────────────────────────────── */

self.onmessage = async (event) => {
  const { id, type, payload } = event.data;

  try {
    if (type === "init") {
      if (!hasWebGPU) {
        throw new Error("当前环境不支持 WebGPU，SD-Turbo 无法运行");
      }
      self.postMessage({ id, type: "ready", payload: { hasWebGPU } });
      return;
    }

    if (type === "load") {
      if (isReady) {
        self.postMessage({ id, type: "loadDone" });
        return;
      }
      await loadModels(({ stage, progress }) => {
        self.postMessage({ id, type: "loadProgress", payload: { stage, progress } });
      });
      self.postMessage({ id, type: "loadDone" });
      return;
    }

    if (type === "textToImage") {
      const { prompt, width = 512, height = 512, numSteps = 4, seed = Date.now() } = payload;

      const result = await generateImage(prompt, width, height, numSteps, seed, ({ stage, progress, step, totalSteps }) => {
        self.postMessage({
          id,
          type: "generateProgress",
          payload: { stage, progress, step, totalSteps },
        });
      });

      self.postMessage({
        id,
        type: "imageDone",
        payload: {
          image: result.image,
          caption: prompt,
          model: "sd-turbo-ort-web",
          seed: result.seed,
          steps: numSteps,
        },
      });
      return;
    }

    if (type === "getStatus") {
      self.postMessage({
        id,
        type: "status",
        payload: { isReady, isLoading, hasWebGPU },
      });
      return;
    }
  } catch (err) {
    self.postMessage({
      id,
      type: "error",
      payload: { message: err.message },
    });
  }
};