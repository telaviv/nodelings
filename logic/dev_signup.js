/**
 * Copyright 2012 Shawn Krisman
 *
 *  This file is part of Nodelings.
 *
 *  Nodelings is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  Nodelings is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with Nodelings.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 *  Allows creation of a "developer" user. These are people allowed to
 *  make maps.
 */

var bcrypt = require('bcrypt');

var Crypt = require('../util/crypt').Crypt;

/**
 * @constructor
 * @param {db} db mongodb instance.
 */
var DevSignup = function(db) {
    this.db = db;
}

/**
 * Creates a user in the db.
 *
 * @param {string} username
 * @param {string} password
 * @param {function} cb callback function. Takes 2 args.
 *                   err, and the encUID.
 *
 * @return {string} encrypted user id
 */
DevSignup.prototype.signup = function(username, password, cb) {
    var that = this;
    that.db.collection('dev_user', function(err, collection) {
	if (err) throw err;
	collection.insert(
	    {username: username,
	     password_hash: that._hashPassword(password)},
	    {safe: true},
	    function(err, docs) {
		if (err) throw err;
		var userDoc = docs[0];

		var encID = (new Crypt()).encryptObjectID(userDoc._id);
		cb(null, encID);
	    }
	);
    });
};

/**
 * Creates a cryptographically secure password hash.
 *
 * @param {string} password
 *
 * @return {string} hashed password
 */
DevSignup.prototype._hashPassword = function(password) {
    return bcrypt.hashSync(password, 8);
}


exports.DevSignup = DevSignup;
