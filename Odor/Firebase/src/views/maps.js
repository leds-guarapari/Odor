import { View } from "./views.view.min.js";

/**
 * 
 * A view class for user page manipulation.
 * 
 */
export class MapsView extends View {

 /**
  * 
  * Extends view class and make listener for all events.
  * 
  * @param {string} source 
  */
 constructor(source) {
  // run constructor in parent class
  super();
  // initialize app bar
  this._bar = new mdc.topAppBar.MDCTopAppBar(document.querySelector(".mdc-top-app-bar"));
  // initialize arrow button
  this._arrow = new mdc.ripple.MDCRipple(document.querySelector("#arrow"));
  // add event listener in arrow button
  this._arrow.listen("click", this.back);
  // initialize page button
  this._button = new mdc.ripple.MDCRipple(document.querySelector("#button"));
  // add event listener in button
  this._button.listen("click", this.click);
  // initialize dispatch with simple promise
  this._dispatch = () => { return Promise.resolve(); };
  // initialize handler with simple function
  this._handler = () => { };
  // initialize browse with simple function
  this._browse = () => { };
  // initialize fab button
  this._fab = new mdc.ripple.MDCRipple(document.querySelector(".mdc-fab"));
  // add event listener in fab button
  this._fab.listen("click", this.obtain);
  // initialize receive with simple function
  this._receive = () => { };
  // initialize process with simple function
  this._process = () => { };
  // create the script tag, set the appropriate attributes
  this._script = document.createElement("script");
  this._script.src = source;
  this._script.async = true;
  // attach callback function
  window.initMap = () => {
   // initialize maps
   this._maps = new google.maps.Map(this.element("maps"), { zoom: 2, center: { lat: 0, lng: 0 } });
   // initialize marker
   this._marker = new google.maps.Marker();
   // set maps in marker
   this._marker.setMap(this._maps);
   // add event listener in maps
   this._maps.addListener("click", this.go);
   // dispatch process to listener
   this.process(google);
  };
 }

 /**
  * @returns {Object} bar
  */
 get bar() {
  return this._bar;
 }

 /**
  * @returns {Object} arrow
  */
 get arrow() {
  return this._arrow;
 }

 /**
  * @returns {Object} button
  */
 get button() {
  return this._button;
 }

 /**
  * @returns {Object} script
  */
 get script() {
  return this._script;
 }

 /**
  * @returns {Object} maps
  */
 get maps() {
  return this._maps;
 }

 /**
  * @returns {Object} marker
  */
 get marker() {
  return this._marker;
 }

 /**
  * @returns {Object} fab
  */
 get fab() {
  return this._fab;
 }

 init() {
  // append script element in page
  document.head.appendChild(this.script);
 }

 /**
  * @returns {function} process
  */
 get process() {
  return this._process;
 }

 /**
  * @param {function} process
  */
 set process(process) {
  this._process = process;
 }

 /**
  * @returns {Event} click
  */
 get click() {
  // make event
  return async (event) => {
   // event prevent default
   event.preventDefault();
   // verify is busy
   if (!this.busy) {
    // lock page
    this.lock();
    // dispatch event to listener
    await this.dispatch(this.address, this.latitude, this.longitude).then(() => {
     // response handler callback
     this.handler();
    })
     // request is incorrectly returned
     .catch(() => {
      // dispatch exception
      this.exception();
     })
     // finally request
     .finally(() => {
      // release page
      this.release();
     });
   }
  };
 }

 /**
  * @returns {Event} go
  */
 get go() {
  // make event
  return async (position) => {
   // lock page
   this.lock();
   // dispatch event to listener
   await this.browse({
    lat: position.latLng.lat(),
    lng: position.latLng.lng(),
   });
  };
 }

 /**
  * @returns {Promise} dispatch
  */
 get dispatch() {
  return this._dispatch;
 }

 /**
  * @param {Promise} dispatch
  */
 set dispatch(dispatch) {
  this._dispatch = dispatch;
 }

 /**
  * @returns {function} handler
  */
 get handler() {
  return this._handler;
 }

 /**
  * @param {function} handler
  */
 set handler(handler) {
  this._handler = handler;
 }

 /**
  * @returns {function} browse
  */
 get browse() {
  return this._browse;
 }

 /**
  * @param {function} browse
  */
 set browse(browse) {
  this._browse = browse;
 }

 /**
  * @returns {Event} obtain
  */
 get obtain() {
  // make event
  return async (event) => {
   // lock page
   this.lock();
   // dispatch event to listener
   await this.receive(event);
  };
 }

 /**
  * @returns {function} receive
  */
 get receive() {
  return this._receive;
 }

 /**
  * @param {function} receive
  */
 set receive(receive) {
  this._receive = receive;
 }

 /**
  * @param {string} address
  */
 set address(address) {
  this._address = address;
 }

 /**
  * @returns {string} address
  */
 get address() {
  return this._address;
 }

 /**
  * @param {number} latitude
  */
 set latitude(latitude) {
  this._latitude = latitude;
 }

 /**
  * @returns {number} latitude
  */
 get latitude() {
  return this._latitude;
 }

 /**
  * @param {number} longitude
  */
 set longitude(longitude) {
  this._longitude = longitude;
 }

 /**
  * @returns {number} longitude
  */
 get longitude() {
  return this._longitude;
 }

}