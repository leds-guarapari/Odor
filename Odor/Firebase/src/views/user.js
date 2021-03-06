import { User } from "./models.user.min.js";
import { View } from "./views.view.min.js";

/**
 * 
 * A view class for user page manipulation.
 * 
 */
export class UserView extends View {

 /**
  * 
  * Extends view class and make listener for all events.
  * 
  */
 constructor() {
  // run constructor in parent class
  super();
  // initialize app bar
  this._bar = new mdc.topAppBar.MDCTopAppBar(document.querySelector(".mdc-top-app-bar"));
  // initialize arrow button
  this._arrow = new mdc.ripple.MDCRipple(document.querySelector("#arrow"));
  // add event listener in arrow button
  this._arrow.listen("click", this.back);
  // initialize glide
  this._glide = new Glide(".glide").mount();
  // disable keyboard in glide
  this._glide.keyboard = false;
  // initialize indexes
  this._indexes = Object.freeze({ "name": 0, "number": 1, "address": 2 });
  // initialize page button
  this._button = new mdc.ripple.MDCRipple(document.querySelector("#button"));
  // add event listener in button
  this._button.listen("click", this.click);
  // initialize dispatch with simple promise
  this._dispatch = () => { return Promise.resolve(); };
  // initialize handler with simple function
  this._handler = () => { };
  // initialize user name
  this._name = new mdc.textField.MDCTextField(document.querySelector("#name"));
  // initialize user number
  this._number = new mdc.textField.MDCTextField(document.querySelector("#number"));
  // initialize user address
  this._address = new mdc.textField.MDCTextField(document.querySelector("#address"));
  // initialize maps button
  this._maps = new mdc.ripple.MDCRipple(document.querySelector("#maps"));
  // add event listener in maps button
  this._maps.listen("click", this.go);
  // initialize browse with simple function
  this._browse = () => { };
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
  * @returns {Object} glide
  */
 get glide() {
  return this._glide;
 }

 /**
  * @returns {Object} indexes
  */
 get indexes() {
  return this._indexes;
 }

 /**
  * @returns {Object} button
  */
 get button() {
  return this._button;
 }

 /**
  * @returns {Object} maps
  */
 get maps() {
  return this._maps;
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
    // switch index glide
    switch (this.glide.index) {
     case this.indexes.name:
      // verify name is valid
      if (!this.name.value) {
       // set invalid name
       this.name.valid = false;
      } else {
       // move one forward
       this.glide.go(">");
      }
      break;
     case this.indexes.number:
      // verify number is valid
      if (!this.number.value) {
       // set invalid name
       this.number.valid = false;
      } else {
       // move one forward
       this.glide.go(">");
      }
      break;
     case this.indexes.address:
      // verify name is valid
      if (!this.name.value) {
       // set invalid name
       this.name.valid = false;
       // move to first slide
       this.glide.go("=0");
      }
      // verify number is valid
      else if (!this.number.value) {
       // set invalid name
       this.number.valid = false;
       // move to second slide
       this.glide.go("=1");
      } else {
       // lock page
       this.lock();
       // dispatch event to listener
       await this.dispatch(this.user).then(() => {
        // dispatch success
        this.success();
        // response handler callback
        setTimeout(this.handler, 2000);
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
      break;
     default:
      break;
    }
   }
  };
 }

 /**
  * @returns {Event} go
  */
 get go() {
  // make event
  return (event) => {
   // event prevent default
   event.preventDefault();
   // lock page
   this.lock();
   // dispatch event to listener
   this.browse();
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
  * @param {string} id
  */
 set id(id) {
  this._id = id;
 }

 /**
  * @returns {string} id
  */
 get id() {
  return this._id;
 }

 /**
  * @param {string} name
  */
 set name(name) {
  this.name.value = name;
 }

 /**
  * @returns {Object} name
  */
 get name() {
  return this._name;
 }

 /**
  * @param {string} number
  */
 set number(number) {
  this.number.value = number;
 }

 /**
  * @returns {Object} number
  */
 get number() {
  return this._number;
 }

 /**
  * @param {string} address
  */
 set address(address) {
  this.address.value = address;
 }

 /**
  * @returns {Object} address
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
  * @returns {Number} latitude
  */
 get latitude() {
  return this._latitude || 0;
 }

 /**
  * @param {number} longitude
  */
 set longitude(longitude) {
  this._longitude = longitude;
 }

 /**
  * @returns {Number} longitude
  */
 get longitude() {
  return this._longitude || 0;
 }

 /**
 * @param {User} user
 */
 set user(user) {
  // set user data in page
  this.id = user.id;
  this.name = user.name;
  this.number = user.number;
  this.address = user.address;
  this.latitude = user.latitude;
  this.longitude = user.longitude;
 }

 /**
  * @returns {User} user
  */
 get user() {
  // make user data
  let user = new User();
  user.id = this.id;
  user.name = this.name.value;
  user.number = this.number.value;
  user.address = this.address.value;
  user.latitude = this.latitude;
  user.longitude = this.longitude;
  return user;
 }

 /**
  * return to maps in page
  */
 return() {
  // move to third slide
  this.glide.go("=2");
 }

}