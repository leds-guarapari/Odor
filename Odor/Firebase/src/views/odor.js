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
		this._indexes = Object.freeze({ "type": 0, "intensity": 1, "nuisance": 2, "address": 3, "date": 4, "origin": 5 });
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
		// add event listener in types
		this._types.listen("MDCList:action", (event) => {
			// event prevent default
			event.preventDefault();
			// turn usertype when selected last option
			this.turn(event.detail.index === (this._types.listElements.length - 1), this.usertype, true);
		});
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
		// add event listener in origins
		this._origins.listen("MDCList:action", (event) => {
			// event prevent default
			event.preventDefault();
			// turn usertype when selected last option
			this.turn(event.detail.index === (this._origins.listElements.length - 1), this.userorigin, true);
		});
		// initialize user origin
		this._userorigin = new mdc.textField.MDCTextField(document.querySelector("#userorigin"));
		// disable user origin
		this._userorigin.disabled = true;
		// initialize browse with simple function
		this._browse = () => { };
		// initialize fab button
		this._fab = new mdc.ripple.MDCRipple(document.querySelector(".mdc-fab"));
		// add event listener in fab button
		this._fab.listen("click", this.open);
		// initialize dialog
		this._dialog = new mdc.dialog.MDCDialog(document.querySelector(".mdc-dialog"));
		// add event listener in dialog
		this._dialog.listen("MDCDialog:closed", this.close);
		// initialize remove with simple function
		this._remove = () => { };
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
		* @returns {Object} fab
		*/
	get fab() {
		return this._fab;
	}

	/**
		* @returns {Object} dialog
		*/
	get dialog() {
		return this._dialog;
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
				if (this.glide.index === this.indexes.origin) {
					// lock page
					this.lock();
					// dispatch event to listener
					await this.dispatch(this.odor).then(() => {
						// dispatch success
						this.success();
						// response handler callback
						setTimeout(this.handler, 2000);
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
				} else {
					// move one forward
					this.glide.go(">");
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
		* @returns {function} remove
		*/
	get remove() {
		return this._remove;
	}

	/**
		* @param {function} remove
		*/
	set remove(remove) {
		this._remove = remove;
	}

	/**
		* @returns {Event} open
		*/
	get open() {
		// make event
		return (event) => {
			// event prevent default
			event.preventDefault();
			// open dialog
			this.dialog.open();
		};
	}

	/**
		* @returns {Event} close
		*/
	get close() {
		// make event
		return (event) => {
			// verify confirm
			if (event.detail.action === "confirm") {
				// lock page
				this.lock();
				// make odor data
				let odor = new Odor();
				odor.id = this.id;
				// dispatch event to listener
				this.remove(odor);
			}
		};
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
		* @param {string} userid
		*/
	set userid(userid) {
		this._userid = userid;
	}

	/**
		* @returns {string} userid
		*/
	get userid() {
		return this._userid;
	}

	/**
		* @param {string} username
		*/
	set username(username) {
		this._username = username;
	}

	/**
		* @returns {string} username
		*/
	get username() {
		return this._username;
	}

	/**
		* @param {string} usertype
		*/
	set usertype(usertype) {
		this.usertype.value = usertype;
	}

	/**
		* @returns {Object} usertype
		*/
	get usertype() {
		return this._usertype;
	}

	/**
		* @param {string} userorigin
		*/
	set userorigin(userorigin) {
		this.userorigin.value = userorigin;
	}

	/**
		* @returns {Object} userorigin
		*/
	get userorigin() {
		return this._userorigin;
	}

	/**
		* @returns {Object} intensities
		*/
	get intensities() {
		return this._intensities;
	}

	/**
		* @param {string} intensity
		*/
	set intensity(intensity) {
		let selectedIndex = this.intensities.selectedIndex;
		this.intensities.listElements.map((item, index) => {
			if (item.innerText === intensity) {
				selectedIndex = index;
			}
		});
		this.intensities.selectedIndex = selectedIndex;
	}

	/**
		* @returns {Object} intensity
		*/
	get intensity() {
		return this.intensities.listElements[this.intensities.selectedIndex].innerText;
	}

	/**
		* @returns {Object} nuisances
		*/
	get nuisances() {
		return this._nuisances;
	}

	/**
		* @param {string} nuisance
		*/
	set nuisance(nuisance) {
		let selectedIndex = this.nuisances.selectedIndex;
		this.nuisances.listElements.map((item, index) => {
			if (item.innerText === nuisance) {
				selectedIndex = index;
			}
		});
		this.nuisances.selectedIndex = selectedIndex;
	}

	/**
		* @returns {string} nuisance
		*/
	get nuisance() {
		return this.nuisances.listElements[this.nuisances.selectedIndex].innerText;
	}

	/**
		* @returns {Object} types
		*/
	get types() {
		return this._types;
	}

	/**
		* @param {string} type
		*/
	set type(type) {
		let selectedIndex = this.types.selectedIndex;
		this.types.listElements.map((item, index) => {
			if (item.innerText === type) {
				selectedIndex = index;
			}
		});
		this.types.selectedIndex = selectedIndex;
		// turn usertype when selected last option
		this.turn(selectedIndex === (this.types.listElements.length - 1), this.usertype, false);
	}

	/**
		* @returns {string} type
		*/
	get type() {
		return this.types.listElements[this.types.selectedIndex].innerText;
	}

	/**
		* @returns {Object} origins
		*/
	get origins() {
		return this._origins;
	}

	/**
		* @param {string} origin
		*/
	set origin(origin) {
		let selectedIndex = this.origins.selectedIndex;
		this.origins.listElements.map((item, index) => {
			if (item.innerText === origin) {
				selectedIndex = index;
			}
		});
		this.origins.selectedIndex = selectedIndex;
		// turn userorigin when selected last option
		this.turn(selectedIndex === (this.origins.listElements.length - 1), this.userorigin, false);
	}

	/**
		* @returns {string} origin
		*/
	get origin() {
		return this.origins.listElements[this.origins.selectedIndex].innerText;
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
		* @param {string} date
		*/
	set date(date) {
		this.date.value = moment(new Date(date)).format("YYYY-MM-DD");
	}

	/**
		* @returns {Object} date
		*/
	get date() {
		return this._date;
	}

	/**
		* @param {string} begin
		*/
	set begin(begin) {
		this.begin.value = moment.duration(begin).format("*HH:mm");
	}

	/**
		* @returns {Object} begin
		*/
	get begin() {
		return this._begin;
	}

	/**
		* @param {string} end
		*/
	set end(end) {
		this.end.value = moment.duration(end).format("*HH:mm");
	}

	/**
		* @returns {Object} end
		*/
	get end() {
		return this._end;
	}

	/**
		* @param {Odor} odor
		*/
	set odor(odor) {
		// set odor data in page
		this.id = odor.id;
		this.userid = odor.userid;
		this.username = odor.username;
		this.usertype = odor.usertype;
		this.userorigin = odor.userorigin;
		this.intensity = odor.intensity;
		this.nuisance = odor.nuisance;
		this.type = odor.type;
		this.origin = odor.origin;
		this.address = odor.address;
		this.latitude = odor.latitude;
		this.longitude = odor.longitude;
		this.date = odor.date;
		this.begin = odor.begin;
		this.end = odor.end;
	}

	/**
		* @returns {Odor} odor
		*/
	get odor() {
		// make odor data
		let odor = new Odor();
		odor.id = this.id;
		odor.userid = this.userid;
		odor.username = this.username;
		odor.usertype = this.usertype.value;
		odor.userorigin = this.userorigin.value;
		odor.intensity = this.intensity;
		odor.nuisance = this.nuisance;
		odor.type = this.type;
		odor.origin = this.origin;
		odor.address = this.address.value;
		odor.latitude = this.latitude;
		odor.longitude = this.longitude;
		odor.date = moment(this.date.value).toDate().toJSON();
		odor.begin = moment.duration(this.begin.value, "*HH:mm").format("*HH:mm:ss");
		odor.end = moment.duration(this.end.value, "*HH:mm").format("*HH:mm:ss");
		return odor;
	}

	/**
		* @param {boolean} condition
		* @param {Object} component 
		*/
	turn(condition, component, focus) {
		// verify condition
		if (condition) {
			// disable component
			component.disabled = false;
			// verify focus
			if (focus) {
				// focuses component
				component.focus();
			}
		} else {
			// set component with empty
			component.value = "";
			// disable component
			component.disabled = true;
		}
	}

	/**
		* return to maps in page
		*/
	return() {
		// move to third slide
		this.glide.go("=3");
	}

}