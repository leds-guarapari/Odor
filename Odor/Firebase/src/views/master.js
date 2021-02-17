import { View } from "./views.view.min.js";

/**
	* 
	* A view class for user page manipulation.
	* 
	*/
export class MasterView extends View {

	/**
		* 
		* Extends view class and make listener for all events.
		* 
		*/
	constructor() {
		// run constructor in parent class
		super();
		// initialize page drawer
		this._drawer = new mdc.drawer.MDCDrawer.attachTo(document.querySelector(".mdc-drawer"));
		// initialize app bar
		this._bar = new mdc.topAppBar.MDCTopAppBar(document.querySelector(".mdc-top-app-bar"));
		// set scroll page
		this._bar.setScrollTarget(document.querySelector("main"));
		// add event listener in menu
		this._bar.listen("MDCTopAppBar:nav", this.menu);
		// initialize page button
		this._button = new mdc.ripple.MDCRipple(document.querySelector("#button"));
	}

	/**
		* @returns {Event} menu
		*/
	get menu() {
		// make event
		return (event) => {
			// event prevent default
			event.preventDefault();
			// open or close drawer
			this.drawer.open = !this.drawer.open;
		};
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
		* @param {string} organization
		*/
	set organization(organization) {
		// set organization text in page
		this.element("organization").textContent = organization;
	}

}