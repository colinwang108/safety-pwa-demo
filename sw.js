self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('safety-cache').then((cache) =>
      cache.addAll([
        '/',
        '/index.html',
        '/style.css',
        '/main.js',
        '/manifest.json'
      ])
    )
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((resp) =>
      resp || fetch(e.request)
    )
  );
});