import { DataStore } from "./services.store.min.js";

/**
 * 
 * Auxiliary class for database build.
 * 
 */
export class IndexedDBStore {

 /**
  * @param {string} path 
  * @param {string} key 
  */
 constructor(path, key) {
  this._path = path;
  this._key = key;
 }

 /**
  * @param {string} path
  */
 set path(path) {
  this._path = path;
 }

 /**
  * @returns {string} path
  */
 get path() {
  return this._path;
 }

 /**
  * @param {string} key
  */
 set key(key) {
  this._key = key;
 }

 /**
  * @returns {string} key
  */
 get key() {
  return this._key;
 }

}

/**
 * 
 * A class represents database methods in IndexedDB for persisting data.
 * 
 */
export class IndexedDBService extends DataStore {

 /**
  * @param {string} name
  * @param {Array} stores
  */
 constructor(name, stores) {
  // run constructor in parent class
  super();
  // make add promise
  this.add = (data) => {
   return new Promise((resolve, reject) => {
    // make add transaction
    this.transaction(this.store(data, "readwrite").add(data))
     // request is successfully returned
     .then((event) => {
      // set identifier data
      data.id = event.target.result;
      // resolve promise
      resolve(data);
     })
     // request is incorrectly returned
     .catch(() => {
      // reject promise
      reject(data);
     });
   });
  };
  // make update promise
  this.update = (data) => {
   return new Promise((resolve, reject) => {
    // make update transaction
    this.transaction(this.store(data, "readwrite").put(data))
     // request is successfully returned
     .then(() => {
      // resolve promise
      resolve(data);
     })
     // request is incorrectly returned
     .catch(() => {
      // reject promise
      reject(data);
     });
   });
  };
  // make remove promise
  this.remove = (data) => {
   return new Promise((resolve, reject) => {
    // make delete transaction
    this.transaction(this.store(data, "readwrite").delete(data.id))
     // request is successfully returned
     .then(() => {
      // resolve promise
      resolve(data);
     })
     // request is incorrectly returned
     .catch(() => {
      // reject promise
      reject(data);
     });
   });
  };
  // make query promise
  this.query = (data) => {
   // return query transaction
   return this.transaction(this.store(data, "readonly").getAll());
  };
  // make promise to sync events when opening IndexedDB
  return new Promise((resolve, reject) => {
   // local database resource
   this._database = window.indexedDB ||
    window.msIndexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB;
   // verify local database
   if (this._database) {
    // initialize local database
    this._open = this._database.open(name);
    // event handler when request is upgrade needed
    this._open.onupgradeneeded = (event) => {
     // for all stores
     stores.forEach(store => {
      // make object store
      event.target.result.createObjectStore(store.path, { keyPath: store.key, autoIncrement: true });
     });
    };
    // event handler when request is successfully returned
    this._open.onsuccess = (event) => {
     // set local target
     this._target = event.target.result;
     // resolve promise
     resolve(this);
    };
    // event handler when request is unsuccessfully returned
    this._open.onerror = (event) => {
     // reject promise
     reject(event);
    };
   } else {
    // reject promise
    reject();
   }
  });
 }

 /**
  * @returns {any} target
  */
 get target() {
  return this._target;
 }

 /**
  * @returns {any} open
  */
 get open() {
  return this._open;
 }

 /**
  * 
  * Make IndexedDB store.
  * 
  * @param {any} data
  * @param {string} type
  * @returns {any} store 
  */
 store(data, type) {
  // make dispatch with transaction
  this.dipatch = this.target.transaction([data.constructor.name], type);
  // open a transaction store of type
  return this.dipatch.objectStore(data.constructor.name);
 }

 /**
  * @param {Object} dipatch
  */
 set dipatch(dipatch) {
  this._dipatch = dipatch;
 }

 /**
  * @returns {Object} dipatch
  */
 get dipatch() {
  return this._dipatch;
 }

 /**
  * @param {boolean} result
  */
 set result(result) {
  this._result = result;
 }

 /**
  * @returns {boolean} result
  */
 get result() {
  return this._result;
 }

 /**
  * 
  * Make IndexedDB transaction.
  * 
  * @param {any} store
  * @returns {Promise} transaction
  */
 transaction(store) {
  // make promise
  return new Promise((resolve, reject) => {
   // report success of transaction
   store.onsuccess = (result) => {
    // set result
    this.result = result;
   };
   // report error of transaction
   this.dipatch.onerror = (error) => {
    // resolve promise
    reject(error);
   };
   // report complete of transaction
   this.dipatch.oncomplete = () => {
    // resolve promise
    resolve(this.result);
   };
  });
 }

}