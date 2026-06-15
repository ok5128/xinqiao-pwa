const cacheName = "xinqiao-pwa-shell-v20260615-5";

const shellAssets = [
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
  "./wasm/xinqiao-engine-worker.js",
  "./vendor/transformers.min.js",
  "./vendor/ort-wasm-simd-threaded.jsep.mjs",
  "./vendor/ort-wasm-simd-threaded.wasm",
  "./vendor/ort-wasm-simd-threaded.jsep.wasm",
  "./assets/system-settings.png",
  "./assets/system-search.png",
  "./assets/open-wechat.jpg",
  "./assets/my-digital-human.jpg",
  "./assets/npc-1.png",
  "./assets/npc-2.png",
  "./assets/npc-3.png",
  "./assets/npc-4.png",
  "./assets/npc-5.png",
  "../WebPreview/assets/daoxin-logo.png",
  "../WebPreview/assets/daoxin-heart.png",
  "../WebPreview/assets/contact-import.png",
  "../WebPreview/assets/imported/avatar-zhuangzi.png",
  "../WebPreview/assets/imported/wish-cover.png",
  "../WebPreview/assets/showcase/home-cover.png",
  "../WebPreview/preview-app-intelligence.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(shellAssets)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys
      .filter((key) => key !== cacheName)
      .map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone();
        caches.open(cacheName).then((cache) => cache.put(request, copy));
        return response;
      })
      .catch(() => caches.match(request).then((cached) => cached || caches.match("./index.html")))
  );
});
