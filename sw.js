/* Numeria — service worker: cache-first per il funzionamento offline */
const CACHE = "numeria-v2";
const RISORSE = [
  "./",
  "./index.html",
  "./app.js",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(RISORSE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(chiavi => Promise.all(chiavi.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(hit => {
      if (hit) return hit;
      return fetch(e.request).then(risp => {
        const copia = risp.clone();
        caches.open(CACHE).then(c => c.put(e.request, copia)).catch(() => {});
        return risp;
      }).catch(() => caches.match("./index.html"));
    })
  );
});
