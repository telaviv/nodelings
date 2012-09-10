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
 * Contains utility methods for creation and retrieval of db objects.
 */

var DevSignup = require('../../logic/dev_signup').DevSignup;

// generates a unique string
var unique = function() {
    return (new Date()).getTime().toString();
}

/**
 * Creates a user.
 *
 * @param {db} db mongodb instance.
 * @param {Crypt} crypt
 * @param {cb} callback that takes one arg:
 *             {encUID} encrypted userID
 */
var createDevUser = function(db, crypt, cb) {
    var that = this;

    var devSignup = new DevSignup(db, crypt);
    devSignup.signup(unique(), 'password', function(err, encUID) {
	if (err) throw err;
	cb(encUID);
    });
} ;

/**
 * Get the entire raw user row.
 *
 * @param {encUID} encrypted user id.
 * @param {db} db mongodb instance.
 * @param {Crypt} crypt
 * @param {cb} callback that takes one arg:
 *             {doc} the devUser document.
 */
var getDevUser = function(encUID, db, crypt, cb) {
    db.collection('dev_user', function(err, collection) {
	if (err) throw err;

	var uid = crypt.decryptObjectID(encUID);
	collection.findOne({_id: uid}, function(err, doc) {
	    if (err) throw err;
	    cb(doc);
	});
    });
};

exports.createDevUser = createDevUser;
exports.getDevUser = getDevUser;

