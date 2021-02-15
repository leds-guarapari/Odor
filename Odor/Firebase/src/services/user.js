import { User } from "./models.user.min.js";
import { DataStore } from "./services.store.min.js";
import { IndexedDBStore, IndexedDBService } from "./services.indexed.min.js";

/**
	* 
	* A class for user data manipulation in IndexedDB.
	* 
	*/
export class UserIndexedDBService extends IndexedDBService {

	constructor() {
		// run constructor in parent class
		super("Odor", [new IndexedDBStore("User", "_id")]);
	}

}

/**
	* 
	* A class to persist user objects.
	* 
	*/
export class UserDataStore extends DataStore {

	/**
		* @param {UserIndexedDBService} indexed
		*/
	constructor(indexed) {
		// run constructor in parent class
		super();
		// set indexed service
		this._indexed = indexed;
		// make add promise
		this.add = (user) => {
			return new Promise((resolve, reject) => {
				try {
					// make a new user reference with an auto-generated id
					let transaction = firebase.database().ref("users").push();
					// dispatch set event to listener
					transaction.set({
						Name: user.name,
						Number: user.number,
						Address: user.address,
						Latitude: user.latitude,
						Longitude: user.longitude
					}).then(() => {
						// set identifier data
						user.id = transaction.key;
						// dispatch add event to listener
						indexed.add(user).then(() => {
							// resolve promise
							resolve(user);
						})
							// request is incorrectly returned
							.catch((error) => {
								// reject promise
								reject(error);
							});
					})
						// request is incorrectly returned
						.catch((error) => {
							// reject promise
							reject(error);
						});
				} catch (error) {
					// reject promise
					reject(error);
				}
			});
		};
		// make update promise
		this.update = (user) => {
			return new Promise((resolve, reject) => {
				try {
					// dispatch set event to listener
					firebase.database().ref("users/" + user.id).set({
						Name: user.name,
						Number: user.number,
						Address: user.address,
						Latitude: user.latitude,
						Longitude: user.longitude
					}).then(() => {
						// dispatch update event to listener
						indexed.update(user).then(() => {
							// resolve promise
							resolve(user);
						})
							// request is incorrectly returned
							.catch((error) => {
								// reject promise
								reject(error);
							});
					})
						// request is incorrectly returned
						.catch((error) => {
							// reject promise
							reject(error);
						});
				} catch (error) {
					// reject promise
					reject(error);
				}
			});
		};
		// set query promise
		this.query = indexed.query;
	}

	/**
		* @returns {Object} indexed
		*/
	get indexed() {
		return this._indexed;
	}

	/**
		* @returns {User} user
		*/
	get user() {
		// dispatch query transaction
		return this.query(User.prototype).then((event) => {
			// make user data
			let user = new User();
			// for all result
			event.target.result.forEach(data => {
				// set data user
				user.id = data._id;
				user.name = data._name;
				user.number = data._number;
				user.address = data._address;
				user.latitude = data._latitude;
				user.longitude = data._longitude;
			});
			// return user
			return user;
		});
	}

}

/**
	* 
	* Default data manipulation in session store.
	* 
	*/
export class UserSession {

	/**
		* @param {string} user
		*/
	set user(user) {
		window.sessionStorage.setItem("user", user);
	}

	/**
		* @returns {string} user
		*/
	get user() {
		return window.sessionStorage.getItem("user");
	}

	/**
		* @param {string} id
		*/
	set id(id) {
		window.sessionStorage.setItem("id", id);
	}

	/**
		* @returns {string} id
		*/
	get id() {
		return window.sessionStorage.getItem("id");
	}

	/**
		* @param {string} name
		*/
	set name(name) {
		window.sessionStorage.setItem("name", name);
	}

	/**
		* @returns {string} name
		*/
	get name() {
		return window.sessionStorage.getItem("name");
	}

	/**
		* @param {string} number
		*/
	set number(number) {
		window.sessionStorage.setItem("number", number);
	}

	/**
		* @returns {string} number
		*/
	get number() {
		return window.sessionStorage.getItem("number");
	}

	/**
		* @param {string} address
		*/
	set address(address) {
		window.sessionStorage.setItem("address", address);
	}

	/**
		* @returns {string} address
		*/
	get address() {
		return window.sessionStorage.getItem("address");
	}

	/**
		* @param {number} latitude
		*/
	set latitude(latitude) {
		window.sessionStorage.setItem("latitude", latitude.toString(10));
	}

	/**
		* @returns {number} latitude
		*/
	get latitude() {
		return Number(window.sessionStorage.getItem("latitude") || "0");
	}

	/**
		* @param {number} longitude
		*/
	set longitude(longitude) {
		window.sessionStorage.setItem("longitude", longitude.toString(10));
	}

	/**
		* @returns {number} longitude
		*/
	get longitude() {
		return Number(window.sessionStorage.getItem("longitude") || "0");
	}

	/**
		* remove all saved data from session
		*/
	clear() {
		window.sessionStorage.clear();
	}

}