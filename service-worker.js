const CACHE_NAME="aquarium-hub-v23-reorganized";
const ASSETS=[
  './',
  './index.html',
  './manifest.webmanifest',
  './styles.css',
  './app.js',
  './images/dwarf_yellow_tip_hermit.jpg',
  './images/all_for_reef.jpg',
  './images/aquamaxx_frs_logo_free.jpg',
  './images/aquamaxx_hfm_logo_free.jpg',
  './images/gyre_xf330.jpg',
  './images/hanna_hi736.jpg',
  './images/hanna_hi758.jpg',
  './images/hanna_hi764.jpg',
  './images/hanna_hi772.jpg',
  './images/hanna_hi782.jpg',
  './images/hanna_hi783.jpg',
  './images/hanna_hi98319.jpg',
  './images/helio_heater.jpg',
  './images/microbacter7.jpg',
  './images/microbacter_clean.jpg',
  './images/nero3.jpg',
  './images/seneye.jpg',
];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>Promise.allSettled(ASSETS.map(asset=>cache.add(asset)))));
  self.skipWaiting();
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  event.respondWith(fetch(event.request).then(response=>{
    const copy=response.clone();
    caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy));
    return response;
  }).catch(()=>caches.match(event.request).then(r=>r||caches.match('./index.html'))));
});
