import { config } from "./services.config.min.js";
import { FirebaseService } from "./services.firebase.min.js";
import { ActivationView } from "./views.activation.min.js";

/**
 * 
 * A final control class for acts on both model and view.
 * 
 */
export class ActivationControl {

 /**
  * 
  * Extends control class and make listener for all events
  * 
  */
 constructor() {
  // initialize view listener
  this._view = new ActivationView();
  // initialize firebase service
  this._firebase = new FirebaseService(config.firebase);
 }

 /**
  * @returns {Object} view
  */
 get view() {
  return this._view;
 }

 /**
  * @returns {Object} firebase
  */
 get firebase() {
  return this._firebase;
 }

}

// make a control listener
export const control = new ActivationControl();