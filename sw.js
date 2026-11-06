// Service worker SIKAP SMANPRO: hanya menyimpan "cangkang" PWA (halaman pembungkus & ikon).
// Aplikasi (Apps Script) selalu diambil langsung dari internet, jadi pembaruan aplikasi langsung terlihat.
var CACHE = 'sikap-pwa-v3';
var FILES = ['./', './index.html', './config.js', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }));
  self.skipWaiting();
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (k) { return Promise.all(k.filter(function (x) { return x !== CACHE; }).map(function (x) { return caches.delete(x); })); }));
  self.clients.claim();
});
self.addEventListener('fetch', function (e) {
  var u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== self.location.origin || u.searchParams.has('t')) return; // config.js?t=... selalu langsung dari jaringan
  e.respondWith(fetch(e.request).then(function (r) {
    var kopi = r.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, kopi); }); return r;
  }).catch(function () { return caches.match(e.request).then(function (r) { return r || caches.match('./index.html'); }); }));
});
