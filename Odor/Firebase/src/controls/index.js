import { config } from "./services.config.min.js";
import { FirebaseService } from "./services.firebase.min.js";
import { UserIndexedDBService, UserDataStore } from "./services.user.min.js";
import { IndexView } from "./views.index.min.js";

/**
	* 
	* A control class for acts on both model and view.
	* 
	*/
export class IndexControl {

	/**
		* 
		* Extends control class and make listener for all events
		* 
		*/
	constructor() {
		// initialize view listener
		this._view = new IndexView();
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
				// dispatch indexed service to listener 
				this._service = new UserIndexedDBService().then((indexed) => {
					// set indexed service
					this._indexed = indexed;
					// initialize user data store
					this._store = new UserDataStore(indexed);
					// dispatch query to user stored
					this._store.user.then((user) => {
						// initialize user
						this._user = user;
						// verify user is stored
						if (user.id) {
							// redirect to master page
							window.location.replace("/master.html");
						} else {
							// redirect to user page
							window.location.replace("/user.html");
						}
					});
				})
					// request is incorrectly returned
					.catch(() => {
						// release view page
						this._view.release();
						// dispatch view exception
						this._view.exception();
					});
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
		* @returns {Object} user
		*/
	get user() {
		return this._user;
	}

	/**
		* @returns {Object} view
		*/
	get view() {
		return this._view;
	}

	/**
		* @returns {Object} indexed
		*/
	get indexed() {
		return this._indexed;
	}

	/**
		* @returns {Object} service
		*/
	get service() {
		return this._service;
	}

	/**
		* @returns {Object} store
		*/
	get store() {
		return this._store;
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
export const control = new IndexControl();