const CACHE_NAME = 'chefbook-v20';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Dejar pasar todas las peticiones a la red sin interceptar
  e.respondWith(fetch(e.request));
});

