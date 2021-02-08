import { odor } from "./services.config.min.js";
import { FirebaseService } from "./services.firebase.min.js";
import { IndexView } from "./views.index.min.js";

/**
 * 
 * A final control class for acts on both model and view.
 * 
 */
export class IndexControl {

	/**
	 * 
	 * Extends control class and make listener for all events
	 * 
	 */
	constructor() {
		// initialize firebase service
		this._firebase = new FirebaseService(odor.configuration.firebase);
		// initialize view listener
		this._view = new IndexView();
	}

	/**
	 * @returns {Object} firebase
	 */
	get firebase() {
		return this._firebase;
	}

	/**
	 * @returns {Object} view
	 */
	get view() {
		return this._view;
	}

}

// make a control listener
export const control = new IndexControl();