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
		// set view dispatch
		this._view.dispatch = this.dispatch;
		// set view handler
		this._view.handler = this.handler;
		// set view browse
		this._view.browse = this.browse;
		// set view remove
		this._view.remove = this.remove;
		// initialize firebase service
		this._firebase = new FirebaseService(config.firebase);
		// bind an event handler to verify authentication user
		firebase.auth().onAuthStateChanged((authentication) => {
			// verify user is signed in
			if (authentication) {
				// initialize authentication
				this._authentication = authentication;
				// initialize odor data store
				this._store = new OdorDataStore();
				// initialize session
				this._session = new OdorSession();
				// verify odor is in session
				if (this._session.odor) {
					// set odor data in view
					this._view.odor = this._session;
					// verify user is in session
					if (this._session.user) {
						// return to maps in page
						this._view.return();
					}
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
		* @param {Odor} odor
		*/
	set session(odor) {
		// set odor data in session
		this.session.user = "user";
		this.session.odor = "odor";
		this.session.id = odor.id || "";
		this.session.userid = odor.userid;
		this.session.username = odor.username;
		this.session.usertype = odor.usertype;
		this.session.userorigin = odor.userorigin;
		this.session.intensity = odor.intensity;
		this.session.nuisance = odor.nuisance;
		this.session.type = odor.type;
		this.session.origin = odor.origin;
		this.session.address = odor.address;
		this.session.latitude = odor.latitude;
		this.session.longitude = odor.longitude;
		this.session.date = odor.date;
		this.session.begin = odor.begin;
		this.session.end = odor.end;
	}

	/**
		* @returns {Object} view
		*/
	get view() {
		return this._view;
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
			// verify view identifier
			if (this.view.id) {
				// redirect to list page
				window.location.replace("/list.html");
			} else {
				// redirect to master page
				window.location.replace("/master.html");
			}
		};
	}

	/**
		* @returns {function} dispatch
		*/
	get dispatch() {
		return (odor) => {
			return new Promise((resolve, reject) => {
				try {
					// verify identifier odor
					if (!odor.id) {
						// add odor in store
						this.store.add(odor).then((result) => {
							// resolve promise
							resolve(result);
						})
							// request is incorrectly returned
							.catch((error) => {
								// reject promise
								reject(error);
							});
					} else {
						// update odor in store
						this.store.update(odor).then((result) => {
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
		return this.backward;
	}

	/**
		* @returns {function} browse
		*/
	get browse() {
		return () => {
			// clear session
			this.session.clear();
			// set odor data in session
			this.session = this.view.odor;
			// redirect to maps page
			window.location.replace("/maps.html");
		};
	}

	/**
		* @returns {function} remove
		*/
	get remove() {
		return async (odor) => {
			// verify odor identifier
			if (odor.id) {
				// remove odor in store
				await this.store.remove(odor).then(() => {
					// response handler callback
					this.handler();
				})
					// request is incorrectly returned
					.catch(() => {
						// dispatch view exception
						this.view.exception();
					})
					// finally request
					.finally(() => {
						// release page
						this.view.release();
					});
			} else {
				// clear session
				this.session.clear();
				// response handler callback
				this.handler();
			}
		};
	}

}

// make a control listener
export const control = new OdorControl();