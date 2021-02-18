import { config } from "./services.config.min.js";
import { FirebaseService } from "./services.firebase.min.js";
import { OdorView } from "./views.odor.min.js";

/**
	* 
	* A control class for acts on both model and view.
	* 
	*/
export class OdorControl {

	/**
		* 
		* Extends control class and make listener for all events
		* 
		*/
	constructor() {
		// initialize view listener
		this._view = new OdorView();
		// set view backward
		this._view.backward = this.backward;
		// initialize firebase service
		this._firebase = new FirebaseService(config.firebase);
		// bind an event handler to verify authentication user
		firebase.auth().onAuthStateChanged((authentication) => {
			// verify user is signed in
			if (authentication) {
				// initialize authentication
				this._authentication = authentication;
				// release view page
				this._view.release();
			} else {
				// redirect to activation page
				window.location.replace("/activation.html");
			}
		});
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
		* @returns {Object} view
		*/
	get view() {
		return this._view;
	}

	/**
		* @returns {function} backward
		*/
	get backward() {
		return () => {
			// redirect to root page
			// TODO
			window.location.replace("/");
		};
	}

}

// make a control listener
export const control = new OdorControl();