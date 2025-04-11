self.addEventListener('install', (e) => {
  console.log('Service Worker 安裝中...');
  e.waitUntil(
    caches.open('safety-cache-v2').then((cache) =>
      cache.addAll([
        '/',
        '/index.html',
        '/style.css',
        '/main.js',
        '/manifest.json',
        '/offline.html'
      ])
    )
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() =>
      caches.match(e.request).then((resp) => {
        return resp || caches.match('/offline.html');
      })
    )
  );
});