/**
 * 
 * Default data manipulation in session store.
 * 
 */
export class MapsSession {

 /**
  * @returns {string} user
  */
 get user() {
  return window.sessionStorage.getItem("user");
 }

 /**
  * @returns {string} odor
  */
 get odor() {
  return window.sessionStorage.getItem("odor");
 }

 /**
  * @param {string} address
  */
 set address(address) {
  window.sessionStorage.setItem("address", address);
 }

 /**
  * @returns {string} address
  */
 get address() {
  return window.sessionStorage.getItem("address");
 }

 /**
  * @param {number} latitude
  */
 set latitude(latitude) {
  window.sessionStorage.setItem("latitude", latitude.toString(10));
 }

 /**
  * @returns {number} latitude
  */
 get latitude() {
  return Number(window.sessionStorage.getItem("latitude") || "0");
 }

 /**
  * @param {number} longitude
  */
 set longitude(longitude) {
  window.sessionStorage.setItem("longitude", longitude.toString(10));
 }

 /**
  * @returns {number} longitude
  */
 get longitude() {
  return Number(window.sessionStorage.getItem("longitude") || "0");
 }

 /**
  * remove all saved data from session
  */
 clear() {
  window.sessionStorage.clear();
 }

}