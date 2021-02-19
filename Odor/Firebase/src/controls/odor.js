import { config } from "./services.config.min.js";
import { FirebaseService } from "./services.firebase.min.js";
import { OdorDataStore, OdorSession } from "./services.odor.min.js";
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
				// initialize session
				this._session = new OdorSession();
				// verify odor is in session
				if (this._session.odor) {
					// TODO
					// release view page
					this._view.release();
				} else {
					// clear session
					this._session.clear();
					// redirect to master page
					window.location.replace("/master.html");
				}
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
			// redirect to root page
			// TODO
			window.location.replace("/");
		};
	}

}

// make a control listener
export const control = new OdorControl();