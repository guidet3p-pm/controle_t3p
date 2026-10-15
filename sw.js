const CACHE = 'controle-t3p-sept-2026-v40';

const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './images/app-icon-96-v12.png',
  './images/app-icon-ios-v12.png',
  './images/app-icon-192-v12.png',
  './images/app-icon-512-v12.png',
  './images/01.png',
  './images/02.png',
  './images/03.png',
  './images/04.png',
  './images/05.png',
  './images/06.png',
  './images/07.png',
  './images/08.png',
  './images/09.png',
  './images/10.png',
  './images/11.png',
  './images/12.png',
  './images/13.png',
  './images/14.png',
  './images/15.png',
  './images/16.png',
  './images/17.png',
  './images/18.png',
  './images/19.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key =>
            key.startsWith('controle-t3p-') &&
            key !== CACHE
          )
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Ne traite que les ressources de cette même origine.
  if (url.origin !== self.location.origin) return;

  const isPage =
    request.mode === 'navigate' ||
    url.pathname.endsWith('/index.html') ||
    url.pathname.endsWith('/manifest.webmanifest');

  if (isPage) {
    event.respondWith(
      fetch(request, { cache: 'no-store' })
        .then(response => {
          if (response && response.ok) {
            const copy = response.clone();

            event.waitUntil(
              caches.open(CACHE)
                .then(cache => cache.put(request, copy))
            );
          }

          return response;
        })
        .catch(() =>
          caches.match(request)
            .then(cached =>
              cached || caches.match('./index.html')
            )
        )
    );

    return;
  }

  // Pour les images et autres ressources : cache en priorité.
  event.respondWith(
    caches.match(request)
      .then(cached => {
        if (cached) return cached;

        return fetch(request).then(response => {
          if (response && response.ok) {
            const copy = response.clone();

            event.waitUntil(
              caches.open(CACHE)
                .then(cache => cache.put(request, copy))
            );
          }

          return response;
        });
      })
  );
});