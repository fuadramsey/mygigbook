// MyGigBook Service Worker — β2.60
const CACHE = 'mygigbook-202611041245';
const ASSETS = ['/mygigbook/','/mygigbook/index.html','/mygigbook/manifest.json','/mygigbook/icon-192.png','/mygigbook/icon-512.png'];
const HTML_URLS = ['/mygigbook/', '/mygigbook/index.html'];

self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  // Network-first for HTML pages — always get the freshest app shell
  const isHtml = HTML_URLS.some(u => url.pathname === u || url.pathname === u.replace(/\/$/, ''));
  if (isHtml) {
    e.respondWith(
      fetch(e.request).then(resp => {
        const clone = resp.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return resp;
      }).catch(() => caches.match(e.request))
    );
  } else {
    // Cache-first for all other assets
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request).then(resp => {
        const clone = resp.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return resp;
      }))
    );
  }
});
