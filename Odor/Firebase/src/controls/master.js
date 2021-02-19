import { config } from "./services.config.min.js";
import { FirebaseService } from "./services.firebase.min.js";
import { UserIndexedDBService, UserDataStore, UserSession } from "./services.user.min.js";
import { OdorSession } from "./services.odor.min.js";
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
				// initialize session
				this._session = new UserSession();
				// clear session
				this._session.clear();
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
						// verify user is stored
						if (this._user.id) {
							// initialize session
							this._session = new OdorSession();
							// set odor data in session with user
							this.session = this._user;
						} else {
							// redirect to user page
							window.location.replace("/user.html");
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
		// set odor data in session with user
		this.session.odor = "odor";
		this.session.userid = user.id;
		this.session.username = user.name;
		this.session.usertype = "";
		this.session.userorigin = "";
		this.session.intensity = config.odor.intensity;
		this.session.nuisance = config.odor.nuisance;
		this.session.type = config.odor.type;
		this.session.origin = config.odor.origin;
		this.session.address = user.address || config.odor.address;
		this.session.latitude = user.latitude || 0;
		this.session.longitude = user.longitude || 0;
		let date = new Date();
		this.session.date = date.toJSON();
		this.session.begin = date.toLocaleTimeString();
		this.session.end = date.toLocaleTimeString();
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

}

// make a control listener
export const control = new MasterControl();