// Service worker mínimo — solo existe para cumplir el requisito de "instalable"
// de Chrome (Agregar a pantalla de inicio). No cachea nada todavía, así que
// la app sigue necesitando conexión a internet para funcionar (usa Firestore
// en tiempo real). Si más adelante quieres soporte offline real, este es el
// lugar donde se agregaría esa lógica de caché.

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Passthrough: deja pasar todas las peticiones normalmente a la red.
  event.respondWith(fetch(event.request));
});
