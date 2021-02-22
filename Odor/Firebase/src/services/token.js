import { DataStore } from "./services.store.min.js";

/**
 * 
 * A class to persist token objects.
 * 
 */
export class TokenDataStore extends DataStore {

 constructor() {
  // run constructor in parent class
  super();
  // make update promise
  this.update = (token) => {
   return new Promise((resolve, reject) => {
    try {
     // create update data
     let update = {};
     update["/tokens/" + token] = { timestamp: firebase.database.ServerValue.TIMESTAMP };
     // update data in realtime database
     firebase.database().ref().update(update).then(() => {
      // resolve promise
      resolve();
     })
      // request is incorrectly returned
      .catch((error) => {
       // reject promise
       reject(error);
      });
    } catch (error) {
     // reject promise
     reject(error);
    }
   });
  };
 }

}