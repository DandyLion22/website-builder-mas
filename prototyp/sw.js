/*
  Minimaler Service Worker fuer die PWA-Grundausstattung des Prototyps
  "Salon Lindenblatt". Cached nur die Startseite plus das Icon fuer eine
  einfache Offline-Basisseite -- kein Offline-Zugriff auf alle Unterseiten,
  das waere fuer einen echten Kunden separat zu entscheiden (Aufwand vs.
  Nutzen), siehe erkenntnisse.md.
*/
var CACHE_NAME = 'salon-lindenblatt-v1';
var PRECACHE = ['index.html', 'assets/img/icon.svg'];

self.addEventListener('install', function(event){
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){ return cache.addAll(PRECACHE); })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event){
  event.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){ return k !== CACHE_NAME; }).map(function(k){ return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(event){
  if(event.request.mode === 'navigate'){
    event.respondWith(
      fetch(event.request).catch(function(){ return caches.match('index.html'); })
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then(function(cached){ return cached || fetch(event.request); })
  );
});
