const CACHE_NAME = "aquarium-hub-v29-maintenance-flow";
const ASSETS = [
  './', './index.html', './manifest.webmanifest', './styles.css?v=27', './app.js?v=27',
  './images/dwarf_yellow_tip_hermit.jpg', './images/aquamaxx_frs_logo_free.jpg',
  './images/aquamaxx_hfm_logo_free.jpg', './images/gyre_xf330.jpg',
  './images/hanna_hi736.jpg', './images/hanna_hi758.jpg', './images/hanna_hi772.jpg',
  './images/hanna_hi782.jpg', './images/hanna_hi783.jpg', './images/hanna_hi98319.jpg',
  './images/helio_heater.jpg', './images/nero3.jpg', './images/seneye.jpg'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => Promise.allSettled(ASSETS.map(asset => cache.add(asset)))));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.map(key => key === CACHE_NAME ? Promise.resolve() : caches.delete(key)))));
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  if(event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if(url.origin !== self.location.origin) return;
  event.respondWith(fetch(event.request, {cache:'no-store'}).then(response => {
    if(response && response.ok){
      const copy=response.clone();
      caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy));
    }
    return response;
  }).catch(()=>caches.match(event.request).then(hit=>hit||caches.match('./index.html'))));
});
