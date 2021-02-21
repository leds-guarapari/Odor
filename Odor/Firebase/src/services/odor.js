import { Odor } from "./models.odor.min.js";
import { DataStore } from "./services.store.min.js";

/**
 * 
 * A class to persist odor objects.
 * 
 */
export class OdorDataStore extends DataStore {

 constructor() {
  // run constructor in parent class
  super();
  // make add promise
  this.add = (odor) => {
   return new Promise((resolve, reject) => {
    try {
     // make a new odor reference with an auto-generated id
     let transaction = firebase.database().ref("odors").push();
     // dispatch set event to listener
     transaction.set({
      UserId: odor.userid,
      UserName: odor.username,
      UserType: odor.usertype,
      UserOrigin: odor.userorigin,
      Intensity: odor.intensity,
      Nuisance: odor.nuisance,
      Type: odor.type,
      Origin: odor.origin,
      Address: odor.address,
      Latitude: odor.latitude,
      Longitude: odor.longitude,
      Date: odor.date,
      Begin: odor.begin,
      End: odor.end
     }).then(() => {
      // set identifier data
      odor.id = transaction.key;
      // resolve promise
      resolve(odor);
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
  // make update promise
  this.update = (odor) => {
   return new Promise((resolve, reject) => {
    try {
     // dispatch set event to listener
     firebase.database().ref("odors/" + odor.id).set({
      UserId: odor.userid,
      UserName: odor.username,
      UserType: odor.usertype,
      UserOrigin: odor.userorigin,
      Intensity: odor.intensity,
      Nuisance: odor.nuisance,
      Type: odor.type,
      Origin: odor.origin,
      Address: odor.address,
      Latitude: odor.latitude,
      Longitude: odor.longitude,
      Date: odor.date,
      Begin: odor.begin,
      End: odor.end
     }).then(() => {
      // resolve promise
      resolve(odor);
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
  // make remove promise
  this.remove = (odor) => {
   return new Promise((resolve, reject) => {
    try {
     // dispatch set event to listener
     firebase.database().ref("odors/" + odor.id).remove().then(() => {
      // resolve promise
      resolve(odor);
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
  // make query promise
  this.query = (odor, filter) => {
   return new Promise((resolve, reject) => {
    try {
     // verify listener
     if (this.listener) {
      // turn off listener
      this.listener.off();
     }
     // verify filter
     if (filter) {
      // set listener with filter
      this.listener = firebase.database().ref("odors").orderByChild("Date").startAt(filter.begin).endAt(filter.end);
     } else {
      // verify odor
      if (odor.id) {
       // set listener with odor
       this.listener = firebase.database().ref("odors/" + odor.id);
      } else {
       // set listener with user
       this.listener = firebase.database().ref("odors").orderByChild("UserId").equalTo(odor.userid);
      }
     }
     // make add listener
     this.listener.on("child_added", (data) => {
      // dispatch added event to odor data
      this.added(this.convert(data));
     });
     // make change listener
     this.listener.on("child_changed", (data) => {
      // dispatch changed event to odor data
      this.changed(this.convert(data));
     });
     // make remove listener
     this.listener.on("child_removed", (data) => {
      // dispatch removed event to odor data
      this.removed(data.key);
     });
     // resolve promise
     resolve();
    } catch (error) {
     // reject promise
     reject(error);
    }
   });
  };
 }

 /**
  * @param {Object} data 
  */
 convert(data) {
  // make odor with data
  let odor = new Odor();
  odor.id = data.key;
  odor.userid = data.val().UserId;
  odor.username = data.val().UserName;
  odor.usertype = data.val().UserType;
  odor.userorigin = data.val().UserOrigin;
  odor.intensity = data.val().Intensity;
  odor.nuisance = data.val().Nuisance;
  odor.type = data.val().Type;
  odor.origin = data.val().Origin;
  odor.address = data.val().Address;
  odor.latitude = data.val().Latitude;
  odor.longitude = data.val().Longitude;
  odor.date = data.val().Date;
  odor.begin = data.val().Begin;
  odor.end = data.val().End;
  // return
  return odor;
 }

 /**
  * @returns {function} listener
  */
 get listener() {
  return this._listener;
 }

 /**
  * @param {function} listener
  */
 set listener(listener) {
  this._listener = listener;
 }

 /**
  * @returns {function} added
  */
 get added() {
  return this._added;
 }

 /**
  * @param {function} added
  */
 set added(added) {
  this._added = added;
 }

 /**
  * @returns {function} changed
  */
 get changed() {
  return this._changed;
 }

 /**
  * @param {function} changed
  */
 set changed(changed) {
  this._changed = changed;
 }

 /**
  * @returns {function} removed
  */
 get removed() {
  return this._removed;
 }

 /**
  * @param {function} removed
  */
 set removed(removed) {
  this._removed = removed;
 }

}

/**
 * 
 * Default data manipulation in session store.
 * 
 */
export class OdorSession {

 /**
  * @param {string} user
  */
 set user(user) {
  window.sessionStorage.setItem("user", user);
 }

 /**
  * @returns {string} user
  */
 get user() {
  return window.sessionStorage.getItem("user");
 }

 /**
  * @param {string} odor
  */
 set odor(odor) {
  window.sessionStorage.setItem("odor", odor);
 }

 /**
  * @returns {string} odor
  */
 get odor() {
  return window.sessionStorage.getItem("odor");
 }

 /**
  * @param {string} id
  */
 set id(id) {
  window.sessionStorage.setItem("id", id);
 }

 /**
  * @returns {string} id
  */
 get id() {
  return window.sessionStorage.getItem("id");
 }

 /**
  * @param {string} userid
  */
 set userid(userid) {
  window.sessionStorage.setItem("userid", userid);
 }

 /**
  * @returns {string} userid
  */
 get userid() {
  return window.sessionStorage.getItem("userid");
 }

 /**
  * @param {string} username
  */
 set username(username) {
  window.sessionStorage.setItem("username", username);
 }

 /**
  * @returns {string} username
  */
 get username() {
  return window.sessionStorage.getItem("username");
 }

 /**
  * @param {string} usertype
  */
 set usertype(usertype) {
  window.sessionStorage.setItem("usertype", usertype);
 }

 /**
  * @returns {string} usertype
  */
 get usertype() {
  return window.sessionStorage.getItem("usertype");
 }

 /**
  * @param {string} userorigin
  */
 set userorigin(userorigin) {
  window.sessionStorage.setItem("userorigin", userorigin);
 }

 /**
  * @returns {string} userorigin
  */
 get userorigin() {
  return window.sessionStorage.getItem("userorigin");
 }

 /**
  * @param {string} intensity
  */
 set intensity(intensity) {
  window.sessionStorage.setItem("intensity", intensity);
 }

 /**
  * @returns {string} intensity
  */
 get intensity() {
  return window.sessionStorage.getItem("intensity");
 }

 /**
  * @param {string} nuisance
  */
 set nuisance(nuisance) {
  window.sessionStorage.setItem("nuisance", nuisance);
 }

 /**
  * @returns {string} nuisance
  */
 get nuisance() {
  return window.sessionStorage.getItem("nuisance");
 }

 /**
  * @param {string} type
  */
 set type(type) {
  window.sessionStorage.setItem("type", type);
 }

 /**
  * @returns {string} type
  */
 get type() {
  return window.sessionStorage.getItem("type");
 }

 /**
  * @param {string} origin
  */
 set origin(origin) {
  window.sessionStorage.setItem("origin", origin);
 }

 /**
  * @returns {string} origin
  */
 get origin() {
  return window.sessionStorage.getItem("origin");
 }

 /**
  * @param {string} address
  */
 set address(address) {
  window.sessionStorage.setItem("address", address);
 }

 /**
  * @returns {string} address
  */
 get address() {
  return window.sessionStorage.getItem("address");
 }

 /**
  * @param {number} latitude
  */
 set latitude(latitude) {
  window.sessionStorage.setItem("latitude", latitude.toString(10));
 }

 /**
  * @returns {number} latitude
  */
 get latitude() {
  return Number(window.sessionStorage.getItem("latitude") || "0");
 }

 /**
  * @param {number} longitude
  */
 set longitude(longitude) {
  window.sessionStorage.setItem("longitude", longitude.toString(10));
 }

 /**
  * @returns {number} longitude
  */
 get longitude() {
  return Number(window.sessionStorage.getItem("longitude") || "0");
 }

 /**
  * @param {string} date
  */
 set date(date) {
  window.sessionStorage.setItem("date", date);
 }

 /**
  * @returns {string} date
  */
 get date() {
  return window.sessionStorage.getItem("date");
 }

 /**
  * @param {string} begin
  */
 set begin(begin) {
  window.sessionStorage.setItem("begin", begin);
 }

 /**
  * @returns {string} begin
  */
 get begin() {
  return window.sessionStorage.getItem("begin");
 }

 /**
  * @param {string} end
  */
 set end(end) {
  window.sessionStorage.setItem("end", end);
 }

 /**
  * @returns {string} end
  */
 get end() {
  return window.sessionStorage.getItem("end");
 }

 /**
  * remove all saved data from session
  */
 clear() {
  window.sessionStorage.clear();
 }

}