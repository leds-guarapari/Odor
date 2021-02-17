import { config } from "./services.config.min.js";
import { FirebaseService } from "./services.firebase.min.js";
import { MasterView } from "./views.master.min.js";

/**
	* 
	* A control class for acts on both model and view.
	* 
	*/
export class MasterControl {

	/**
		* 
		* Extends control class and make listener for all events
		* 
		*/
	constructor() {
		// initialize view listener
		this._view = new MasterView();
		// set view backward
		this._view.backward = this.backward;
		// set organization text in view page
		this._view.organization = config.organization;
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
			window.location.replace("/");
		};
	}

}

// make a control listener
export const control = new MasterControl();