/**
	* 
	* A view class for activation page manipulation.
	* 
	*/
export class ActivationView {

	/**
		* 
		* Extends view class and make listener for all events.
		* 
		*/
	constructor() {
		// initialize page code
		this._code = new mdc.textField.MDCTextField(document.querySelector("#code"));
		// initialize page progress
		this._progress = new mdc.linearProgress.MDCLinearProgress(document.querySelector(".mdc-linear-progress"));
	}

	/**
	* @returns {Object} code
	*/
	get code() {
		return this._code;
	}

	/**
		* @returns {Object} progress
		*/
	get progress() {
		return this._progress;
	}

}