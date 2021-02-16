/**
	* 
	* A view class for index page manipulation.
	* 
	*/
export class IndexView {

	/**
		* 
		* Extends view class and make listener for all events.
		* 
		*/
	constructor() {
		// verify compatibility push state
		if (window.history.pushState) {
			// modify history entries
			window.history.pushState(null, null, window.location.href);
		}
		// initialize page progress
		this._progress = new mdc.linearProgress.MDCLinearProgress(document.querySelector(".mdc-linear-progress"));
		// add event listener in arrow browser button
		window.addEventListener("popstate", (event) => { event.preventDefault(); });
		// initialize page snackbar
		this._snackbar = new mdc.snackbar.MDCSnackbar(document.querySelector(".mdc-snackbar"));
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
		// close progress
		this.progress.close();
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