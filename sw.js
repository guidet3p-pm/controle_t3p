const CACHE = 'controle-t3p-sept-2026-v18';
const ASSETS = [
  './', './index.html', './manifest.webmanifest',
  './Guide_controle_T3P_Police_Municipale_Smartphone_V18.pdf',
  './images/app-icon-96-v12.png', './images/app-icon-ios-v12.png', './images/app-icon-192-v12.png', './images/app-icon-512-v12.png',
  ...Array.from({length:19},(_,i)=>`./images/${String(i+1).padStart(2,'0')}.png`)
];
self.addEventListener('install', event => { event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(()=>self.skipWaiting())); });
self.addEventListener('activate', event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch', event => { if(event.request.method !== 'GET') return; event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => { const copy=response.clone(); caches.open(CACHE).then(c=>c.put(event.request,copy)); return response; }).catch(()=>caches.match('./index.html')))); });
