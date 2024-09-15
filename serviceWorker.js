// This is the service worker with the Cache-first network

const CACHE = "pwabuilder-precache";
const precacheFiles = [
  /* Add an array of files to precache for your app */
  "index.html",
  "/styles.css",
  "/index.js",
];

self.addEventListener("install", function (event) {
  console.log("Install Event processing");

  console.log("Skip waiting on install");
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      console.log("Caching pages during install");
      return cache.addAll(precacheFiles);
    })
  );
});

// Allow sw to control of current page
self.addEventListener("activate", function (event) {
  console.log("Claiming clients for current page");
  event.waitUntil(self.clients.claim());
});

// If any fetch fails, it will show the offline page.
self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request).catch(function (error) {
      console.log("Fetch failed; returning offline page instead.", error);
      return caches.match("offline.html");
    })
  );
});

// Add an event listener for fetch
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});
