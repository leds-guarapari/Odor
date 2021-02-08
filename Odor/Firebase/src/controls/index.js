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
		// initialize view listener
		this._view = new IndexView();
		// initialize firebase service
		this._firebase = new FirebaseService(odor.configuration.firebase);
	}

	/**
	 * @returns {Object} view
	 */
	get view() {
		return this._view;
	}

	/**
	 * @returns {Object} firebase
	 */
	get firebase() {
		return this._firebase;
	}

}

// make a control listener
export const control = new IndexControl();