import { View } from "./views.view.min.js";

/**
	* 
	* A view class for user page manipulation.
	* 
	*/
export class FilterView extends View {

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
		// initialize page button
		this._button = new mdc.ripple.MDCRipple(document.querySelector("#button"));
		// add event listener in button
		this._button.listen("click", this.go);
		// initialize write with simple promise
		this._write = () => { return Promise.resolve(); };
		// initialize begin
		this._begin = new mdc.textField.MDCTextField(document.querySelector("#begin"));
		// set begin with yesterday
		this.begin = moment().add(-1, "days");
		// add event listener in begin
		this._begin.listen("change", (event) => {
			// event prevent default
			event.preventDefault();
			// verify end
			if (this.begin.valid && this.end.valid) {
				// lock page
				this.lock();
				// dispatch filter service to listener
				this.filter();
			} else if (this.begin.valid) {
				// empty list
				this.empty();
				// focuses end
				this.end.focus();
			} else {
				// empty list
				this.empty();
			}
		});
		// initialize end
		this._end = new mdc.textField.MDCTextField(document.querySelector("#end"));
		// set end with tomorrow
		this.end = moment().add(1, "days");
		// add event listener in begin
		this._end.listen("change", (event) => {
			// event prevent default
			event.preventDefault();
			// verify end
			if (this.begin.valid && this.end.valid) {
				// lock page
				this.lock();
				// dispatch filter service to listener
				this.filter();
			} else if (this.end.valid) {
				// empty list
				this.empty();
				// focuses end
				this.begin.focus();
			} else {
				// empty list
				this.empty();
			}
		});
		// initialize filter with simple function
		this._filter = () => { };
		// initialize list
		this._list = new mdc.list.MDCList(document.querySelector(".mdc-list"));
		// add event listener in list
		this._list.listen("MDCList:action", this.click);
		// initialize dialog
		this._dialog = new mdc.dialog.MDCDialog(document.querySelector(".mdc-dialog"));
		// initialize dispatch with simple promise
		this._dispatch = () => { return Promise.resolve(); };
		// initialize handler with simple function
		this._handler = () => { };
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
		* @returns {Object} button
		*/
	get button() {
		return this._button;
	}

	/**
		* @returns {Object} list
		*/
	get list() {
		return this._list;
	}

	/**
		* @returns {Object} dialog
		*/
	get dialog() {
		return this._dialog;
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
			this.write().then((blob) => {
				// save file
				this.save(blob, "odor.xlsx");
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
		};
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
				// lock page
				this.lock();
				// make identifier in selected list
				let id = this.list.listElements[event.detail.index].getAttribute("id");
				// dispatch event to listener
				await this.dispatch(id).then(() => {
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
		}
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
		* @returns {function} filter
		*/
	get filter() {
		return this._filter;
	}

	/**
		* @param {function} filter
		*/
	set filter(filter) {
		this._filter = filter;
	}

	/**
		* @returns {function} write
		*/
	get write() {
		return this._write;
	}

	/**
		* @param {function} write
		*/
	set write(write) {
		this._write = write;
	}

	/**
		* @param {Object} item
		* @param {Object} odor
		*/
	update(item, odor) {
		// make type item
		let type = item.querySelector(".type");
		// set type with odor
		type.innerText = odor.type;
		// make intensity item
		let intensity = item.querySelector(".intensity");
		// set intensity with odor
		intensity.innerText = odor.intensity;
		// make date item
		let date = item.querySelector(".date");
		// set date with odor
		date.innerText = moment(new Date(odor.date)).format("DD/MM/YYYY");
		// make begin item
		let begin = item.querySelector(".begin");
		// set begin with odor
		begin.innerText = moment.duration(odor.begin).format("*HH:mm");
		// make address item
		let address = item.querySelector(".mdc-list-item__secondary-text");
		// set address with odor
		address.innerText = odor.address;
	}

	/**
		* @param {Object} odor 
		*/
	item(odor) {
		// make item page
		let item = document.createElement("li");
		// set class item
		item.classList.add("mdc-list-item");
		// set identifier item
		item.setAttribute("id", odor.id);
		// make template in page
		let template = document.querySelector("template").content.cloneNode(true);
		// update item in page
		this.update(template, odor);
		// append template in item page
		item.appendChild(template);
		// return item
		return item;
	}

	/**
		* @returns {function} added
		*/
	get added() {
		return (odor) => {
			// make item to list
			let item = this.item(odor);
			// append item in list
			this.list.root.appendChild(item);
			// initialize item
			new mdc.ripple.MDCRipple(item);
		};
	}

	/**
		* @returns {function} changed
		*/
	get changed() {
		return (odor) => {
			// get item in page
			let item = this.element(odor.id);
			// update item in page
			this.update(item, odor);
		};
	}

	/**
		* @returns {function} removed
		*/
	get removed() {
		return (id) => {
			// get item in page
			let item = this.element(id);
			// remove item in list
			this.list.root.removeChild(item);
		};
	}

	/**
		* @param {string} begin
		*/
	set begin(begin) {
		this.begin.value = moment(new Date(begin)).format("YYYY-MM-DD");
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
		this.end.value = moment(new Date(end)).format("YYYY-MM-DD");
	}

	/**
		* @returns {Object} end
		*/
	get end() {
		return this._end;
	}

	save(blob, name) {
		// make save link
		let save = this.element("save");
		// make url
		let url = window.URL.createObjectURL(blob);
		// set link with url
		save.href = url;
		// set download with file name
		save.download = name;
		// dispatch click link
		save.click();
		// revoke window with url object
		window.URL.revokeObjectURL(url);
	}

	empty() {
		// for all child in list
		while (this.list.root.hasChildNodes()) {
			// remove last child
			this.list.root.removeChild(this.list.root.lastChild);
		}
	}

	/**
		* @param {Odor} odor
		*/
	set odor(odor) {
		// set odor data in page
		this.element("dialog-username").innerText = odor.username;
		this.element("dialog-intensity").innerText = odor.intensity;
		this.element("dialog-nuisance").innerText = odor.nuisance;
		this.element("dialog-type").innerText = odor.type;
		this.element("dialog-origin").innerText = odor.origin;
		this.element("dialog-address").innerText = odor.address;
		this.element("dialog-latitude").innerText = odor.latitude.toFixed(5);
		this.element("dialog-longitude").innerText = odor.longitude.toFixed(5);
		this.element("dialog-date").innerText = moment(new Date(odor.date)).format("DD/MM/YYYY");
		this.element("dialog-begin").innerText = moment.duration(odor.begin).format("*HH:mm");
		this.element("dialog-end").innerText = moment.duration(odor.end).format("*HH:mm");
	}

}