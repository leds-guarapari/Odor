/**
 * 
 * Represents a service worker for application.
 * 
 */

self.importScripts("/workers.files.min.js");
self.importScripts("/js/services.config.min.js");

// make install listener
self.addEventListener("install", (event) => {
 self.skipWaiting();
 event.waitUntil(
  caches.open(config.version).then((cache) => {
   return cache.addAll(files);
  })
 );
});

// make activate listener
self.addEventListener("activate", (event) => {
 event.waitUntil(
  caches.keys().then((list) => {
   return Promise.all(list.map((key) => {
    if (key !== version) {
     return caches.delete(key);
    }
   }));
  })
 );
});

// make fetch listener
self.addEventListener("fetch", (event) => {
 event.respondWith(
  caches.open(version).then((cache) => {
   return cache.match(event.request).then((response) => {
    return response || fetch(event.request).then((reply) => {
     let pathname = new URL(event.request.url).pathname;
     if (event.request.method === "GET" && !/__/.test(pathname) && !/_\/scs/.test(pathname) && !/js\/api.js/.test(pathname)) {
      cache.put(event.request, reply.clone());
     }
     return reply;
    }).catch(() => {
     return caches.match("/index.html");
    });
   });
  })
 );
});