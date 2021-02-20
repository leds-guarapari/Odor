import { View } from "./views.view.min.js";

/**
	* 
	* A view class for user page manipulation.
	* 
	*/
export class ListView extends View {

	/**
		* 
		* Extends view class and make listener for all events.
		* 
		*/
	constructor() {
		// run constructor in parent class
		super();
		// initialize app bar
		this._bar = new mdc.topAppBar.MDCTopAppBar(document.querySelector(".mdc-top-app-bar"));
		// initialize arrow button
		this._arrow = new mdc.ripple.MDCRipple(document.querySelector("#arrow"));
		// add event listener in arrow button
		this._arrow.listen("click", this.back);
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

}