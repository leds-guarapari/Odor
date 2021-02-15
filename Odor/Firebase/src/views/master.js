/**
	* 
	* A view class for user page manipulation.
	* 
	*/
export class MasterView {

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
		// initialize page drawer
		this._drawer = new mdc.drawer.MDCDrawer.attachTo(document.querySelector(".mdc-drawer"));
		// initialize app bar
		this._bar = new mdc.topAppBar.MDCTopAppBar(document.querySelector(".mdc-top-app-bar"));
		// set scroll page
		this._bar.setScrollTarget(document.querySelector("main"));
		// add event listener in menu
		this._bar.listen("MDCTopAppBar:nav", () => {
			// open or close drawer
			this._drawer.open = !this._drawer.open;
		});
		// initialize page button
		this._button = new mdc.ripple.MDCRipple(document.querySelector("#button"));
		// initialize page snackbar
		this._snackbar = new mdc.snackbar.MDCSnackbar(document.querySelector(".mdc-snackbar"));
	}

	/**
		* @returns {Object} drawer
		*/
	get drawer() {
		return this._drawer;
	}

	/**
		* @returns {Object} bar
		*/
	get bar() {
		return this._bar;
	}

	/**
		* @returns {Object} button
		*/
	get button() {
		return this._button;
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
		* @param {string} organization
		*/
	set organization(organization) {
		// set organization text in page
		this.element("organization").textContent = organization;
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