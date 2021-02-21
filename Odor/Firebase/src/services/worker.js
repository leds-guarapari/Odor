/**
 * 
 * A class represents database methods in Firebase for persisting data.
 * 
 */
export class WorkerService {

 /**
  * @param {Object} authentication
  * @param {Object} configuration
  */
 constructor(authentication, configuration) {
  // initialize files
  this._files = [];
  // make install listener
  self.addEventListener("install", (event) => {
   self.skipWaiting();
   event.waitUntil(
    caches.open(configuration.version).then((cache) => {
     return cache.addAll(this._files);
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
  // verify authentication is adminstrator
  if (authentication.email === configuration.admin) {
   // make messaging with firebase
   this._messaging = firebase.messaging();
   // update messaging with background message handler
   this._messaging.setBackgroundMessageHandler(() => { });
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
     })
    );
   });
  }
 }

 /**
  * @returns {Array} files
  */
 get files() {
  return this._files;
 }

 /**
  * @returns {Object} messaging
  */
 get messaging() {
  return this._messaging;
 }

}