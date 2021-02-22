import { TokenDataStore } from "./services.token.min.js";

/**
 * 
 * A class represents a listener to registry service workers.
 * 
 */
export class WorkerService {

 /**
  * @param {boolean} administrator
  * @param {string} vapidKey
  */
 constructor(administrator, vapidKey) {
  // verify if service worker is valid
  if (window.navigator.serviceWorker) {
   // initialize token data store
   this._store = new TokenDataStore();
   // verify administrator
   if (administrator) {
    // registry service worker
    window.navigator.serviceWorker.register("./workers.admin.min.js").then((registration) => {
     // initialize registration
     this._registration = registration;
     // update messaging with service worker
     firebase.messaging().useServiceWorker(this._registration);
     // request permission to notification
     firebase.messaging().requestPermission().then(() => {
      // request token in firebase messaging
      firebase.messaging().getToken({ vapidKey: vapidKey }).then((token) => {
       // initialize token
       this._token = token;
       // dispatch update token in listener
       return this._store.update(this._token);
      });
     });
     // callback fired if instance token is updated
     firebase.messaging().onTokenRefresh(() => {
      // request token in firebase messaging
      firebase.messaging().getToken({ vapidKey: vapidKey }).then((token) => {
       // initialize token
       this._token = token;
       // dispatch update token in listener
       return this._store.update(this._token);
      });
     });
    });
   } else {
    // registry service worker
    window.navigator.serviceWorker.register("./workers.user.min.js").then((registration) => {
     // initialize registration
     this._registration = registration;
    });
   }
  }
 }

 /**
  * @returns {Object} store
  */
 get store() {
  return this._store;
 }

 /**
  * @returns {Object} registration
  */
 get registration() {
  return this._registration;
 }

 /**
 * @returns {Object} token
 */
 get token() {
  return this._token;
 }

}