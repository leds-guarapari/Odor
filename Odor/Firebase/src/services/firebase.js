/**
 * 
 * The final class represents database methods in Firebase for persisting data.
 * 
 */
export class FirebaseService {

    /**
     * @param {Object} configuration
     */
    constructor(configuration) {
        // run constructor in parent class
        super();
        // return initializing Firebase
        return firebase.initializeApp(configuration);
    }

}