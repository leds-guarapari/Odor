import { config } from "./services.config.min.js";
import { FirebaseService } from "./services.firebase.min.js";
import { UserIndexedDBService, UserDataStore } from "./services.user.min.js";
import { UserView } from "./views.user.min.js";

/**
	* 
	* A control class for acts on both model and view.
	* 
	*/
export class UserControl {

	/**
		* 
		* Extends control class and make listener for all events
		* 
		*/
	constructor() {
		// initialize view listener
		this._view = new UserView();
		// set view dispatch
		this._view.dispatch = this.dispatch;
		// set view handler
		this._view.handler = this.handler;
		// initialize firebase service
		this._firebase = new FirebaseService(config.firebase);
		// dispatch indexed service to listener 
		this._service = new UserIndexedDBService().then((indexed) => {
			// set indexed service
			this._indexed = indexed;
			// initialize user data store
			this._store = new UserDataStore(indexed);
			// dispatch query to user stored
			this._store.user.then((user) => {
				// verify user is stored
				if (user.id) {
					// TODO view
					// set user
					this._user = user;
				}
			});
		})
			// request is incorrectly returned
			.catch(() => {
				// dispatch view exception
				this._view.exception();
			});
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
		* @returns {function} dispatch
		*/
	get dispatch() {
		return (user) => {
			return new Promise((resolve, reject) => {
				try {
					// TODO
					resolve(user);
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
			// redirect to master page
			window.location.replace("/master.html");
		};
	}

}

// make a control listener
export const control = new UserControl();