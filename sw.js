// MyGigBook Service Worker
const CACHE = 'mygigbook-v1';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  self.clients.claim();
});

// Network first, cache fallback for the main page
self.addEventListener('fetch', e => {
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(() => caches.match('/mygigbook/'))
    );
  }
});
