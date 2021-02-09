import { config } from "./services.config.min.js";
import { FirebaseService } from "./services.firebase.min.js";
import { UserIndexedDBService, UserDataStore } from "./services.user.min.js";
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
		// initialize firebase service
		this._firebase = new FirebaseService(config.firebase);
		// make promise to sync events
		return new Promise((resolve, reject) => {
			// dispatch indexed service to listener 
			new UserIndexedDBService().then((indexed) => {
				// set indexed service
				this._indexed = indexed;
				// initialize user data store
				this._store = new UserDataStore(indexed);
				// resolve promise
				resolve(this);
			})
				// request is incorrectly returned
				.catch(() => {
					// reject promise
					reject(this);
				});
		});
	}

	/**
		* @returns {Object} firebase
		*/
	get firebase() {
		return this._firebase;
	}

	/**
		* @returns {Object} indexed
		*/
	get indexed() {
		return this._indexed;
	}

	/**
		* @returns {Object} store
		*/
	get store() {
		return this._store;
	}

	/**
		* @returns {Object} view
		*/
	get view() {
		return this._view;
	}

}

// make a control listener
export const control = new ActivationControl().then((activation) => {
	console.log(activation);
	return activation;
});
// TODO catch message