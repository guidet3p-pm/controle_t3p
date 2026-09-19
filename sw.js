const CACHE = 'controle-t3p-sept-2026-v39';
const ASSETS = [
 './','./index.html','./manifest.webmanifest',
 './images/app-icon-96-v12.png','./images/app-icon-ios-v12.png','./images/app-icon-192-v12.png','./images/app-icon-512-v12.png',
 './images/01.png','./images/02.png','./images/03.png','./images/04.png','./images/05.png','./images/06.png','./images/07.png','./images/08.png','./images/09.png','./images/10.png','./images/11.png','./images/12.png','./images/13.png','./images/14.png','./images/15.png','./images/16.png','./images/17.png','./images/18.png','./images/19.png'
];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(r=>{if(r&&r.ok){const cp=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));}return r;}).catch(()=>caches.match('./index.html'))));});
