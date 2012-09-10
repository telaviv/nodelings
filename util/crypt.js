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
 * Provides utitility methods for encryption and decryption
 */

var crypto = require('crypto');

var ObjectID = require('mongodb').ObjectID;

var CRYPT_TYPE = 'aes256';

/**
 * @constructor
 * @params {string} key cipher key
 */
var Crypt = function(key) {
    if (!key) {
	throw Error('We need a key to do cryptography!');
    }

    this.key = key;
};
/**
 * Encrypt a string to a dicipherable value.
 *
 * @param {string} string
 * @return {string}
 */
Crypt.prototype.encrypt = function(string) {
    var cipher = crypto.createCipher(CRYPT_TYPE, this.key);

    var ciph = cipher.update(string, 'utf8', 'hex');
    return ciph + cipher.final('hex');
};

/**
 * Decrypt an encrypted string.
 *
 * @param {string} string
 * @return {string}
 */
Crypt.prototype.decrypt = function(string) {
    var decipher = crypto.createDecipher(CRYPT_TYPE, this.key);
    var original = decipher.update(string, 'hex', 'utf8');
    return original + decipher.final('utf8');
};

/**
 * Encrypt a mongodb ObjectID to a dicipherable value.
 *
 * @param {ObjectID} oid
 * @return {string}
 */
Crypt.prototype.encryptObjectID = function(oid) {
    return this.encrypt(oid.id.toString());
};

/**
 * Decrypt a string to mongodb ObjectID.
 *
 * @param {string} string
 * @return {ObjectID}
 */
Crypt.prototype.decryptObjectID = function(string) {
    var id = this.decrypt(string);
    return new ObjectID(id);
};

exports.Crypt = Crypt;