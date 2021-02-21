/**
 * 
 * Represents a service worker for application.
 * 
 */

self.importScripts("/js/workers.files.min.js");
self.importScripts("/js/services.config.min.js");
self.importScripts("/js/services.firebase.min.js");
self.importScripts("/lib/firebase/firebase-app.js");
self.importScripts("/lib/firebase/firebase-messaging.js");

// initialize firebase service
const service = new FirebaseService(config.firebase);

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

// update messaging with background message handler
firebase.messaging().setBackgroundMessageHandler(() => { });

// make push listener
self.addEventListener("push", (event) => {
 event.waitUntil(
  // make promise
  new Promise(() => {
   // make current message
   let message = event.data.json();
   // show notification
   return self.registration.showNotification(message.data.title, {
    body: message.data.body,
    icon: "/images/odor-256x256.png"
   });
  }))
});