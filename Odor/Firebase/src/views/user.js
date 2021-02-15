import { User } from "./models.user.min.js";

/**
	* 
	* A view class for user page manipulation.
	* 
	*/
export class UserView {

	/**
		* 
		* Extends view class and make listener for all events.
		* 
		*/
	constructor() {
		// initialize busy
		this._busy = true;
		// initialize page progress
		this._progress = new mdc.linearProgress.MDCLinearProgress(document.querySelector(".mdc-linear-progress"));
		// initialize app bar
		this._bar = new mdc.topAppBar.MDCTopAppBar(document.querySelector(".mdc-top-app-bar"));
		// initialize arrow button
		this._arrow = new mdc.ripple.MDCRipple(document.querySelector("#arrow"));
		// add event listener in arrow button
		this._arrow.listen("click", this.back);
		// initialize glide
		this._glide = new Glide(".glide").mount();
		// initialize indexes
		this._indexes = Object.freeze({ "name": 0, "number": 1, "address": 2 });
		// initialize page button
		this._button = new mdc.ripple.MDCRipple(document.querySelector("#button"));
		// add event listener in button
		this._button.listen("click", this.click);
		// initialize dispatch with simple promise
		this._dispatch = () => { return Promise.resolve(); };
		// initialize handler with simple function
		this._handler = () => { };
		// initialize user name
		this._name = new mdc.textField.MDCTextField(document.querySelector("#name"));
		// initialize user name
		this._number = new mdc.textField.MDCTextField(document.querySelector("#number"));
		// initialize user address
		this._address = new mdc.textField.MDCTextField(document.querySelector("#address"));
		// initialize page snackbar
		this._snackbar = new mdc.snackbar.MDCSnackbar(document.querySelector(".mdc-snackbar"));
	}

	/**
		* @returns {Object} bar
		*/
	get bar() {
		return this._bar;
	}

	/**
		* @returns {Object} arrow
		*/
	get arrow() {
		return this._arrow;
	}

	/**
		* @returns {Object} glide
		*/
	get glide() {
		return this._glide;
	}

	/**
		* @returns {Object} indexes
		*/
	get indexes() {
		return this._indexes;
	}

	/**
		* @returns {Object} button
		*/
	get button() {
		return this._button;
	}

	/**
		* @returns {Event} click
		*/
	get click() {
		// make event
		return async (event) => {
			// event prevent default
			event.preventDefault();
			// verify is busy
			if (!this.busy) {
				// switch index glide
				switch (this.glide.index) {
					case this.indexes.name:
						// verify name is valid
						if (!this.name.value) {
							// set invalid name
							this.name.valid = false;
						} else {
							// move one forward
							this.glide.go(">");
						}
						break;
					case this.indexes.number:
						// verify number is valid
						if (!this.number.value) {
							// set invalid name
							this.number.valid = false;
						} else {
							// move one forward
							this.glide.go(">");
						}
						break;
					case this.indexes.address:
						// verify name is valid
						if (!this.name.value) {
							// set invalid name
							this.name.valid = false;
							// move to first slide
							this.glide.go("=0");
						}
						// verify number is valid
						else if (!this.number.value) {
							// set invalid name
							this.number.valid = false;
							// move to second slide
							this.glide.go("=1");
						} else {
							// lock page
							this.lock();
							// dispatch event to listener
							await this.dispatch(this.user).then(() => {
								// response handler callback
								this.handler();
							})
								// request is incorrectly returned
								.catch(() => {
									// dispatch exception
									this.exception();
								})
								// finally request
								.finally(() => {
									// release page
									this.release();
								});
						}
						break;
					default:
						break;
				}
			}
		};
	}

	/**
		* @returns {Event} back
		*/
	get back() {
		// make event
		return (event) => {
			// event prevent default
			event.preventDefault();
			// dispatch event to listener
			this.backward();
		};
	}

	/**
		* @returns {function} backward
		*/
	get backward() {
		return this._backward;
	}

	/**
		* @param {function} backward
		*/
	set backward(backward) {
		this._backward = backward;
	}

	/**
		* @returns {Promise} dispatch
		*/
	get dispatch() {
		return this._dispatch;
	}

	/**
		* @param {Promise} dispatch
		*/
	set dispatch(dispatch) {
		this._dispatch = dispatch;
	}

	/**
		* @returns {function} handler
		*/
	get handler() {
		return this._handler;
	}

	/**
		* @param {function} handler
		*/
	set handler(handler) {
		this._handler = handler;
	}

	/**
		* @returns {boolean} busy
		*/
	get busy() {
		return this._busy;
	}

	/**
		* @param {boolean} busy
		*/
	set busy(busy) {
		this._busy = busy;
	}

	/**
		* @param {string} id
		*/
	set id(id) {
		this._id = id;
	}

	/**
		* @returns {string} id
		*/
	get id() {
		return this._id;
	}

	/**
		* @returns {Object} name
		*/
	get name() {
		return this._name;
	}

	/**
		* @returns {Object} number
		*/
	get number() {
		return this._number;
	}

	/**
		* @returns {Object} address
		*/
	get address() {
		return this._address;
	}

	/**
		* @param {number} latitude
		*/
	set latitude(latitude) {
		this._latitude = latitude;
	}

	/**
		* @returns {Number} latitude
		*/
	get latitude() {
		return this._latitude || 0;
	}

	/**
		* @param {number} longitude
		*/
	set longitude(longitude) {
		this._longitude = longitude;
	}

	/**
		* @returns {Number} longitude
		*/
	get longitude() {
		return this._longitude || 0;
	}

	/**
	* @param {User} user
	*/
	set user(user) {
		// set user data in page
		this.id = user.id;
		this.name.value = user.name;
		this.number.value = user.number;
		this.address.value = user.address;
		this.latitude = user.latitude;
		this.longitude = user.longitude;
	}

	/**
		* @returns {User} user
		*/
	get user() {
		// make user data
		let user = new User();
		user.id = this.id;
		user.name = this.name.value;
		user.number = this.number.value;
		user.address = this.address.value;
		user.latitude = this.latitude;
		user.longitude = this.longitude;
		return user;
	}

	/**
		* @returns {Object} progress
		*/
	get progress() {
		return this._progress;
	}

	/**
		* @returns {Object} snackbar
		*/
	get snackbar() {
		return this._snackbar;
	}

	/**
		* release page
		*/
	release() {
		// set busy
		this.busy = false;
		// close progress
		this.progress.close();;
	}

	/**
		* @param {string} id
		* @returns {any} element
		*/
	element(id) {
		// get page element of id
		return document.getElementById(id);
	}

	/**
		* @param {string} text 
		*/
	message(text) {
		// set text in snackbar
		this.snackbar.labelText = text;
		// open snackbar
		this.snackbar.open();
	}

	exception() {
		// send exception message
		this.message(this.element("exception").value);
	}

}