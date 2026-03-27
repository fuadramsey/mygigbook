// MyGigBook Service Worker — β.173
const CACHE = 'mygigbook-202603272400';
const ASSETS = ['/mygigbook/','/mygigbook/index.html','/mygigbook/manifest.json','/mygigbook/icon-192.png','/mygigbook/icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => { const url = new URL(e.request.url); if (url.origin === location.origin) { e.respondWith(caches.match(e.request).then(cached => cached || fetch(e.request).then(resp => { const clone = resp.clone(); caches.open(CACHE).then(c => c.put(e.request, clone)); return resp; }))); } });
self.addEventListener('message', e => { if (e.data?.type === 'SKIP_WAITING') self.skipWaiting(); });
