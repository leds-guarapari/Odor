/**
	* 
	* Default user class data.
	* 
	*/
export class User {

	/**
		* @param {string} id
		*/
	set id(id) {
		this._id = id;
	}

	/**
		* @returns {string} id
		*/
	get id() {
		return this._id;
	}

	/**
		* @param {string} name
		*/
	set name(name) {
		this._name = name;
	}

	/**
		* @returns {string} name
		*/
	get name() {
		return this._name;
	}

	/**
		* @param {number} number
		*/
	set number(number) {
		this._number = number;
	}

	/**
		* @returns {number} number
		*/
	get number() {
		return this._number;
	}

	/**
		* @param {string} address
		*/
	set address(address) {
		this._address = address;
	}

	/**
		* @returns {string} address
		*/
	get address() {
		return this._address;
	}

	/**
		* @param {number} latitude
		*/
	set latitude(latitude) {
		this._latitude = latitude;
	}

	/**
		* @returns {number} latitude
		*/
	get latitude() {
		return this._latitude;
	}

	/**
		* @param {number} longitude
		*/
	set longitude(longitude) {
		this._longitude = longitude;
	}

	/**
		* @returns {number} longitude
		*/
	get longitude() {
		return this._longitude;
	}

}