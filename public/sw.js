const CACHE_NAME = "pv-cache-v3";
const CORE_ASSETS = ["/","/index.html","/manifest.webmanifest","/icons/icon-192.png","/icons/icon-512.png"];
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).then(self.skipWaiting()));
});
self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE_NAME ? caches.delete(k) : null))));
  self.clients.claim();
});
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.url.includes("/pub?") && req.url.includes("output=csv")) {
    event.respondWith(fetch(req).then(res => { caches.open(CACHE_NAME).then(c => c.put(req, res.clone())); return res; }).catch(() => caches.match(req)));
  } else {
    event.respondWith(caches.match(req).then(cached => cached || fetch(req)));
  }
});