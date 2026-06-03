const CACHE_NAME = 'poiroux-bingo-v1';
const ASSETS = ['./','./index.html','./manifest.webmanifest','./icon-192.svg','./icon-512.svg'];
self.addEventListener('install', event => { event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))); self.skipWaiting(); });
self.addEventListener('activate', event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE_NAME ? caches.delete(k) : null)))); self.clients.claim(); });
self.addEventListener('fetch', event => { event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(resp => { const clone = resp.clone(); caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone)).catch(()=>{}); return resp; }).catch(() => caches.match('./index.html')))); });
