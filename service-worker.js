const CACHE_NAME = 'poiroux-bingo-v3';
const ASSETS = ['./index.html?v=3','./manifest.webmanifest?v=3','./icon-192.svg?v=3','./icon-512.svg?v=3'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE_NAME ? caches.delete(k) : null))));
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(resp => {
        const clone = resp.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone)).catch(()=>{});
        return resp;
      }).catch(() => caches.match('./index.html?v=3'));
    })
  );
});
