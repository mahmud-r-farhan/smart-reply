const CACHE_NAME = 'smart-reply-v1';

const ASSETS_TO_CACHE = [
  '/index.html',
  '/offline.html',
];

// INSTALL
self.addEventListener('install', (event) => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// ACTIVATE
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      )
    )
  );

  self.clients.claim();
});

// FETCH
self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request)
        .then((networkResponse) => {
          // ❌ Only cache valid same-origin responses
          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            networkResponse.type !== 'basic'
          ) {
            return networkResponse;
          }

          const responseClone = networkResponse.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });

          return networkResponse;
        })
        .catch(() => {
          // Offline fallback for navigation
          if (request.mode === 'navigate') {
            return caches.match('/offline.html');
          }
        });
    })
  );
});

// MESSAGE
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
