import { Odor } from "./models.odor.min.js";
import { View } from "./views.view.min.js";

/**
	* 
	* A view class for odor page manipulation.
	* 
	*/
export class OdorView extends View {

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
		// initialize glide
		this._glide = new Glide(".glide").mount();
		// disable keyboard in glide
		this._glide.keyboard = false;
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
		// initialize types list
		this._types = new mdc.list.MDCList(document.querySelector("#types"));
		// instantiate ripples on list items
		this._types.listElements.map((item) => new mdc.ripple.MDCRipple(item));
		// initialize user type
		this._usertype = new mdc.textField.MDCTextField(document.querySelector("#usertype"));
		// disable user type
		this._usertype.disabled = true;
		// initialize intensities list
		this._intensities = new mdc.list.MDCList(document.querySelector("#intensities"));
		// instantiate ripples on list items
		this._intensities.listElements.map((item) => new mdc.ripple.MDCRipple(item));
		// initialize nuisances list
		this._nuisances = new mdc.list.MDCList(document.querySelector("#nuisances"));
		// instantiate ripples on list items
		this._nuisances.listElements.map((item) => new mdc.ripple.MDCRipple(item));
		// initialize odor address
		this._address = new mdc.textField.MDCTextField(document.querySelector("#address"));
		// initialize maps button
		this._maps = new mdc.ripple.MDCRipple(document.querySelector("#maps"));
		// add event listener in maps button
		this._maps.listen("click", this.go);
		// initialize date
		this._date = new mdc.textField.MDCTextField(document.querySelector("#date"));
		// initialize begin
		this._begin = new mdc.textField.MDCTextField(document.querySelector("#begin"));
		// initialize end
		this._end = new mdc.textField.MDCTextField(document.querySelector("#end"));
		// initialize origins list
		this._origins = new mdc.list.MDCList(document.querySelector("#origins"));
		// instantiate ripples on list items
		this._origins.listElements.map((item) => new mdc.ripple.MDCRipple(item));
		// initialize user origin
		this._userorigin = new mdc.textField.MDCTextField(document.querySelector("#userorigin"));
		// disable user origin
		this._userorigin.disabled = true;
		// initialize browse with simple function
		this._browse = () => { };
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
		* @returns {Object} maps
		*/
	get maps() {
		return this._maps;
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
							await this.dispatch(this.odor).then(() => {
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
		* @returns {Event} go
		*/
	get go() {
		// make event
		return (event) => {
			// event prevent default
			event.preventDefault();
			// lock page
			this.lock();
			// dispatch event to listener
			this.browse();
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
		* @returns {function} browse
		*/
	get browse() {
		return this._browse;
	}

	/**
		* @param {function} browse
		*/
	set browse(browse) {
		this._browse = browse;
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
		* @param {string} address
		*/
	set address(address) {
		this.address.value = address;
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
	* @param {Odor} odor
	*/
	set odor(odor) {
		// set odor data in page
		this.id = odor.id;
		this.name.value = odor.name;
		this.number.value = odor.number;
		this.address.value = odor.address;
		this.latitude = odor.latitude;
		this.longitude = odor.longitude;
	}

	/**
		* @returns {Odor} odor
		*/
	get odor() {
		// make odor data
		let odor = new Odor();
		odor.id = this.id;
		odor.name = this.name.value;
		odor.number = this.number.value;
		odor.address = this.address.value;
		odor.latitude = this.latitude;
		odor.longitude = this.longitude;
		return odor;
	}

	/**
		* return to maps in page
		*/
	return() {
		// move to third slide
		this.glide.go("=2");
	}

}