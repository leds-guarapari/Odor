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
		// initialize list
		this._list = new mdc.list.MDCList(document.querySelector(".mdc-list"));
		// add event listener in list
		this._list.listen("MDCList:action", this.click);
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
		* @returns {Object} list
		*/
	get list() {
		return this._list;
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
		* @param {boolean} visible 
		*/
	empty(visible) {
		// get empty in page
		let empty = this.element("empty");
		// set display empty
		empty.style.display = (visible) ? "block" : "none";
	}

}