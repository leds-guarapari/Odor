/**
 * 
 * A view class for page manipulation.
 * 
 */
export class IndexView {

    /**
     * 
     * Extends view class and make listener for all events.
     * 
     */
    constructor() {
        // initialize page progress
        this._progress = new mdc.linearProgress.MDCLinearProgress(document.querySelector(".mdc-linear-progress"));
    }

    /**
     * @returns {Object} progress
     */
    get progress() {
        return this._progress;
    }

}