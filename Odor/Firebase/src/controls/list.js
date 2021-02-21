import { config } from "./services.config.min.js";
import { FirebaseService } from "./services.firebase.min.js";
import { Odor } from "./models.odor.min.js";
import { OdorDataStore, OdorSession } from "./services.odor.min.js";
import { ListView } from "./views.list.min.js";

/**
 * 
 * A control class for acts on both model and view.
 * 
 */
export class ListControl {

 /**
  * 
  * Extends control class and make listener for all events
  * 
  */
 constructor() {
  // initialize view listener
  this._view = new ListView();
  // set view backward
  this._view.backward = this.backward;
  // set view dispatch
  this._view.dispatch = this.dispatch;
  // set view handler
  this._view.handler = this.handler;
  // initialize firebase service
  this._firebase = new FirebaseService(config.firebase);
  // bind an event handler to verify authentication user
  firebase.auth().onAuthStateChanged((authentication) => {
   // verify user is signed in
   if (authentication) {
    // initialize authentication
    this._authentication = authentication;
    // initialize odor data store
    this._store = new OdorDataStore();
    // set added event in store
    this._store.added = this.added;
    // set changed event in store
    this._store.changed = this.changed;
    // set removed event in store
    this._store.removed = this.removed;
    // initialize session
    this._session = new OdorSession();
    // initialize odor
    this._odor = new Odor();
    // set user identifier
    this._odor.userid = this._session.userid;
    // initialize odors maps
    this._odors = new Map();
    // query odor in store
    this.store.query(this._odor).then(() => { })
     // request is incorrectly returned
     .catch(() => {
      // dispatch view exception
      this._view.exception();
     })
     // finally request
     .finally(() => {
      // release page
      this._view.release();
     });
   } else {
    // redirect to activation page
    window.location.replace("/activation");
   }
  });
 }

 /**
 * @returns {function} handler
 */
 get handler() {
  return () => {
   // redirect to odor page
   window.location.replace("/odor");
  };
 }

 /**
  * @returns {Object} firebase
  */
 get firebase() {
  return this._firebase;
 }

 /**
  * @returns {Object} authentication
  */
 get authentication() {
  return this._authentication;
 }

 /**
  * @returns {Object} session
  */
 get session() {
  return this._session;
 }

 /**
  * @param {Odor} odor
  */
 set session(odor) {
  // set odor data in session
  this.session.odor = "odor";
  this.session.id = odor.id;
  this.session.userid = odor.userid;
  this.session.username = odor.username;
  this.session.usertype = odor.usertype;
  this.session.userorigin = odor.userorigin;
  this.session.intensity = odor.intensity;
  this.session.nuisance = odor.nuisance;
  this.session.type = odor.type;
  this.session.origin = odor.origin;
  this.session.address = odor.address;
  this.session.latitude = odor.latitude;
  this.session.longitude = odor.longitude;
  this.session.date = odor.date;
  this.session.begin = odor.begin;
  this.session.end = odor.end;
 }

 /**
  * @param {Odor} odor
  */
 set odor(odor) {
  this._odor = odor;
 }

 /**
  * @returns {Odor} dor
  */
 get odor() {
  return this._odor;
 }

 /**
  * @param {Map} odors
  */
 set odors(odors) {
  this._odors = odors;
 }

 /**
  * @returns {Map} odors
  */
 get odors() {
  return this._odors;
 }

 /**
  * @returns {function} added
  */
 get added() {
  return (odor) => {
   // update odor in odors maps
   this.odors.set(odor.id, odor);
   // set display empty in view
   this.view.empty(false);
   // add odor in view
   this.view.added(odor);
  };
 }

 /**
  * @returns {function} changed
  */
 get changed() {
  return (odor) => {
   // update odor in odors maps
   this.odors.set(odor.id, odor);
   // update odor in view
   this.view.changed(odor);
  };
 }

 /**
  * @returns {function} removed
  */
 get removed() {
  return (id) => {
   // remove odor in odors maps
   this.odors.delete(id);
   // remove odor in view
   this.view.removed(id);
   // set display empty in view
   this.view.empty(!this.odors.size);
  };
 }

 /**
  * @returns {Object} view
  */
 get view() {
  return this._view;
 }

 /**
  * @returns {Object} store
  */
 get store() {
  return this._store;
 }

 /**
  * @returns {function} backward
  */
 get backward() {
  return () => {
   // redirect to master page
   window.location.replace("/master");
  };
 }

 /**
  * @returns {function} dispatch
  */
 get dispatch() {
  return (id) => {
   return new Promise((resolve, reject) => {
    try {
     // set odor data in session with map
     this.session = this.odors.get(id);
     // resolve promise
     resolve();
    } catch (error) {
     // reject promise
     reject(error);
    }
   });
  };
 }

}

// make a control listener
export const control = new ListControl();