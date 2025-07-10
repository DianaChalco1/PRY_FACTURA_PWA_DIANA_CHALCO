const CACHE_NAME = 'facturacion-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './public/css/estilos.css',
  './public/js/clientes.js',
  './public/js/productos.js',
  './public/js/factura.js',
  './public/js/app.js',
  './icons/icon-192x192.png', // Ícono 192x192 añadido a la caché 
  './icons/icon-512x512.png',  // Ícono 512x512 añadido a la caché 
];

self.addEventListener('install', function(event) {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

self.addEventListener('fetch', function(event) {
  event.respondWith(caches.match(event.request).then(response => response || fetch(event.request)));
});