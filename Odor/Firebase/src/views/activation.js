/**
	* 
	* A view class for activation page manipulation.
	* 
	*/
export class ActivationView {

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
		// initialize page code
		this._code = new mdc.textField.MDCTextField(document.querySelector("#code"));
		// initialize visibility code
		this._visibility = new mdc.textField.MDCTextFieldIcon(document.querySelector("#code-visibility"));
		// add event listener in icon button
		this._visibility.listen("click", this.watch);
		// initialize page button
		this._button = new mdc.ripple.MDCRipple(document.querySelector(".mdc-button"));
		// add event listener in button
		this._button.listen("click", this.click);
		// initialize dispatch with simple promise
		this._dispatch = () => { return Promise.resolve(); };
		// initialize handler with simple function
		this._handler = () => { };
		// initialize page snackbar
		this._snackbar = new mdc.snackbar.MDCSnackbar(document.querySelector(".mdc-snackbar"));
	}

	/**
		* @returns {Object} code
		*/
	get code() {
		return this._code;
	}

	/**
		* @returns {Object} visibility
		*/
	get visibility() {
		return this._visibility;
	}

	/**
		* @returns {Event} watch
		*/
	get watch() {
		// make event
		return (event) => {
			// event prevent default
			event.preventDefault();
			// verify is valid code
			if (this.code.value) {
				// send message code
				this.message(this.code.value);
			} else {
				// set valid code
				this.code.valid = false;
			}
		};
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
				// verify is valid code
				if (this.code.value) {
					// set busy
					this.busy = true;
					// open progress
					this.progress.open();
					// dispatch event to listener
					await this.dispatch(this.code.value).then(() => {
						// response handler callback
						this.handler();
					})
						// request is incorrectly returned
						.catch((error) => {
							// verify error
							if (error && error.code && error.code === "auth/wrong-password") {
								// send invalid message
								this.invalid();
							} else {
								// dispatch exception
								this.exception();
							}
						})
						// finally request
						.finally(() => {
							// set busy
							this.busy = false;
							// close progress
							this.progress.close();
						});
				} else {
					// set valid code
					this.code.valid = false;
				}
			}
		};
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

	invalid() {
		// set valid code
		this.code.valid = false;
		// send invalid message
		this.message(this.element("invalid").value);
	}

	exception() {
		// send exception message
		this.message(this.element("exception").value);
	}

}