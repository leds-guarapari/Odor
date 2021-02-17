/**
	* 
	* A generic view class for page manipulation.
	* 
	*/
export class View {

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
		// verify compatibility push state
		if (window.history.pushState) {
			// modify history entries
			window.history.pushState(null, null, window.location.href);
		}
		// add event listener in arrow browser button
		window.addEventListener("popstate", this.back);
		// initialize backward with simple function
		this._backward = () => { };
		// initialize page snackbar
		this._snackbar = new mdc.snackbar.MDCSnackbar(document.querySelector(".mdc-snackbar"));
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
		this.progress.close();
	}

	/**
		* lock page
		*/
	lock() {
		// set busy
		this.busy = true;
		// open progress
		this.progress.open();
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