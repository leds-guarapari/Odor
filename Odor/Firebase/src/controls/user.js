import { config } from "./services.config.min.js";
import { FirebaseService } from "./services.firebase.min.js";
import { UserIndexedDBService, UserDataStore, UserSession } from "./services.user.min.js";
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
		// set view backward
		this._view.backward = this.backward;
		// set view dispatch
		this._view.dispatch = this.dispatch;
		// set view handler
		this._view.handler = this.handler;
		// set view browse
		this._view.browse = this.browse;
		// initialize firebase service
		this._firebase = new FirebaseService(config.firebase);
		// bind an event handler to verify authentication user
		firebase.auth().onAuthStateChanged((authentication) => {
			// verify user is signed in
			if (authentication) {
				// initialize authentication
				this._authentication = authentication;
				// initialize session
				this._session = new UserSession();
				// dispatch indexed service to listener 
				this._service = new UserIndexedDBService().then((indexed) => {
					// set indexed service
					this._indexed = indexed;
					// initialize user data store
					this._store = new UserDataStore(indexed);
					// dispatch query to user stored
					return this._store.user.then((user) => {
						// initialize user
						this._user = user;
						// verify user is in session
						if (this._session.user) {
							// set user data in view
							this._view.user = this._session;
							// return to maps in page
							this._view.return();
						}
						// verify user is stored
						else if (this._user.id) {
							// set user data in view
							this._view.user = this._user;
						}
					});
				})
					// request is incorrectly returned
					.catch(() => {
						// dispatch view exception
						this._view.exception();
					})
					.finally(() => {
						// release view page
						this._view.release();
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
		* @returns {Object} session
		*/
	get session() {
		return this._session;
	}

	/**
		* @param {User} user
		*/
	set session(user) {
		// set user data in session
		this.session.user = "user";
		this.session.id = user.id || "";
		this.session.name = user.name;
		this.session.number = user.number;
		this.session.address = user.address;
		this.session.latitude = user.latitude;
		this.session.longitude = user.longitude;
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
			// clear session
			this.session.clear();
			// redirect to root page
			window.location.replace("/");
		};
	}

	/**
		* @returns {function} dispatch
		*/
	get dispatch() {
		return (user) => {
			return new Promise((resolve, reject) => {
				try {
					// verify identifier user
					if (!user.id) {
						// add user in store
						this.store.add(user).then((result) => {
							// clear session
							this.session.clear();
							// resolve promise
							resolve(result);
						})
							// request is incorrectly returned
							.catch((error) => {
								// reject promise
								reject(error);
							});
					} else {
						// update user in store
						this.store.update(user).then((result) => {
							// clear session
							this.session.clear();
							// resolve promise
							resolve(result);
						})
							// request is incorrectly returned
							.catch((error) => {
								// reject promise
								reject(error);
							});
					}
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

	/**
		* @returns {function} browse
		*/
	get browse() {
		return () => {
			// clear session
			this.session.clear();
			// set user data in session
			this.session = this.view.user;
			// redirect to maps page
			window.location.replace("/maps.html");
		};
	}

}

// make a control listener
export const control = new UserControl();