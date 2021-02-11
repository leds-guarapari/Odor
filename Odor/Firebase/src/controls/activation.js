import { config } from "./services.config.min.js";
import { FirebaseService } from "./services.firebase.min.js";
import { ActivationView } from "./views.activation.min.js";

/**
	* 
	* A control class for acts on both model and view.
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
		// set view dispatch
		this._view.dispatch = this.dispatch;
		// set view handler
		this._view.handler = this.handler;
		// initialize firebase service
		this._firebase = new FirebaseService(config.firebase);
	}

	/**
		* @returns {Object} firebase
		*/
	get firebase() {
		return this._firebase;
	}

	/**
		* @returns {Object} view
		*/
	get view() {
		return this._view;
	}

	/**
		* @returns {function} dispatch
		*/
	get dispatch() {
		return (code) => {
			return new Promise((resolve, reject) => {
				try {
					// dispatch authentication sign in with user
					firebase.auth().signInWithEmailAndPassword(config.user, code)
						.then((user) => {
							// resolve promise
							resolve(user);
						})
						.catch(() => {
							// dispatch authentication sign in with admin
							firebase.auth().signInWithEmailAndPassword(config.admin, code)
								.then((user) => {
									// resolve promise
									resolve(user);
								})
								.catch((error) => {
									// reject promise
									reject(error);
								});
						});
				} catch (error) {
					// reject promise
					reject(error);
				}
			});
		};
	}

	/**
		* @returns {function} handler
		*/
	get handler() {
		return () => {
			// redirect to root page
			window.location.replace("/");
		};
	}

}

// make a control listener
export const control = new ActivationControl();