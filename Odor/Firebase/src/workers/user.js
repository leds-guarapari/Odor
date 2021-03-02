/**
 * 
 * Represents a service worker for application.
 * 
 */

const version = "0.1.7";

const files = [
 "/",
 "/activation",
 "/favicon.ico",
 "/filter",
 "/images/favicon.ico",
 "/images/nqualiar.jpg",
 "/images/odor-1024x1024.png",
 "/images/odor-114x114.png",
 "/images/odor-120x120.png",
 "/images/odor-144x144.png",
 "/images/odor-152x152.png",
 "/images/odor-167x167.png",
 "/images/odor-16x16.png",
 "/images/odor-180x180.png",
 "/images/odor-192x192.png",
 "/images/odor-256x256.png",
 "/images/odor-32x32.png",
 "/images/odor-512x512.png",
 "/images/odor-57x57.png",
 "/images/odor-60x60.png",
 "/images/odor-64x64.png",
 "/images/odor-72x72.png",
 "/images/odor-76x76.png",
 "/images/odor-96x96.png",
 "/images/odor-background.png",
 "/images/odor.png",
 "/images/odor-slide.png",
 "/js/controls.activation.min.js",
 "/js/controls.filter.min.js",
 "/js/controls.index.min.js",
 "/js/controls.list.min.js",
 "/js/controls.maps.min.js",
 "/js/controls.master.min.js",
 "/js/controls.odor.min.js",
 "/js/controls.user.min.js",
 "/js/models.odor.min.js",
 "/js/models.user.min.js",
 "/js/services.config.min.js",
 "/js/services.firebase.min.js",
 "/js/services.indexed.min.js",
 "/js/services.maps.min.js",
 "/js/services.odor.min.js",
 "/js/services.store.min.js",
 "/js/services.token.min.js",
 "/js/services.user.min.js",
 "/js/services.worker.min.js",
 "/js/views.activation.min.js",
 "/js/views.filter.min.js",
 "/js/views.index.min.js",
 "/js/views.list.min.js",
 "/js/views.maps.min.js",
 "/js/views.master.min.js",
 "/js/views.odor.min.js",
 "/js/views.user.min.js",
 "/js/views.view.min.js",
 "/lib/exceljs/dist/exceljs.min.js",
 "/lib/firebase/firebase-app.js",
 "/lib/firebase/firebase-app.js.map",
 "/lib/firebase/firebase-auth.js",
 "/lib/firebase/firebase-auth.js.map",
 "/lib/firebase/firebase-database.js",
 "/lib/firebase/firebase-database.js.map",
 "/lib/firebase/firebase-messaging.js",
 "/lib/firebase/firebase-messaging.js.map",
 "/lib/glide/dist/glide.core.min.css",
 "/lib/glide/dist/glide.min.js",
 "/lib/glide/dist/glide.theme.min.css",
 "/lib/googlemaps/dist/index.min.js",
 "/lib/material-components-web/dist/material-components-web.min.css",
 "/lib/material-components-web/dist/material-components-web.min.css.map",
 "/lib/material-components-web/dist/material-components-web.min.js",
 "/lib/material-design-icons/iconfont/material-icons.min.css",
 "/lib/material-design-icons/iconfont/MaterialIcons-Regular.eot",
 "/lib/material-design-icons/iconfont/MaterialIcons-Regular.ijmap",
 "/lib/material-design-icons/iconfont/MaterialIcons-Regular.svg",
 "/lib/material-design-icons/iconfont/MaterialIcons-Regular.ttf",
 "/lib/material-design-icons/iconfont/MaterialIcons-Regular.woff",
 "/lib/material-design-icons/iconfont/MaterialIcons-Regular.woff2",
 "/lib/moment/moment.min.js",
 "/lib/moment-duration-format/moment-duration-format.min.js",
 "/lib/polyfill/dist/polyfill.min.js",
 "/list",
 "/manifest.json",
 "/maps",
 "/master",
 "/odor",
 "/user"
];

// make install listener
self.addEventListener("install", (event) => {
 self.skipWaiting();
 event.waitUntil(
  caches.open(version).then((cache) => {
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
  caches.open(version).then(async (cache) => {
   const response = await cache.match(event.request);
   return response || fetch(event.request).then((reply) => {
    let pathname = new URL(event.request.url).pathname;
    if (event.request.method === "GET" && !/__/.test(pathname) && !/_\/scs/.test(pathname) && !/js\/api.js/.test(pathname)) {
     cache.put(event.request, reply.clone());
    }
    return reply;
   }).catch(() => {
    return caches.match("/master");
   });
  })
 );
});