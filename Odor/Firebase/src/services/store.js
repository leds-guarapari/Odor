/**
 * 
 * Default data store interface methods.
 * 
 */
export class DataStore {

 /**
  * @returns {Promise} The event represents a promise of adding some object.
  */
 get add() {
  return this._add;
 }

 /**
  * @param {Promise} add
  */
 set add(add) {
  this._add = add;
 }

 /**
  * @returns {Promise} The event represents a promise of updating some object.
  */
 get update() {
  return this._update;
 }

 /**
  * @param {Promise} update
  */
 set update(update) {
  this._update = update;
 }


 /**
  * @returns {Promise} The event represents a promise of removing some object.
  */
 get remove() {
  return this._remove;
 }

 /**
  * @param {Promise} remove
  */
 set remove(remove) {
  this._remove = remove;
 }

 /**
  * @returns {Promise} The event represents a promise of querying objects.
  */
 get query() {
  return this._query;
 }

 /**
  * @param {Promise} query
  */
 set query(query) {
  this._query = query;
 }

}