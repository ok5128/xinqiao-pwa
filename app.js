const contacts = [
  {
    role: "system-settings-inline",
    name: "系统设置",
    avatar: "./assets/system-settings.png"
  },
  {
    role: "system-search-inline",
    name: "系统搜索",
    avatar: "./assets/system-search.png"
  },
  {
    role: "agent",
    name: "智能体",
    avatar: "./assets/avatar-zhuangzi.jpg"
  },
  {
    role: "wechat",
    name: "微信",
    avatar: "./assets/open-wechat.jpg"
  },
  {
    role: "settings",
    name: "",
    avatar: "./assets/daoxin-logo.jpg"
  },
  {
    role: "phone-contacts",
    name: "通讯录",
    avatar: "./assets/contact-import.jpg",
    system: true
  },
  {
    role: "digital-human",
    name: "数字分身",
    avatar: "./assets/my-digital-human.jpg"
  },
  {
    role: "npc-yunlan",
    name: "云岚",
    avatar: "./assets/npc-1.png"
  },
  {
    role: "npc-qingwu",
    name: "青梧",
    avatar: "./assets/npc-2.png"
  },
  {
    role: "npc-aluo",
    name: "阿洛",
    avatar: "./assets/npc-3.png"
  },
  {
    role: "npc-misheng",
    name: "弥生",
    avatar: "./assets/npc-4.png"
  },
  {
    role: "npc-xinghe",
    name: "星河",
    avatar: "./assets/npc-5.png"
  }
];

const npcCharacters = [
  {
    id: "npc-yunlan",
    name: "云岚",
    role: "情绪陪伴 NPC",
    avatar: "./assets/npc-1.png",
    status: "在线 · 适合夜间聊天",
    greeting: "我会先听你把心里的话说完整，再帮你慢慢整理情绪。",
    tags: ["陪伴", "倾听", "睡前"]
  },
  {
    id: "npc-qingwu",
    name: "青梧",
    role: "文化讲解 NPC",
    avatar: "./assets/npc-2.png",
    status: "在线 · 擅长东方故事",
    greeting: "把你想了解的词、诗、典故发给我，我会用轻松的方式讲给你听。",
    tags: ["文化", "学习", "翻译"]
  },
  {
    id: "npc-aluo",
    name: "阿洛",
    role: "行动教练 NPC",
    avatar: "./assets/npc-3.png",
    status: "在线 · 帮你拆任务",
    greeting: "你给我一个目标，我帮你拆成今天就能开始的三步。",
    tags: ["计划", "效率", "提醒"]
  },
  {
    id: "npc-misheng",
    name: "弥生",
    role: "创作灵感 NPC",
    avatar: "./assets/npc-4.png",
    status: "在线 · 适合写作和图像灵感",
    greeting: "给我一个画面、人物或情绪，我帮你扩展成故事和动态素材。",
    tags: ["创作", "灵感", "动态"]
  },
  {
    id: "npc-xinghe",
    name: "星河",
    role: "关系连接 NPC",
    avatar: "./assets/npc-5.png",
    status: "在线 · 帮你匹配人和需求",
    greeting: "说出你想找的人、技能或愿望，我会帮你在心桥里建立连接。",
    tags: ["匹配", "社交", "愿望"]
  }
];

const phoneDirectoryData = [
  { name: "小张", phone: "+86 136 5522 8899", pinyin: "xiaozhang" },
  { name: "张三", phone: "+86 139 0000 1122", pinyin: "zhangsan" },
  { name: "李四", phone: "+86 138 2211 3300", pinyin: "lisi" },
  { name: "王五", phone: "+86 137 6688 9900", pinyin: "wangwu" },
  { name: "林", phone: "+86 (517) 8961 3482", pinyin: "lin" }
];

const notificationQueue = [
  {
    title: "准备完成",
    time: "刚刚",
    body: "语言与隐私已准备好，点击进入启动设置。",
    avatar: "./assets/daoxin-logo.jpg"
  },
  {
    title: "智能体",
    time: "上午 11:07",
    body: "你的专属智能体已接入本地 whisper-base 和 Qwen2.5-0.5B-Instruct，语音回复当前使用系统中文 TTS。",
    avatar: "./assets/avatar-zhuangzi.jpg"
  },
  {
    title: "数字分身",
    time: "昨天",
    body: "数字人形象、声音和对话能力已放入当前验证版，可先体验完整流程。",
    avatar: "./assets/my-digital-human.jpg"
  },
  {
    title: "语音模块",
    time: "周五",
    body: "按住底部发送区会进入录音，松手后发送语音消息。",
    avatar: "./assets/daoxin-heart.jpg"
  },
  {
    title: "模型整包",
    time: "周四",
    body: "当前验证版已放入 whisper-base 和 Qwen2.5 本地模型；CosyVoice 与 DreamLite 保留模块入口。",
    avatar: "./assets/daoxin-logo.jpg"
  },
  {
    title: "隐私提醒",
    time: "周三",
    body: "未同意隐私政策前，不会进入模型下载流程。",
    avatar: "./assets/contact-import.jpg"
  }
];

const chatThreads = {
  "system-settings-inline": [
    { incoming: true, text: "这里是系统设置助手。你可以按住底部按钮说：修改设置、打开隐私策略、导出数据，下面的动态和技能愿望区会放系统教程、视频压缩包和学习资料。" }
  ],
  "system-search-inline": [
    { incoming: true, text: "这里是系统搜索助手。按住底部按钮说关键词，我会把搜索结果放在聊天区；下面的动态和技能愿望区会放搜索教程、示例视频和学习资料。" }
  ],
  agent: [
    { incoming: true, text: "我可以作为你的智能体，先帮你整理消息和任务。" },
    { incoming: false, text: "先从语音对话和未读消息开始。" }
  ],
  settings: [
    { incoming: true, text: "你想打开什么 APP，直接跟系统小助手说。比如：我要打开微信，我会帮你启动对应应用。" }
  ],
  wechat: [
    { incoming: true, text: "要发微信，直接点微信头像，或者按住下面输入框，用语音说‘打开微信’。" }
  ],
  "digital-human": [
    { incoming: true, text: "数字分身会承接你的头像、声音和表达方式。" },
    { incoming: false, text: "后面再接形象、声音和对话记忆。" }
  ],
  "phone-contacts": [
    { incoming: true, text: "要跟谁打电话、发短信，直接按住下面输入框，说出对方名字或者号码就可以。" }
  ],
  "npc-yunlan": [
    { incoming: true, text: "我是云岚。你可以把心里的话慢慢说给我听。" }
  ],
  "npc-qingwu": [
    { incoming: true, text: "我是青梧。想听一个词、一首诗或一个典故背后的故事吗？" }
  ],
  "npc-aluo": [
    { incoming: true, text: "我是阿洛。给我一个目标，我帮你拆成今天能做的三步。" }
  ],
  "npc-misheng": [
    { incoming: true, text: "我是弥生。给我一个画面，我帮你扩展成故事和动态灵感。" }
  ],
  "npc-xinghe": [
    { incoming: true, text: "我是星河。你想找的人、技能或愿望，我来帮你连接。" }
  ]
};

const defaultDynamicItems = [
  {
    title: "最新动态",
    image: "./assets/preview-app-intelligence.jpg"
  },
  {
    title: "语音交互片段",
    image: "./assets/home-cover.jpg"
  },
  {
    title: "关系与消息流",
    image: "./assets/wish-cover.jpg"
  }
];

const dynamicFeeds = {
  "system-settings-inline": {
    label: "系统设置",
    items: [
      { title: "设置教程视频", image: "./assets/system-settings.png" },
      { title: "隐私与权限说明包", image: "./assets/daoxin-logo.jpg" },
      { title: "账号安全操作指南", image: "./assets/preview-app-intelligence.jpg" }
    ]
  },
  "system-search-inline": {
    label: "系统搜索",
    items: [
      { title: "搜索教程视频", image: "./assets/system-search.png" },
      { title: "关键词示例素材包", image: "./assets/avatar-zhuangzi.jpg" },
      { title: "全站搜索学习指南", image: "./assets/preview-app-intelligence.jpg" }
    ]
  },
  agent: {
    label: "智能体",
    items: [
      { title: "智能体最新动态", image: "./assets/avatar-zhuangzi.jpg" },
      { title: "任务整理片段", image: "./assets/preview-app-intelligence.jpg" },
      { title: "语音模型已就绪", image: "./assets/home-cover.jpg" }
    ]
  },
  settings: {
    label: "系统",
    items: [
      { title: "系统启动设置", image: "./assets/daoxin-logo.jpg" },
      { title: "语言与隐私流程", image: "./assets/preview-app-intelligence.jpg" },
      { title: "本地语音和聊天已就绪", image: "./assets/daoxin-heart.jpg" }
    ]
  },
  wechat: {
    label: "微信",
    items: [
      { title: "微信入口", image: "./assets/open-wechat.jpg" },
      { title: "外部应用授权提示", image: "./assets/daoxin-logo.jpg" },
      { title: "语音打开微信", image: "./assets/daoxin-heart.jpg" }
    ]
  },
  "digital-human": {
    label: "数字分身",
    items: [
      { title: "数字分身形象", image: "./assets/my-digital-human.jpg" },
      { title: "声音与表达方式", image: "./assets/wish-cover.jpg" },
      { title: "记忆同步预览", image: "./assets/preview-app-intelligence.jpg" }
    ]
  },
  "phone-contacts": {
    label: "通讯录",
    items: [
      { title: "语音拨打电话", image: "./assets/contact-import.jpg" },
      { title: "语音发送短信", image: "./assets/daoxin-heart.jpg" },
      { title: "通讯录由原生壳同步", image: "./assets/daoxin-logo.jpg" }
    ]
  },
  "npc-yunlan": {
    label: "云岚",
    items: [
      { title: "云岚的陪伴时刻", image: "./assets/npc-1.png" },
      { title: "睡前倾听", image: "./assets/daoxin-heart.jpg" },
      { title: "情绪整理", image: "./assets/preview-app-intelligence.jpg" }
    ]
  },
  "npc-qingwu": {
    label: "青梧",
    items: [
      { title: "青梧讲东方故事", image: "./assets/npc-2.png" },
      { title: "典故轻讲", image: "./assets/home-cover.jpg" },
      { title: "文化翻译", image: "./assets/preview-app-intelligence.jpg" }
    ]
  },
  "npc-aluo": {
    label: "阿洛",
    items: [
      { title: "阿洛拆任务", image: "./assets/npc-3.png" },
      { title: "今日三步", image: "./assets/preview-app-intelligence.jpg" },
      { title: "行动提醒", image: "./assets/daoxin-heart.jpg" }
    ]
  },
  "npc-misheng": {
    label: "弥生",
    items: [
      { title: "弥生的创作灵感", image: "./assets/npc-4.png" },
      { title: "故事续写", image: "./assets/wish-cover.jpg" },
      { title: "动态画面", image: "./assets/home-cover.jpg" }
    ]
  },
  "npc-xinghe": {
    label: "星河",
    items: [
      { title: "星河连接需求", image: "./assets/npc-5.png" },
      { title: "愿望匹配", image: "./assets/wish-cover.jpg" },
      { title: "技能推荐", image: "./assets/preview-app-intelligence.jpg" }
    ]
  }
};

const squareFeeds = {
  skill: {
    addTitle: "添加技能",
    addBody: "写下你会的能力、产品、课程、技术或可以提供的服务，AI 会根据文字生成对应图片背景。",
    placeholder: "比如：我可以提供 AI 产品原型设计、课程咨询、技术服务",
    button: "让 AI 生成技能",
    respondTitle: "回应技能",
    respondHint: "写下你对别人技能、产品、课程或服务的评论，也可以说明你想如何对接或合作。",
    items: [
      { title: "AI 产品原型", body: "可以帮助把想法整理成可演示的产品界面。", image: "./assets/home-cover.jpg" },
      { title: "语音交互设计", body: "提供按住说话、ASR、TTS 的体验设计服务。", image: "./assets/preview-app-intelligence.jpg" },
      { title: "课程咨询", body: "把复杂能力拆成可以学习和练习的课程。", image: "./assets/wish-cover.jpg" }
    ]
  },
  wish: {
    addTitle: "添加愿望",
    addBody: "写下你想得到的需求、未来想做的事或梦想，AI 会根据文字生成对应图片背景。",
    placeholder: "比如：我想找到一起做多语言 AI 产品的伙伴",
    button: "让 AI 生成愿望",
    respondTitle: "回应愿望",
    respondHint: "写下你对别人梦想或需求的回应，也可以说明你能如何满足、帮助对方实现这个愿望。",
    items: [
      { title: "找到产品伙伴", body: "想找到一起做全球多语言 AI 产品的人。", image: "./assets/wish-cover.jpg" },
      { title: "做一个数字分身", body: "希望未来的自己可以被更自然地表达出来。", image: "./assets/my-digital-human.jpg" },
      { title: "完成第一版上架", body: "先做极简壳和 PWA 体验，稳定后再扩展。", image: "./assets/daoxin-logo.jpg" }
    ]
  }
};

const edgeModelModules = [
  {
    id: "whisperBase",
    title: "whisper-base 语音识别",
    subtitle: "普通话优先，兼容常见方言口音，当前验证版直接可用",
    size: "base",
    required: true
  },
  {
    id: "cosyVoiceLite",
    title: "CosyVoice-300M Lite",
    subtitle: "中文与方言友好的端侧 TTS 验证入口",
    size: "300M",
    required: true
  },
  {
    id: "qwenTiny",
    title: "Qwen2.5-0.5B-Instruct",
    subtitle: "0.5B 参数，量化后约 1GB，负责当前聊天验证",
    size: "≈1GB",
    required: true
  },
  {
    id: "dreamLite",
    title: "字节 DreamLite（即梦Lite）",
    subtitle: "文生图模型，当前用于动态、技能和愿望背景生成验证",
    size: "image",
    required: true
  },
  {
    id: "dialectPack",
    title: "方言增强包",
    subtitle: "粤语、川渝、闽南等由后台按地区策略静默配置",
    size: "280MB",
    required: false
  },
  {
    id: "chatStandard",
    title: "标准聊天模型",
    subtitle: "更强上下文与角色表达，后台静默排队更新",
    size: "980MB",
    required: false
  },
  {
    id: "videoAvatar",
    title: "数字人视频流包",
    subtitle: "唇形同步、音频处理与视频流核心",
    size: "1.45GB",
    required: false
  }
];

const rail = document.querySelector(".contact-rail");
const notificationArea = document.querySelector("#notificationArea");
const messageList = document.querySelector("#messageList");
const clearAllButton = document.querySelector("#clearAllNotifications");
const composerArea = document.querySelector(".composer-area");
const composerShell = document.querySelector("#composerShell");
const textComposer = document.querySelector("#textComposer");
const messageInput = document.querySelector("#messageInput");
const sendTextButton = document.querySelector("#sendTextButton");
const keyboardToggleButton = document.querySelector("#keyboardToggleButton");
const homeReturnButton = document.querySelector("#homeReturnButton");
const chatArea = document.querySelector("#chatArea");
const dynamicTitle = document.querySelector("#dynamicTitle");
const dynamicCard = document.querySelector("#dynamicCard");
const dynamicThumb = document.querySelector("#dynamicThumb");
const dynamicCaption = document.querySelector("#dynamicCaption");
const dynamicDetail = document.querySelector("#dynamicDetail");
const dynamicStage = document.querySelector("#dynamicStage");
const dynamicDetailImage = document.querySelector("#dynamicDetailImage");
const dynamicDetailTitle = document.querySelector("#dynamicDetailTitle");
const dynamicDetailMeta = document.querySelector("#dynamicDetailMeta");
const dynamicBackButton = document.querySelector("#dynamicBackButton");
const addDynamicButton = document.querySelector("#addDynamicButton");
const addDynamicDialog = document.querySelector("#addDynamicDialog");
const closeAddDynamic = document.querySelector("#closeAddDynamic");
const dynamicPrompt = document.querySelector("#dynamicPrompt");
const generateDynamicButton = document.querySelector("#generateDynamicButton");
const commentSheet = document.querySelector("#commentSheet");
const skillThumb = document.querySelector("#skillThumb");
const skillCaption = document.querySelector("#skillCaption");
const wishThumb = document.querySelector("#wishThumb");
const wishCaption = document.querySelector("#wishCaption");
const squareDetail = document.querySelector("#squareDetail");
const squareStage = document.querySelector("#squareStage");
const squareDetailImage = document.querySelector("#squareDetailImage");
const squareDetailTitle = document.querySelector("#squareDetailTitle");
const squareDetailBody = document.querySelector("#squareDetailBody");
const respondButton = document.querySelector("#respondButton");
const respondDialog = document.querySelector("#respondDialog");
const closeRespond = document.querySelector("#closeRespond");
const respondTitle = document.querySelector("#respondTitle");
const respondHint = document.querySelector("#respondHint");
const respondText = document.querySelector("#respondText");
const sendRespondButton = document.querySelector("#sendRespondButton");
const moduleMenuDialog = document.querySelector("#moduleMenuDialog");
const bindAccountButton = document.querySelector("#bindAccountButton");
const bindAccountDialog = document.querySelector("#bindAccountDialog");
const closeBindAccount = document.querySelector("#closeBindAccount");
const appFrame = document.querySelector(".app-frame");
const systemInlinePage = document.querySelector("#systemInlinePage");

const deleteThreshold = 112;
const holdToRecordMs = 650;
const validVoiceMs = 1200;
const editableRoles = new Set(["settings", "agent", "digital-human"]);

let activeRole = "settings";
let contactFrame = 0;
let visibleNotifications = [];
let pressTimer = 0;
let pressStartedAt = 0;
let pressPointerId = null;
let composerPressed = false;
let recording = false;
let textInputMode = false;
let ignoreNextClick = false;
let dynamicIndex = 0;
let activeSquareModule = "skill";
let squareIndex = 0;
let addMode = "dynamic";
let activeModuleElement = null;
let activeModuleWrapper = null;
let suppressModuleClick = false;
let edgeRuntime = "initializing";
let edgeModuleState = {};
let realChatStatus = { configured: false, model: "qwen2.5-0.5b-instruct int8 ONNX", checking: true };
let audioStream = null;
let mediaRecorder = null;
let audioChunks = [];

/* ── 语音管线 (离线 ASR+TTS) ── */
const voiceEngine = (() => {
  let worker = null;
  let nextId = 1;
  const pending = new Map();

  function post(type, payload = {}) {
    if (!worker) return Promise.reject(new Error("语音引擎未初始化"));
    const id = nextId++;
    return new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject });
      worker.postMessage({ id, type, payload }, payload.transfer || []);
    });
  }

  function handleMessage(event) {
    const msg = event.data || {};
    const job = pending.get(msg.id);
    if (!job) {
      /* 异步回调 (进度等) */
      if (msg.type === "loadProgress") {
        const { stage, progress } = msg.payload || {};
        if (stage === "asr") realChatStatus.voiceAsrProgress = progress;
        if (stage === "tts") realChatStatus.voiceTtsProgress = progress;
        refreshRealChatStatus();
      }
      return;
    }
    pending.delete(msg.id);
    if (msg.type === "error") {
      job.reject(new Error(msg.payload?.message || "语音引擎错误"));
    } else {
      job.resolve(msg.payload);
    }
  }

  function init() {
    if (!("Worker" in window)) return;
    worker = new Worker("./wasm/xinqiao-voice-worker.js", { type: "module" });
    worker.addEventListener("message", handleMessage);
    worker.addEventListener("error", () => { worker = null; });
    post("init");
    /* 后台静默加载模型 */
    post("loadASR");
    post("loadTTS");
  }

  return {
    init,
    transcribe: (audio, sampleRate) => post("transcribe", { audio, sampleRate, transfer: [audio.buffer] }),
    synthesize: (text, voice, speed, outputSampleRate) => post("synthesize", { text, voice, speed, outputSampleRate }),
    getStatus: () => post("getStatus"),
  };
})();

const moduleLayoutByRole = {};

const xinqiaoEngine = (() => {
  let worker = null;
  let nextId = 1;
  const pending = new Map();

  function updateState(payload = {}) {
    if (payload.runtime) edgeRuntime = payload.runtime;
    if (payload.modules) edgeModuleState = JSON.parse(JSON.stringify(payload.modules));
    renderEngineStatusIfVisible();
  }

  function resolveMessage(message) {
    const job = pending.get(message.id);
    updateState(message.payload);
    if (!job) return;
    if (message.type === "chatToken") {
      job.onToken?.(message.payload?.token || "");
      return;
    }
    if (message.type === "chatError") {
      pending.delete(message.id);
      job.reject(new Error(message.payload?.message || "本地聊天模型加载失败"));
      return;
    }
    if (message.type === "moduleProgress") return;
    pending.delete(message.id);
    job.resolve(message.payload);
  }

  function fallback(type, payload, handlers) {
    if (type === "transcribe") {
      return Promise.reject(new Error("本地 whisper-base 未加载。"));
    }
    if (type === "chat") {
      return Promise.reject(new Error("本地 Qwen2.5 Worker 不可用。"));
    }
    return Promise.resolve({ modules: edgeModuleState });
  }

  function post(type, payload = {}, handlers = {}) {
    if (!worker) return fallback(type, payload, handlers);
    const id = nextId++;
    return new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject, onToken: handlers.onToken });
      worker.postMessage({ id, type, payload }, payload.transfer || []);
    });
  }

  function init() {
    if (!("Worker" in window)) {
      edgeRuntime = "pwa-fallback";
      renderEngineStatusIfVisible();
      return;
    }
    worker = new Worker("./wasm/xinqiao-engine-worker.js", { type: "module" });
    worker.addEventListener("message", (event) => resolveMessage(event.data || {}));
    worker.addEventListener("error", () => {
      edgeRuntime = "worker-error-fallback";
      worker = null;
      renderEngineStatusIfVisible();
    });
    post("init");
  }

  return {
    init,
    transcribe: (payload) => post("transcribe", payload),
    chat: (payload, handlers) => post("chat", payload, handlers),
    textToImage: (payload) => post("textToImage", payload),
    syncPolicy: () => post("syncPolicy")
  };
})();

function activeContact() {
  return findContact(activeRole) || contacts[1];
}

function findContact(role) {
  return contacts.find((contact) => contact.role === role);
}

function canEditCurrentPage() {
  return editableRoles.has(activeRole);
}

/* 当前播放的 TTS AudioContext */
let _ttsAudioCtx = null;

async function speakText(text) {
  if (!text) return;
  /* 停止当前播放 */
  if (_ttsAudioCtx) { _ttsAudioCtx.close?.(); _ttsAudioCtx = null; }

  try {
    /* 优先用 Kokoro 离线 TTS */
    const result = await voiceEngine.synthesize(text, "female", 0.95);
    if (result?.audioBuffer) {
      const ctx = new AudioContext({ sampleRate: result.sampleRate });
      _ttsAudioCtx = ctx;
      const audioBuffer = ctx.createBuffer(1, result.audioBuffer.byteLength / 2, result.sampleRate);
      const view = new DataView(result.audioBuffer);
      const channelData = audioBuffer.getChannelData(0);
      for (let i = 0; i < channelData.length; i++) {
        channelData[i] = view.getInt16(i * 2, true) / 32768;
      }
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.start(0);
      source.onended = () => { _ttsAudioCtx = null; };
      return;
    }
  } catch (_) {
    /* Kokoro 不可用, 回退浏览器 TTS */
  }

  /* 回退: 浏览器 speechSynthesis */
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  const zhVoice = voices.find((v) => /^zh[-_]/i.test(v.lang))
    || voices.find((v) => /chinese|mandarin|xiaoxiao|xiaoyi|tingting|huihui/i.test(v.name));
  if (zhVoice) utterance.voice = zhVoice;
  utterance.lang = "zh-CN";
  utterance.rate = 0.96;
  utterance.pitch = 1.02;
  window.speechSynthesis.speak(utterance);
}

async function startAudioCapture() {
  audioChunks = [];
  audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(audioStream);
  mediaRecorder.addEventListener("dataavailable", (event) => {
    if (event.data.size) audioChunks.push(event.data);
  });
  mediaRecorder.start();
}

function decodeAudioBlob(blob) {
  return new Promise(async (resolve, reject) => {
    try {
      const arrayBuffer = await blob.arrayBuffer();
      const context = new AudioContext();
      const decoded = await context.decodeAudioData(arrayBuffer);
      const source = decoded.getChannelData(0);
      const targetRate = 16000;
      const ratio = decoded.sampleRate / targetRate;
      const length = Math.floor(source.length / ratio);
      const resampled = new Float32Array(length);
      for (let index = 0; index < length; index += 1) {
        resampled[index] = source[Math.floor(index * ratio)] || 0;
      }
      await context.close();
      resolve(resampled);
    } catch (error) {
      reject(error);
    }
  });
}

function stopAudioCapture() {
  return new Promise((resolve) => {
    if (!mediaRecorder || mediaRecorder.state === "inactive") {
      resolve(null);
      return;
    }
    mediaRecorder.addEventListener("stop", async () => {
      audioStream?.getTracks().forEach((track) => track.stop());
      audioStream = null;
      const blob = new Blob(audioChunks, { type: mediaRecorder.mimeType || "audio/webm" });
      mediaRecorder = null;
      if (!blob.size) {
        resolve(null);
        return;
      }
      const audio = await decodeAudioBlob(blob);
      const rms = Math.sqrt(audio.reduce((sum, sample) => sum + sample * sample, 0) / Math.max(audio.length, 1));
      resolve(rms > 0.008 ? audio : null);
    }, { once: true });
    mediaRecorder.stop();
  });
}

function matchesSearch(item, query) {
  if (!query) return true;
  const value = query.toLowerCase();
  return item.name.toLowerCase().includes(value)
    || item.pinyin.toLowerCase().includes(value)
    || item.phoneHash.includes(value);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  }[char]));
}

function textMatches(value, query) {
  if (!query) return true;
  return String(value).toLowerCase().includes(query.toLowerCase());
}

function collectSiteTextResults(query) {
  const results = [];

  Object.entries(chatThreads).forEach(([role, messages]) => {
    const contact = findContact(role);
    messages.forEach((message, index) => {
      if (!textMatches(message.text, query)) return;
      results.push({
        source: "聊天记录",
        title: contact?.name ? `${contact.name}的聊天` : "聊天记录",
        body: message.text,
        action: "chat",
        role,
        index
      });
    });
  });

  Object.entries(dynamicFeeds).forEach(([role, feed]) => {
    feed.items.forEach((item, index) => {
      const text = `${item.title}${item.body || ""}`;
      if (!textMatches(text, query)) return;
      results.push({
        source: "动态文字",
        title: `${feed.label}动态`,
        body: item.body || item.title,
        action: "dynamic",
        role,
        index
      });
    });
  });

  ["skill", "wish"].forEach((moduleName) => {
    const feed = squareFeeds[moduleName];
    feed.items.forEach((item, index) => {
      const text = `${item.title}${item.body}`;
      if (!textMatches(text, query)) return;
      results.push({
        source: moduleName === "skill" ? "技能内容" : "愿望内容",
        title: item.title,
        body: item.body,
        action: "square",
        module: moduleName,
        index
      });
    });
  });

  [...visibleNotifications, ...notificationQueue].forEach((notice, index) => {
    const text = `${notice.title}${notice.body}`;
    if (!textMatches(text, query)) return;
    results.push({
      source: "系统通知",
      title: notice.title,
      body: notice.body,
      action: "notification",
      role: "settings",
      index
    });
  });

  return results.slice(0, 12);
}

function currentVoiceTranscript(seconds = 1) {
  if (activeRole === "system-search-inline") return "小张";
  if (activeRole === "system-settings-inline") return "打开隐私策略";
  if (activeRole === "settings") return "我要打开微信";
  if (activeRole === "wechat") return "打开微信";
  if (activeRole === "phone-contacts") return "我要给张三打电话";
  return `语音转文字：这是一段 ${seconds} 秒的语音内容。`;
}

function searchResultItems(query) {
  const normalized = String(query || "").trim().toLowerCase();
  if (!normalized) return [];
  const contactResults = contacts
    .filter((item) => item.role !== "settings")
    .map((item) => ({
      source: "联系人",
      title: item.name || "系统",
      body: `进入 ${item.name || "系统"} 页面`,
      role: item.role,
      avatar: item.avatar,
      text: `${item.name || ""}${item.role || ""}`
    }))
    .filter((item) => textMatches(item.text, normalized));
  const directoryResults = phoneDirectoryData
    .map((item) => ({
      source: "手机通讯录",
      title: item.name,
      body: item.phone,
      role: "phone-contacts",
      text: `${item.name}${item.pinyin}${item.phone}`
    }))
    .filter((item) => textMatches(item.text, normalized));
  return [...directoryResults, ...contactResults, ...collectSiteTextResults(normalized)].slice(0, 12);
}

function openSearch() {
  selectRole("system-search-inline");
}

function closeSearch() {
}

function openSettingsPage() {
  closeSearch();
  selectRole("system-settings-inline");
}

function closeSettingsPage() {
}

function selectRole(role) {
  if (!role) return;
  exitTextInputMode();
  activeRole = role;
  renderActiveSurface();
  renderDynamicPreview();
  renderSquarePreviews();
  document.querySelectorAll(".contact-card").forEach((card) => {
    card.classList.toggle("is-active", card.dataset.role === role);
  });
  document.querySelector(`[data-role="${CSS.escape(role)}"]`)?.scrollIntoView({
    inline: "center",
    block: "nearest",
    behavior: "smooth"
  });
}

function enterTextInputMode() {
  if (textInputMode) {
    messageInput.focus();
    return;
  }
  stopRecordingFeedback();
  textInputMode = true;
  composerArea.classList.add("is-text-mode");
  textComposer.hidden = false;
  keyboardToggleButton.setAttribute("aria-pressed", "true");
  requestAnimationFrame(() => messageInput.focus());
}

function exitTextInputMode() {
  textInputMode = false;
  textComposer.hidden = true;
  messageInput.value = "";
  messageInput.blur();
  composerArea.classList.remove("is-text-mode");
  keyboardToggleButton?.setAttribute("aria-pressed", "false");
}

function returnHome() {
  closeSearch();
  closeSettingsPage();
  closeDynamicDetail();
  closeSquareDetail();
  commentSheet.hidden = true;
  exitTextInputMode();
  selectRole("settings");
  requestAnimationFrame(() => {
    appFrame.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function renderInlineSettingsPage() {
  systemInlinePage.innerHTML = `
    <article class="inline-system-card inline-settings-card">
      <header class="inline-system-hero">
        <img src="./assets/system-settings.png" alt="" />
        <div>
          <span>系统设置</span>
          <h2>设置中心</h2>
          <p>这里保留账号、隐私、权限和数据设置。你也可以直接按住底部按钮说出设置指令。</p>
        </div>
      </header>

      <section class="inline-system-section">
        <h3>隐私与可见范围</h3>
        <div class="privacy-segment inline-privacy-segment" role="group" aria-label="主页设置公开范围">
          <button class="is-selected" type="button" aria-pressed="true">公开主页</button>
          <button type="button" aria-pressed="false">仅好友</button>
          <button type="button" aria-pressed="false">仅自己</button>
        </div>
        <label class="phone-find-toggle inline-toggle">
          <input type="checkbox" checked />
          <span>允许别人通过手机号找到我</span>
        </label>
      </section>

      <section class="inline-system-section">
        <h3>账号与数据</h3>
        <div class="inline-settings-grid">
          <button type="button" data-inline-settings-action="bind">绑定账号</button>
          <button type="button" data-inline-settings-action="qr">二维码</button>
          <button type="button" data-inline-settings-action="export">导出数据</button>
          <button type="button" data-inline-settings-action="logout">退出登录</button>
        </div>
      </section>

      <section class="inline-system-section">
        <h3>端侧 AI 引擎</h3>
        <div class="edge-budget-card">
          <span>当前验证版 <b>整体打包可用</b></span>
          <span>生产安装包 <b>首包 ≤ 80MB</b></span>
          <span>完整静默资源 <b>≤ 3.5GB</b></span>
          <small>翻译、人脸特征提取、智能网关当前不依赖后端，直接前端独立运行。</small>
          <small>生产版由后台按地区和设备策略决定资源包，按顺序静默下载与更新，不让用户手动选择。</small>
        </div>
        <div class="edge-demo-actions" aria-label="模型体验">
          <button type="button" data-engine-demo="asr">测语音识别</button>
          <button type="button" data-engine-demo="tts">试听 TTS</button>
          <button type="button" data-engine-demo="chat">测聊天</button>
          <button type="button" data-engine-demo="image">测文生图</button>
        </div>
        <div class="edge-module-list" id="edgeModuleList"></div>
      </section>

      <section class="inline-system-section">
        <h3>协议与安全</h3>
        <div class="inline-settings-grid">
          <a href="#privacy" target="_blank" rel="noopener">隐私协议</a>
          <a href="#terms" target="_blank" rel="noopener">服务协议</a>
          <a href="#data-safety" target="_blank" rel="noopener">数据安全</a>
          <a href="#permissions" target="_blank" rel="noopener">权限告知</a>
        </div>
      </section>
    </article>
  `;
  renderEngineStatusIfVisible();
}

function renderEngineStatusIfVisible() {
  const list = document.querySelector("#edgeModuleList");
  if (!list) return;
  list.innerHTML = edgeModelModules.map((module) => {
    const state = edgeModuleState[module.id] || {};
    const ready = module.id === "qwenTiny" ? realChatStatus.configured : state.status === "ready" || !state.status;
    const missing = state.status === "missing";
    const queue = state.queue || "后台策略";
    const status = module.id === "qwenTiny"
      ? realChatStatus.configured
        ? `本地模型已就绪：${realChatStatus.model}`
        : realChatStatus.checking
          ? "正在检查本地模型文件"
          : "本地模型文件不完整"
      : missing ? "缺本地模型文件" : ready ? "本地模型已就绪" : "后台静默准备";
    return `
      <article class="edge-module-card ${ready ? "is-ready" : ""}">
        <div>
          <strong>${module.title}</strong>
          <span>${module.subtitle}</span>
          <small>${module.required ? "基础能力" : "地区/设备策略包"} · ${module.size} · ${queue} · ${status}</small>
        </div>
        <button type="button" disabled>${missing ? "缺文件" : ready ? "已可用" : "等待"}</button>
      </article>
    `;
  }).join("");
  const runtime = document.createElement("p");
  runtime.className = "edge-runtime-line";
  runtime.textContent = `运行层：${edgeRuntime} · 当前验证版本地 ASR 与聊天可用，正式版后台下发地区策略，壳与 PWA 不暴露用户选择入口。`;
  list.appendChild(runtime);
}

async function refreshRealChatStatus() {
  /* 模型通过 HuggingFace 镜像远程加载，不检查本地文件 */
  realChatStatus = {
    configured: true,
    model: "Qwen2.5-1.5B-Instruct (远程加载)",
    checking: false
  };
  renderEngineStatusIfVisible();
}

function feedFor(role = activeRole) {
  const contact = findContact(role);
  if (dynamicFeeds[role]) return dynamicFeeds[role];
  return {
    label: contact?.name || "联系人",
    items: defaultDynamicItems
  };
}

function renderDynamicPreview() {
  const feed = feedFor();
  const [latest] = feed.items;
  dynamicTitle.textContent = `${feed.label}动态`;
  dynamicThumb.src = latest.image;
  dynamicCaption.textContent = latest.title;
}

function renderSquarePreviews() {
  const systemSquarePresets = {
    "system-settings-inline": {
      skill: { title: "设置操作视频包", image: "./assets/system-settings.png" },
      wish: { title: "权限与隐私学习区", image: "./assets/daoxin-logo.jpg" }
    },
    "system-search-inline": {
      skill: { title: "搜索使用视频包", image: "./assets/system-search.png" },
      wish: { title: "关键词训练和案例", image: "./assets/preview-app-intelligence.jpg" }
    }
  };
  const preset = systemSquarePresets[activeRole];
  const skill = preset?.skill || squareFeeds.skill.items[0] || {
    title: "添加你的技能",
    image: "./assets/home-cover.jpg"
  };
  const wish = preset?.wish || squareFeeds.wish.items[0] || {
    title: "添加你的愿望",
    image: "./assets/wish-cover.jpg"
  };
  skillThumb.src = skill.image;
  skillCaption.textContent = skill.title;
  wishThumb.src = wish.image;
  wishCaption.textContent = wish.title;
}

function moduleWrappers() {
  return [
    { key: "dynamic", wrapper: dynamicCard.closest(".dynamic-area") },
    { key: "skill", wrapper: document.querySelector('[data-module="skill"]') },
    { key: "wish", wrapper: document.querySelector('[data-module="wish"]') }
  ];
}

function currentModuleLayout() {
  moduleLayoutByRole[activeRole] ||= {};
  return moduleLayoutByRole[activeRole];
}

function applyModuleLayout() {
  const layout = currentModuleLayout();
  moduleWrappers().forEach(({ key, wrapper }) => {
    if (!wrapper) return;
    const state = layout[key] || {};
    wrapper.hidden = Boolean(state.hidden);
    wrapper.classList.remove("module-size-large", "module-size-small");
    wrapper.style.transform = "";
    if (state.size === "large") wrapper.classList.add("module-size-large");
    if (state.size === "small") wrapper.classList.add("module-size-small");
  });
}

function updateEditableState() {
  const editable = canEditCurrentPage();
  document.querySelectorAll(".contact-card span").forEach((span) => {
    span.contentEditable = editable ? "true" : "false";
  });
  [dynamicCaption, skillCaption, wishCaption].forEach((node) => {
    node.contentEditable = editable ? "true" : "false";
  });
  document.querySelectorAll(".dynamic-card, .square-card").forEach((node) => {
    node.classList.toggle("editable-module", editable);
  });
}

function renderActiveSurface() {
  stopRecordingFeedback();
  const isSystemPage = activeRole === "settings";
  const isSettingsInlinePage = activeRole === "system-settings-inline";
  document.body.classList.toggle("system-page", isSystemPage);
  document.body.classList.toggle("phone-directory-page", activeRole === "phone-contacts");
  notificationArea.hidden = !isSystemPage;
  chatArea.hidden = isSystemPage;
  systemInlinePage.hidden = !isSettingsInlinePage;
  composerArea.hidden = false;
  if (isSystemPage) {
    renderNotifications();
  } else {
    renderChat();
  }
  if (isSettingsInlinePage) {
    renderInlineSettingsPage();
  } else {
    systemInlinePage.innerHTML = "";
  }
  clearAllButton.setAttribute("aria-label", isSystemPage ? "清空所有通知" : "清空当前聊天");
  updateEditableState();
  applyModuleLayout();
}

function ensureFeed(role = activeRole) {
  if (!dynamicFeeds[role]) {
    const contact = findContact(role);
    dynamicFeeds[role] = {
      label: contact?.name || "联系人",
      items: [...defaultDynamicItems]
    };
  }
  return dynamicFeeds[role];
}

function updateContactFocus() {
  contactFrame = 0;
  const railBox = rail.getBoundingClientRect();
  const center = railBox.left + railBox.width / 2;
  let activeCard = null;
  let activeDistance = Infinity;

  document.querySelectorAll(".contact-card").forEach((card) => {
    const box = card.getBoundingClientRect();
    const cardCenter = box.left + box.width / 2;
    const distance = Math.abs(center - cardCenter);
    const strength = Math.max(0, 1 - distance / 168);
    card.style.setProperty("--scale", (0.72 + strength * 0.5).toFixed(3));
    card.style.setProperty("--opacity", (0.46 + strength * 0.54).toFixed(3));
    card.style.setProperty("--blur", `${(0.72 - strength * 0.72).toFixed(2)}px`);

    if (distance < activeDistance) {
      activeCard = card;
      activeDistance = distance;
    }
  });

  if (!activeCard) return;
  const nextRole = activeCard.dataset.role;
  document.querySelectorAll(".contact-card").forEach((card) => {
    card.classList.toggle("is-active", card === activeCard);
  });
  if (nextRole && nextRole !== activeRole) {
    activeRole = nextRole;
    renderActiveSurface();
    renderDynamicPreview();
    renderSquarePreviews();
  }
}

function scheduleContactFocus() {
  if (contactFrame) return;
  contactFrame = requestAnimationFrame(updateContactFocus);
}

function bindContactCard(card) {
  card.addEventListener("click", () => {
    const systemAction = card.dataset.systemAction;
    if (systemAction) {
      card.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
      if (systemAction === "settings") openSettingsPage();
      if (systemAction === "search") openSearch();
      return;
    }
    if (card.dataset.role && card.dataset.role !== activeRole) {
      activeRole = card.dataset.role;
      renderActiveSurface();
      renderDynamicPreview();
      renderSquarePreviews();
    }
    document.querySelectorAll(".contact-card").forEach((item) => {
      item.classList.toggle("is-active", item === card);
    });
    card.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  });
}

document.querySelectorAll(".contact-card").forEach(bindContactCard);

rail.addEventListener("scroll", scheduleContactFocus, { passive: true });
window.addEventListener("resize", scheduleContactFocus);

function bindPageDragScroll(surface) {
  let activePointer = null;
  let lastY = 0;
  let dragging = false;

  const stop = () => {
    activePointer = null;
    dragging = false;
  };

  surface.addEventListener("pointerdown", (event) => {
    if (event.target.closest("button, a, input, textarea, select")) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    activePointer = event.pointerId;
    lastY = event.clientY;
    dragging = false;
    surface.setPointerCapture?.(event.pointerId);
  });

  surface.addEventListener("pointermove", (event) => {
    if (activePointer !== event.pointerId) return;
    const deltaY = lastY - event.clientY;
    if (!dragging && Math.abs(deltaY) < 4) return;
    dragging = true;
    appFrame.scrollTop += deltaY;
    lastY = event.clientY;
    event.preventDefault();
  });

  surface.addEventListener("pointerup", stop);
  surface.addEventListener("pointercancel", stop);
}

bindPageDragScroll(chatArea);
bindPageDragScroll(messageList);

function takeNextNotification() {
  return notificationQueue.shift() || null;
}

function refillNotifications() {
  while (visibleNotifications.length < 3 && notificationQueue.length) {
    const next = takeNextNotification();
    if (!next) break;
    visibleNotifications.push({ ...next, id: crypto.randomUUID?.() || `notice-${Date.now()}-${Math.random()}` });
  }
}

function notificationMarkup(item) {
  return `
    <div class="delete-backdrop" aria-hidden="true">
      <span>删除</span>
    </div>
    <div class="message-card" tabindex="0">
      <img class="message-avatar" src="${item.avatar}" alt="" />
      <div class="message-copy">
        <div class="message-topline">
          <strong>${item.title}</strong>
          <time>${item.time}</time>
        </div>
        <p>${item.body}</p>
      </div>
    </div>
  `;
}

function renderNotifications({ animateNew = false } = {}) {
  refillNotifications();
  messageList.innerHTML = "";
  const systemRows = [
    ...visibleNotifications.map((item) => ({ kind: "notification", item })),
    ...(chatThreads.settings || []).map((item) => ({ kind: "chat", item: ensureMessageId(item) }))
  ].slice(-3);

  systemRows.forEach((entry, index) => {
    const row = document.createElement("article");
    row.className = `message-row ${entry.kind === "chat" ? "system-chat-row" : ""} ${animateNew && index === systemRows.length - 1 ? "is-new" : ""}`;
    row.dataset.kind = entry.kind;
    row.dataset.id = entry.item.id;
    row.innerHTML = entry.kind === "chat" ? systemChatMarkup(entry.item) : notificationMarkup(entry.item);
    messageList.appendChild(row);
    bindSystemMessageSwipe(row);
  });
}

function removeNotification(id) {
  visibleNotifications = visibleNotifications.filter((item) => item.id !== id);
  renderNotifications({ animateNew: true });
}

function ensureMessageId(message) {
  message.id ||= crypto.randomUUID?.() || `chat-${Date.now()}-${Math.random()}`;
  return message;
}

function systemChatMarkup(message) {
  const systemContact = findContact("settings") || contacts[2];
  return `
    <div class="delete-backdrop" aria-hidden="true">
      <span>删除</span>
    </div>
    <div class="message-card system-chat-card ${message.incoming ? "incoming" : "outgoing"}" tabindex="0">
      ${message.incoming
        ? `
        <div class="chat-side-tools">
          <img src="${systemContact.avatar}" alt="" />
          <button class="voice-play-button" type="button" aria-label="播放语音">▶</button>
        </div>
        <div class="message-copy">
          <div class="message-topline">
            <strong>系统</strong>
            <time>刚刚</time>
          </div>
          <p>${escapeHtml(message.text)}</p>
        </div>
        `
        : `
        <div class="message-copy">
          <div class="message-topline">
            <strong>我</strong>
            <time>刚刚</time>
          </div>
          <p>${escapeHtml(message.text)}</p>
        </div>
        `}
    </div>
  `;
}

function removeSystemRow(kind, id) {
  if (kind === "chat") {
    chatThreads.settings = (chatThreads.settings || []).filter((message) => message.id !== id);
  } else {
    visibleNotifications = visibleNotifications.filter((item) => item.id !== id);
  }
  renderNotifications({ animateNew: true });
}

function bindSystemMessageSwipe(row) {
  const card = row.querySelector(".message-card");
  row.querySelector(".voice-play-button")?.addEventListener("click", (event) => {
    event.stopPropagation();
    const message = (chatThreads.settings || []).find((item) => item.id === row.dataset.id);
    if (message) speakText(message.text);
  });
  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let dragging = false;
  let horizontalIntent = false;

  function setSwipe(value) {
    currentX = Math.min(0, Math.max(value, -168));
    const progress = Math.min(Math.abs(currentX) / deleteThreshold, 1);
    row.style.setProperty("--swipe-x", `${currentX}px`);
    row.style.setProperty("--delete-opacity", progress.toFixed(3));
    row.style.setProperty("--delete-shift", `${16 - progress * 16}px`);
  }

  function finishSwipe() {
    row.classList.remove("is-dragging");
    dragging = false;
    horizontalIntent = false;

    if (Math.abs(currentX) >= deleteThreshold) {
      setSwipe(-window.innerWidth);
      row.classList.add("is-removing");
      window.setTimeout(() => removeSystemRow(row.dataset.kind, row.dataset.id), 260);
      return;
    }

    setSwipe(0);
  }

  card.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    startX = event.clientX;
    startY = event.clientY;
    currentX = 0;
    dragging = true;
    horizontalIntent = false;
    row.classList.add("is-dragging");
    card.setPointerCapture(event.pointerId);
  });

  card.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;

    if (!horizontalIntent && Math.abs(deltaX) > 8) {
      horizontalIntent = Math.abs(deltaX) > Math.abs(deltaY);
    }
    if (!horizontalIntent) return;

    event.preventDefault();
    setSwipe(deltaX < 0 ? deltaX : deltaX * 0.18);
  });

  card.addEventListener("pointerup", finishSwipe);
  card.addEventListener("pointercancel", finishSwipe);
}

function renderChat() {
  const contact = activeContact();
  chatArea.innerHTML = "";
  if (activeRole === "phone-contacts") {
    const directoryLayer = document.createElement("div");
    directoryLayer.className = "phone-directory-background";
    directoryLayer.setAttribute("aria-hidden", "true");
    directoryLayer.innerHTML = phoneDirectoryData.map((item) => `
      <span><b>${escapeHtml(item.name)}</b>${escapeHtml(item.phone)}</span>
    `).join("");
    chatArea.appendChild(directoryLayer);
  }
  for (const message of chatThreads[activeRole] || []) {
    const bubble = document.createElement("div");
    bubble.className = `chat-message ${message.incoming ? "incoming" : "outgoing"}`;
    bubble.innerHTML = message.incoming
      ? `
        <div class="chat-side-tools">
          <img src="${contact.avatar}" alt="" />
          <button class="voice-play-button" type="button" aria-label="播放语音">▶</button>
        </div>
        <div class="chat-bubble-wrap">
          <p>${escapeHtml(message.text)}</p>
        </div>
      `
      : `<p>${escapeHtml(message.text)}</p>`;
    bubble.querySelector(".voice-play-button")?.addEventListener("click", () => speakText(message.text));
    chatArea.appendChild(bubble);
  }
  chatArea.scrollTop = chatArea.scrollHeight;
}

function addChatBubble({ text = "", outgoing = true, autoSpeak = false }) {
  const thread = chatThreads[activeRole] ||= [];
  const message = { incoming: !outgoing, text };
  thread.push(message);
  if (activeRole === "settings") {
    renderNotifications();
  } else {
    renderChat();
  }
  if (!outgoing && autoSpeak) speakText(text);
  return message;
}

function updateIncomingBubble(message, token) {
  message.text = `${message.text || ""}${token}`;
  if (activeRole === "settings") {
    renderNotifications();
  } else {
    renderChat();
  }
}

function finishIncomingBubble(message) {
  if (activeRole === "settings") {
    renderNotifications({ animateNew: true });
  } else {
    renderChat();
  }
  if (message.text) speakText(message.text);
}

async function runEngineDemo(kind) {
  if (kind === "asr") {
    showComposerHint("请按住底部说话测试 whisper-base");
    return;
  }

  if (kind === "tts") {
    speakText("当前使用系统中文语音播放。CosyVoice 本地模型文件接入后会替换这里。");
    showComposerHint("系统中文 TTS 已播放");
    return;
  }

  if (kind === "chat") {
    addChatBubble({ text: "请用 Qwen2.5 帮我测试当前心桥聊天。" });
    simulateIncomingReply();
    showComposerHint("Qwen2.5 正在回复");
    return;
  }

  if (kind === "image") {
    const feed = ensureFeed();
    const result = await xinqiaoEngine.textToImage({
      prompt: "心桥里一个温暖的 AI 连接场景",
      mode: "dynamic"
    });
    feed.items.unshift({
      title: result?.caption || "本地图像占位",
      image: result?.image || "./assets/preview-app-intelligence.jpg"
    });
    renderDynamicPreview();
    showComposerHint("DreamLite 模型文件待接入");
  }
}

function findDirectoryMatch(text) {
  const value = String(text || "").toLowerCase();
  return phoneDirectoryData.find((item) => {
    const normalizedPhone = item.phone.replace(/\D/g, "");
    const spokenDigits = value.replace(/\D/g, "");
    return value.includes(item.name.toLowerCase())
      || value.includes(item.pinyin)
      || (spokenDigits && normalizedPhone.includes(spokenDigits));
  });
}

async function simulateIncomingReply() {
  const role = activeRole;
  const lastOutgoing = [...(chatThreads[role] || [])].reverse().find((message) => !message.incoming);
  const text = lastOutgoing?.text || "";
  const incoming = addChatBubble({ text: "本地 Qwen2.5 正在加载并生成...", outgoing: false });

  try {
    incoming.text = "";
    await xinqiaoEngine.chat({ role, text }, {
      onToken: (token) => updateIncomingBubble(incoming, token)
    });
  } catch (error) {
    incoming.text = `真实聊天模型未连接：${error.message}`;
    finishIncomingBubble(incoming);
    return;
  }

  if (role === "system-search-inline") {
    const results = searchResultItems(text);
    if (results.length) {
      incoming.text = `${incoming.text}\n${results.map((item) => `${item.source}：${item.title}，${item.body}`).join("；")}`;
    }
  }

  if (role === "phone-contacts") {
    const matched = findDirectoryMatch(text);
    if (matched) incoming.text = `找到 ${matched.name}：${matched.phone}。我会把这个号码交给电话或短信 APP。`;
  }

  finishIncomingBubble(incoming);
}

function renderDynamicDetail() {
  const feed = feedFor();
  const items = feed.items.length ? feed.items : defaultDynamicItems;
  const item = items[((dynamicIndex % items.length) + items.length) % items.length];
  dynamicDetailImage.src = item.image;
  dynamicDetailTitle.textContent = item.title;
  dynamicDetailMeta.textContent = `${dynamicIndex + 1}/${items.length} · 上下滑动切换`;
}

function openDynamicDetail(index = 0) {
  dynamicIndex = index;
  renderDynamicDetail();
  dynamicDetail.hidden = false;
}

function closeDynamicDetail() {
  dynamicDetail.style.removeProperty("--detail-y");
  dynamicDetail.style.removeProperty("--detail-opacity");
  dynamicDetail.hidden = true;
}

function stepDynamic(direction) {
  const itemCount = feedFor().items.length || defaultDynamicItems.length;
  dynamicIndex = (dynamicIndex + direction + itemCount) % itemCount;
  renderDynamicDetail();
}

function renderSquareDetail() {
  const feed = squareFeeds[activeSquareModule];
  const item = feed.items[squareIndex] || {
    title: activeSquareModule === "skill" ? "暂无技能" : "暂无愿望",
    body: "添加一条内容后会显示在这里。",
    image: activeSquareModule === "skill" ? "./assets/home-cover.jpg" : "./assets/wish-cover.jpg"
  };
  squareDetailImage.src = item.image;
  squareDetailTitle.textContent = item.title;
  squareDetailBody.textContent = item.body;
}

function openSquareDetail(moduleName, index = 0) {
  activeSquareModule = moduleName;
  squareIndex = index;
  renderSquareDetail();
  squareDetail.hidden = false;
}

function closeSquareDetail() {
  squareDetail.hidden = true;
}

function stepSquare() {
  const feed = squareFeeds[activeSquareModule];
  if (feed.items.length > 1) {
    feed.items.splice(squareIndex, 1);
    squareIndex %= feed.items.length;
  } else {
    feed.items.splice(squareIndex, 1);
    squareIndex = 0;
  }
  renderSquarePreviews();
  renderSquareDetail();
}

function openRespondDialog() {
  const feed = squareFeeds[activeSquareModule];
  respondTitle.textContent = feed.respondTitle;
  respondHint.textContent = feed.respondHint;
  respondText.value = "";
  respondDialog.showModal();
  requestAnimationFrame(() => respondText.focus());
}

function closeRespondDialog() {
  respondDialog.close();
}

function openModuleMenu(target) {
  if (!canEditCurrentPage()) return;
  activeModuleElement = target;
  activeModuleWrapper = target.closest(".dynamic-area, .square-module");
  moduleMenuDialog.showModal();
}

function bindLongPressMenu(node) {
  let timer = 0;
  let startX = 0;
  let startY = 0;

  node.querySelectorAll("img").forEach((image) => {
    image.draggable = false;
  });

  const clearTimer = () => {
    window.clearTimeout(timer);
    timer = 0;
  };

  node.addEventListener("pointerdown", (event) => {
    if (!canEditCurrentPage()) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    startX = event.clientX;
    startY = event.clientY;
    clearTimer();
    timer = window.setTimeout(() => {
      openModuleMenu(node);
    }, 520);
  });

  node.addEventListener("pointermove", (event) => {
    if (!timer) return;
    const moved = Math.hypot(event.clientX - startX, event.clientY - startY);
    if (moved > 18) clearTimer();
  });

  ["pointerup", "pointercancel", "pointerleave"].forEach((eventName) => {
    node.addEventListener(eventName, clearTimer);
  });
}

function setModuleSize(wrapper, size) {
  if (!wrapper) return;
  const entry = moduleWrappers().find((item) => item.wrapper === wrapper);
  if (entry) {
    currentModuleLayout()[entry.key] ||= {};
    currentModuleLayout()[entry.key].size = size;
    currentModuleLayout()[entry.key].hidden = false;
  }
  wrapper.classList.remove("module-size-large", "module-size-small");
  wrapper.classList.add(size === "large" ? "module-size-large" : "module-size-small");
}

function configureAddDialog(mode) {
  addMode = mode;
  const copy = mode === "dynamic"
    ? {
        title: "添加动态",
        body: "写下你的动态，AI 会根据内容生成相应的图片或视频。",
        placeholder: "比如：今天和智能体聊了一个新的想法",
        button: "让 AI 生成动态"
      }
    : squareFeeds[mode];
  document.querySelector("#addDynamicTitle").textContent = copy.addTitle || copy.title;
  addDynamicDialog.querySelector("p").textContent = copy.addBody || copy.body;
  dynamicPrompt.placeholder = copy.placeholder;
  generateDynamicButton.textContent = copy.button;
}

function openAddDynamicDialog(mode = "dynamic") {
  configureAddDialog(mode);
  dynamicPrompt.value = "";
  addDynamicDialog.showModal();
  requestAnimationFrame(() => dynamicPrompt.focus());
}

function closeAddDynamicDialog() {
  addDynamicDialog.close();
}

async function generateDynamic() {
  const prompt = dynamicPrompt.value.trim();
  generateDynamicButton.disabled = true;
  generateDynamicButton.textContent = "模型生成中...";
  const imageResult = await xinqiaoEngine.textToImage({ prompt, mode: addMode });
  const generatedImage = imageResult?.image || "./assets/preview-app-intelligence.jpg";
  const generatedCaption = imageResult?.caption || prompt;
  if (addMode === "dynamic") {
    const feed = ensureFeed();
    const title = generatedCaption || `${feed.label}的新动态`;
    feed.items.unshift({
      title,
      image: generatedImage
    });
    renderDynamicPreview();
  } else {
    const feed = squareFeeds[addMode];
    const title = generatedCaption || (addMode === "skill" ? "新的技能" : "新的愿望");
    feed.items.unshift({
      title,
      body: prompt || (addMode === "skill" ? "我可以提供新的技能或服务。" : "我想得到一个新的愿望回应。"),
      image: generatedImage
    });
    renderSquarePreviews();
  }
  generateDynamicButton.disabled = false;
  configureAddDialog(addMode);
  closeAddDynamicDialog();
  showComposerHint(addMode === "dynamic" ? "已添加本地动态占位" : "已添加本地背景占位");
}

function showComposerHint(text) {
  const hint = document.querySelector(".record-hint");
  hint.textContent = text;
  composerArea.classList.add("show-hint");
  window.setTimeout(() => {
    composerArea.classList.remove("show-hint");
  }, 620);
}

function stopRecordingFeedback() {
  composerPressed = false;
  recording = false;
  ignoreNextClick = false;
  resetPress();
  composerArea.classList.remove("is-recording", "show-hint");
}

function startRecording() {
  if (!composerPressed || textInputMode) return;
  recording = true;
  ignoreNextClick = true;
  composerArea.classList.remove("show-hint");
  composerArea.classList.add("is-recording");
  document.querySelector(".record-hint").textContent = "正在录音";
  /* 统一用 MediaRecorder 录音，松手后由 voiceEngine (Whisper) 识别 */
  startAudioCapture().catch(() => {
    /* MediaRecorder 不可用时回退浏览器语音识别 */
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        window._activeRecog = new SpeechRecognition();
        window._activeRecog.lang = "zh-CN";
        window._activeRecog.continuous = true;
        window._activeRecog.interimResults = true;
        window._activeRecog.maxAlternatives = 1;
        window._activeRecog._transcript = "";
        window._activeRecog.onresult = (e) => {
          let final = "";
          for (let i = 0; i < e.results.length; i++) {
            if (e.results[i].isFinal) final += e.results[i][0].transcript;
          }
          window._activeRecog._transcript = final || e.results[e.results.length - 1]?.[0]?.transcript || "";
        };
        window._activeRecog.onerror = () => {};
        window._activeRecog.start();
      } catch (_) { window._activeRecog = null; }
    } else {
      showComposerHint("麦克风权限不可用");
    }
  });
  messageInput.blur();
}

function resetPress() {
  window.clearTimeout(pressTimer);
  pressTimer = 0;
  pressPointerId = null;
}

async function finishRecording() {
  if (!composerPressed && !recording && !pressTimer) return;
  const heldMs = performance.now() - pressStartedAt;
  const wasRecording = recording;
  composerPressed = false;
  recording = false;
  resetPress();
  composerArea.classList.remove("is-recording");

  if (!wasRecording) {
    return;
  }

  if (heldMs < validVoiceMs) {
    return;
  }

  try {
    /* 优先: MediaRecorder 录音 → voiceEngine (Whisper) 离线识别 */
    const audio = await stopAudioCapture();
    if (audio) {
      showComposerHint("离线识别中...");
      const result = await voiceEngine.transcribe(audio, 16000);
      const transcript = result?.text || "";
      if (transcript) {
        addChatBubble({ text: transcript });
        simulateIncomingReply();
      } else {
        addChatBubble({ text: "未识别到文字" });
      }
    } else if (window._activeRecog) {
      /* 回退: 浏览器语音识别结果 */
      showComposerHint("识别完成");
      const recog = window._activeRecog;
      window._activeRecog = null;
      const transcript = await new Promise((resolve) => {
        setTimeout(() => {
          recog.stop();
          resolve(recog._transcript || "");
        }, 400);
      });
      addChatBubble({ text: transcript || "未识别到文字" });
      if (transcript) simulateIncomingReply();
    } else {
      showComposerHint("没有录到语音");
    }
  } catch (error) {
    /* voiceEngine 失败, 尝试回退 xinqiaoEngine (老 Worker) */
    try {
      const audio2 = await stopAudioCapture();
      if (audio2) {
        const result = await xinqiaoEngine.transcribe({ audio: audio2, transfer: [audio2.buffer] });
        const transcript = result?.text || "";
        addChatBubble({ text: transcript || "未识别到文字" });
        if (transcript) simulateIncomingReply();
        return;
      }
    } catch (_) { /* ignore */ }
    addChatBubble({ text: `语音识别失败：${error.message}` });
    showComposerHint("语音识别失败");
  }
}

function isVoiceHotZoneEvent(event) {
  if (textInputMode) return false;
  if (event.target.closest(".bottom-icon-button, .text-composer")) return false;
  return Boolean(event.target.closest(".composer-area"));
}

composerArea.addEventListener("pointerdown", (event) => {
  if (!isVoiceHotZoneEvent(event)) return;
  if (textInputMode) return;
  if (event.pointerType === "mouse" && event.button !== 0) return;
  event.stopPropagation();
  event.preventDefault();
  pressStartedAt = performance.now();
  pressPointerId = event.pointerId;
  composerPressed = true;
  recording = false;
  ignoreNextClick = false;
  composerArea.setPointerCapture(event.pointerId);
  startRecording();
});

composerArea.addEventListener("pointerup", (event) => {
  if (pressPointerId !== event.pointerId) return;
  event.stopPropagation();
  finishRecording();
});

composerArea.addEventListener("pointercancel", (event) => {
  event.stopPropagation();
  stopRecordingFeedback();
});

composerArea.addEventListener("lostpointercapture", () => {
  // Some browsers fire this during normal pointer routing; global end events do the real cleanup.
});

document.addEventListener("pointerup", (event) => {
  if (!composerPressed && !recording && !pressTimer) return;
  finishRecording();
});

document.addEventListener("pointercancel", (event) => {
  if (!composerPressed && !recording && !pressTimer) return;
  stopRecordingFeedback();
});

document.addEventListener("mouseup", () => {
  if (composerPressed || recording || pressTimer) finishRecording();
});

document.addEventListener("touchend", () => {
  if (composerPressed || recording || pressTimer) finishRecording();
}, { passive: true });

document.addEventListener("touchcancel", () => {
  if (composerPressed || recording || pressTimer) stopRecordingFeedback();
}, { passive: true });

window.addEventListener("blur", stopRecordingFeedback);

function guardRecordingState() {
  if (!composerPressed && !recording && !pressTimer && composerArea.classList.contains("is-recording")) {
    composerArea.classList.remove("is-recording");
  }
  requestAnimationFrame(guardRecordingState);
}
requestAnimationFrame(guardRecordingState);

composerArea.addEventListener("click", (event) => {
  if (ignoreNextClick) {
    event.preventDefault();
    ignoreNextClick = false;
    return;
  }
});

async function sendText() {
  const text = messageInput.value.trim();
  if (!text) {
    messageInput.focus();
    return;
  }
  addChatBubble({ text });
  messageInput.value = "";
  exitTextInputMode();
  simulateIncomingReply();
}

keyboardToggleButton.addEventListener("click", (event) => {
  event.stopPropagation();
  enterTextInputMode();
});

homeReturnButton.addEventListener("click", (event) => {
  event.stopPropagation();
  returnHome();
});

sendTextButton.addEventListener("click", (event) => {
  event.stopPropagation();
  sendText();
});

messageInput.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;
  event.preventDefault();
  sendText();
});

clearAllButton.addEventListener("click", () => {
  if (activeRole === "settings") {
    visibleNotifications = [];
    notificationQueue.length = 0;
    chatThreads.settings = [];
    renderNotifications();
    return;
  }
  chatThreads[activeRole] = [];
  renderChat();
});

dynamicCard.addEventListener("click", () => {
  if (suppressModuleClick) return;
  openDynamicDetail();
});
addDynamicButton.addEventListener("click", () => openAddDynamicDialog("dynamic"));
document.querySelectorAll("[data-add-module]").forEach((button) => {
  button.addEventListener("click", () => openAddDynamicDialog(button.dataset.addModule));
});

document.querySelectorAll("[data-open-module]").forEach((button) => {
  button.addEventListener("click", () => {
    if (suppressModuleClick) return;
    openSquareDetail(button.dataset.openModule);
  });
});

closeAddDynamic.addEventListener("click", closeAddDynamicDialog);
generateDynamicButton.addEventListener("click", generateDynamic);

addDynamicDialog.addEventListener("click", (event) => {
  if (event.target === addDynamicDialog) closeAddDynamicDialog();
});

dynamicDetail.addEventListener("click", (event) => {
  if (event.target === dynamicDetail) closeDynamicDetail();
});

dynamicBackButton.addEventListener("click", (event) => {
  event.stopPropagation();
  returnHome();
});

document.querySelectorAll("[data-dynamic-action]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    const action = button.dataset.dynamicAction;
    if (action === "comment") {
      commentSheet.hidden = false;
      return;
    }
    const label = {
      like: "已点赞",
      share: "分享已准备",
      continue: "AI 续写中",
      remix: "准备拍同款"
    }[action] || "已操作";
    showComposerHint(label);
  });
});

commentSheet.addEventListener("click", (event) => {
  if (event.target === commentSheet) commentSheet.hidden = true;
});

squareDetail.addEventListener("click", (event) => {
  if (event.target === squareDetail) closeSquareDetail();
});

let squareStartX = 0;
let squareStartY = 0;
let squareTracking = false;
let squareVerticalIntent = false;
let squareHorizontalIntent = false;

squareStage.addEventListener("pointerdown", (event) => {
  squareTracking = true;
  squareStartX = event.clientX;
  squareStartY = event.clientY;
  squareVerticalIntent = false;
  squareHorizontalIntent = false;
  squareStage.setPointerCapture(event.pointerId);
});

squareStage.addEventListener("pointermove", (event) => {
  if (!squareTracking) return;
  const deltaX = event.clientX - squareStartX;
  const deltaY = event.clientY - squareStartY;
  if (!squareVerticalIntent && !squareHorizontalIntent && Math.hypot(deltaX, deltaY) > 10) {
    squareVerticalIntent = Math.abs(deltaY) > Math.abs(deltaX);
    squareHorizontalIntent = !squareVerticalIntent;
  }
});

squareStage.addEventListener("pointerup", (event) => {
  if (!squareTracking) return;
  squareTracking = false;
  const deltaX = event.clientX - squareStartX;
  const deltaY = event.clientY - squareStartY;
  if (squareVerticalIntent && Math.abs(deltaY) > 42) {
    closeSquareDetail();
    return;
  }
  if (!squareHorizontalIntent || deltaX > -42) return;
  stepSquare();
});

squareStage.addEventListener("pointercancel", () => {
  squareTracking = false;
  squareVerticalIntent = false;
  squareHorizontalIntent = false;
});

respondButton.addEventListener("click", (event) => {
  event.stopPropagation();
  openRespondDialog();
});

closeRespond.addEventListener("click", closeRespondDialog);
respondDialog.addEventListener("click", (event) => {
  if (event.target === respondDialog) closeRespondDialog();
});

sendRespondButton.addEventListener("click", () => {
  closeRespondDialog();
  showComposerHint("回应已发送");
});

[dynamicCard, ...document.querySelectorAll(".square-card")].forEach(bindLongPressMenu);

moduleMenuDialog.addEventListener("click", (event) => {
  if (event.target === moduleMenuDialog) moduleMenuDialog.close();
});

bindAccountButton?.addEventListener("click", () => {
  bindAccountDialog.showModal();
});

closeBindAccount?.addEventListener("click", () => {
  bindAccountDialog.close();
});

bindAccountDialog?.addEventListener("click", (event) => {
  if (event.target === bindAccountDialog) bindAccountDialog.close();
});

function handleInlineSystemAction(event) {
  const roleButton = event.target.closest("[data-inline-role]");
  if (roleButton?.dataset.inlineRole) {
    selectRole(roleButton.dataset.inlineRole);
    return;
  }

  const privacyButton = event.target.closest(".privacy-segment button");
  if (privacyButton) {
    privacyButton.closest(".privacy-segment")?.querySelectorAll("button").forEach((item) => {
      item.classList.toggle("is-selected", item === privacyButton);
      item.setAttribute("aria-pressed", item === privacyButton ? "true" : "false");
    });
    showComposerHint(`可见范围：${privacyButton.textContent.trim()}`);
    return;
  }

  const demoButton = event.target.closest("[data-engine-demo]");
  if (demoButton) {
    runEngineDemo(demoButton.dataset.engineDemo);
    return;
  }

  const settingsButton = event.target.closest("[data-inline-settings-action]");
  if (!settingsButton) return;
  const label = {
    bind: "绑定账号入口已准备",
    qr: "二维码待接入",
    export: "导出数据请求已准备",
    logout: "已退出当前绑定状态"
  }[settingsButton.dataset.inlineSettingsAction] || "设置已处理";
  showComposerHint(label);
}

chatArea.addEventListener("click", handleInlineSystemAction);
systemInlinePage.addEventListener("click", handleInlineSystemAction);

document.querySelectorAll(".privacy-segment button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".privacy-segment button").forEach((item) => {
      item.classList.toggle("is-selected", item === button);
      item.setAttribute("aria-pressed", item === button ? "true" : "false");
    });
    showComposerHint(`可见范围：${button.textContent.trim()}`);
  });
});

document.querySelectorAll("[data-settings-action]").forEach((button) => {
  button.addEventListener("click", () => {
    const label = {
      qr: "二维码待接入",
      export: "导出数据请求已准备",
      delete: "删除账号需要再次确认",
      logout: "已退出当前绑定状态"
    }[button.dataset.settingsAction] || "设置已处理";
    showComposerHint(label);
  });
});

document.querySelectorAll("[data-module-menu-action]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!activeModuleElement || !activeModuleWrapper) return;
    const action = button.dataset.moduleMenuAction;
    if (action === "grow") setModuleSize(activeModuleWrapper, "large");
    if (action === "shrink") setModuleSize(activeModuleWrapper, "small");
    if (action === "delete") {
      const entry = moduleWrappers().find((item) => item.wrapper === activeModuleWrapper);
      if (entry) {
        currentModuleLayout()[entry.key] ||= {};
        currentModuleLayout()[entry.key].hidden = true;
      }
      activeModuleWrapper.hidden = true;
    }
    moduleMenuDialog.close();
  });
});

let dynamicStartX = 0;
let dynamicStartY = 0;
let dynamicTracking = false;
let dynamicVerticalIntent = false;
let dynamicHorizontalIntent = false;

dynamicStage.addEventListener("pointerdown", (event) => {
  dynamicTracking = true;
  dynamicStartX = event.clientX;
  dynamicStartY = event.clientY;
  dynamicVerticalIntent = false;
  dynamicHorizontalIntent = false;
  dynamicDetail.classList.add("is-dragging");
  dynamicStage.setPointerCapture(event.pointerId);
});

dynamicStage.addEventListener("pointermove", (event) => {
  if (!dynamicTracking) return;
  const deltaX = event.clientX - dynamicStartX;
  const deltaY = event.clientY - dynamicStartY;
  if (!dynamicVerticalIntent && !dynamicHorizontalIntent && Math.hypot(deltaX, deltaY) > 10) {
    dynamicVerticalIntent = Math.abs(deltaY) > Math.abs(deltaX);
    dynamicHorizontalIntent = !dynamicVerticalIntent;
  }
  if (!dynamicVerticalIntent) return;
  event.preventDefault();
  const offsetY = Math.max(-180, Math.min(180, deltaY));
  const opacity = Math.max(0.18, 1 - Math.abs(offsetY) / 180);
  dynamicDetail.style.setProperty("--detail-y", `${offsetY}px`);
  dynamicDetail.style.setProperty("--detail-opacity", opacity.toFixed(3));
});

dynamicStage.addEventListener("pointerup", (event) => {
  if (!dynamicTracking) return;
  dynamicTracking = false;
  dynamicDetail.classList.remove("is-dragging");
  const deltaX = event.clientX - dynamicStartX;
  const deltaY = event.clientY - dynamicStartY;
  if (dynamicVerticalIntent && Math.abs(deltaY) > 58) {
    closeDynamicDetail();
    return;
  }
  dynamicDetail.style.removeProperty("--detail-y");
  dynamicDetail.style.removeProperty("--detail-opacity");
  if (dynamicHorizontalIntent && deltaX <= -42) stepDynamic(1);
});

dynamicStage.addEventListener("pointercancel", () => {
  dynamicTracking = false;
  dynamicDetail.classList.remove("is-dragging");
  dynamicDetail.style.removeProperty("--detail-y");
  dynamicDetail.style.removeProperty("--detail-opacity");
});

requestAnimationFrame(() => {
  xinqiaoEngine.init();
  voiceEngine.init();
  refreshRealChatStatus();
  document.querySelector('[data-role="settings"]')?.scrollIntoView({ inline: "center", block: "nearest" });
  updateContactFocus();
  renderActiveSurface();
  renderDynamicPreview();
  renderSquarePreviews();
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}
