import { config } from "./services.config.min.js";
import { MapsSession } from "./services.maps.min.js";
import { MapsView } from "./views.maps.min.js";

/**
 * 
 * A control class for acts on both model and view.
 * 
 */
export class MapsControl {

 /**
  * 
  * Extends control class and make listener for all events
  * 
  */
 constructor() {
  // initialize source
  this._source = "https://maps.googleapis.com/maps/api/js?key=" + config.firebase.apiKey + "&callback=initMap"
  // initialize view listener
  this._view = new MapsView(this._source);
  // initialize session
  this._session = new MapsSession();
  // set view backward
  this._view.backward = this.backward;
  // set view dispatch
  this._view.dispatch = this.dispatch;
  // set view handler
  this._view.handler = this.handler;
  // set view browse
  this._view.browse = this.browse;
  // set view receive
  this._view.receive = this.receive;
  // set view process
  this._view.process = this.process;
  // init maps in view
  this._view.init();
 }

 /**
  * @returns {string} source
  */
 get source() {
  return this._source;
 }

 /**
  * @returns {Object} session
  */
 get session() {
  return this._session;
 }

 /**
  * @param {Object} data
  */
 set session(data) {
  // set data in session
  this.session.address = data.address;
  this.session.latitude = data.latitude;
  this.session.longitude = data.longitude;
 }

 /**
  * @returns {Object} view
  */
 get view() {
  return this._view;
 }

 /**
  * @returns {Object} geocoder
  */
 get geocoder() {
  return this._geocoder;
 }

 /**
  * @returns {function} dispatch
  */
 get dispatch() {
  return (address, latitude, longitude) => {
   return new Promise((resolve, reject) => {
    try {
     // set data in session
     this.session = {
      address: address,
      latitude: latitude,
      longitude: longitude
     };
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
  * @returns {function} backward
  */
 get backward() {
  return () => {
   // verify session with odor
   if (this.session.odor) {
    // redirect to odor page
    window.location.replace("/odor");
   }
   // verify session with user
   else if (this.session.user) {
    // redirect to user page
    window.location.replace("/user");
   } else {
    // clear session
    this.session.clear();
    // redirect to master page
    window.location.replace("/master");
   }
  };
 }

 /**
  * @returns {function} handler
  */
 get handler() {
  return this.backward;
 }

 /**
  * @returns {function} browse
  */
 get browse() {
  return async (position) => {
   // set latitude
   this.view.latitude = position.lat;
   // set longitude
   this.view.longitude = position.lng;
   // send view message
   this.view.message(config.address.localizing);
   // human-readable address into a location on maps
   await this.geocoder.geocode({ location: position }, (results, status) => {
    // verify result
    if (status === "OK" && results[0]) {
     // set address
     this.view.address = results[0].formatted_address;
     // send view message
     this.view.message(config.address.localized);
    }
   });
   // set position in maker view
   this.view.marker.setPosition(position);
   // release view page
   this.view.release();
  };
 }

 /**
  * @returns {function} receive
  */
 get receive() {
  return async () => {
   // verify if navigator is supported
   if (navigator.geolocation) {
    // receive current position of device 
    navigator.geolocation.getCurrentPosition(async (position) => {
     // set position
     await this.position({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
     });
    }, () => {
     // release view page
     this.view.release();
    }, {
     enableHighAccuracy: true
    });
   }
  };
 }

 /**
  * @returns {function} process
  */
 get process() {
  return async (google) => {
   // initialize geocoder
   this._geocoder = new google.maps.Geocoder();
   // verify session
   if (this.session.latitude !== 0 && this.session.longitude !== 0) {
    // set position
    await this.position({
     lat: this.session.latitude,
     lng: this.session.longitude,
    });
   } else {
    // dispatch receive to listener
    await this.receive();
   }
  };
 }

 /**
  * @param {object} position 
  */
 async position(position) {
  // set zoom in maps view
  this.view.maps.setZoom(16);
  // set center in maps view
  this.view.maps.setCenter(position);
  // dispatch browse to listener
  await this.browse(position);
 }

}

// make a control listener
export const control = new MapsControl();