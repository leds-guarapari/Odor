import { config } from "./services.config.min.js";
import { FirebaseService } from "./services.firebase.min.js";
import { OdorSession } from "./services.odor.min.js";
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
		// initialize firebase service
		this._firebase = new FirebaseService(config.firebase);
		// bind an event handler to verify authentication user
		firebase.auth().onAuthStateChanged((authentication) => {
			// verify user is signed in
			if (authentication) {
				// initialize authentication
				this._authentication = authentication;
				// initialize session
				this._session = new OdorSession();
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
		* @returns {Object} session
		*/
	get session() {
		return this._session;
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
			// redirect to master page
			window.location.replace("/master.html");
		};
	}

}

// make a control listener
export const control = new ListControl();