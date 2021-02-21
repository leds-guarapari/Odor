/**
 * 
 * A class represents database methods in Firebase for persisting data.
 * 
 */
export class FirebaseService {

 /**
  * @param {Object} configuration
  */
 constructor(configuration) {
  // return initializing Firebase
  return firebase.initializeApp(configuration);
 }

}