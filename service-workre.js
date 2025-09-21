const CACHE_NAME = "my-app-cache-v1";
const urlsToCache = [
  "/",                 // root
  "/index.html",       // main page
  "/styles.css",       // your CSS
  "/script.js",        // your JS
  "/icon.png"          // app icon
];

// Install Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate Service Worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch from cache first, then network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached response OR fetch new
      return (
        response ||
        fetch(event.request).catch(() =>
          caches.match("/index.html") // fallback when offline
        )
      );
    })
  );
});