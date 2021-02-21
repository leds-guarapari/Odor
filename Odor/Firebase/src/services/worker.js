/**
 * 
 * A class represents a listener to registry service workers.
 * 
 */
export class WorkerService {

 /**
  * @param {boolean} administrator
  */
 constructor(administrator) {
  // verify if service worker is valid
  if (window.navigator.serviceWorker) {
   // verify administrator
   if (administrator) {
    // registry service worker
    window.navigator.serviceWorker.register("./js/workers.admin.min.js").then((registration) => {
     // initialize registration
     this._registration = registration;
     // update messaging with service worker
     firebase.messaging().useServiceWorker(registration);
     // request permission to notification
     firebase.messaging().requestPermission().then(() => {
      firebase.messaging().getToken();
     });
     // callback fired if instance token is updated
     firebase.messaging().onTokenRefresh(() => {
      firebase.messaging().getToken();
     });
    });
   } else {
    // registry service worker
    window.navigator.serviceWorker.register("./js/workers.user.min.js").then((registration) => {
     // initialize registration
     this._registration = registration;
    });
   }
  }
 }

 /**
  * @returns {Object} registration
  */
 get registration() {
  return this._registration;
 }

}