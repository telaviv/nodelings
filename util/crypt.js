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

var secrets = require('../secrets').secrets;
var crypto = require('crypto');

/**
 * @constructor
 * @params {string} key cipher key
 */
var Crypt = function(key) {
    if (!key && !secrets.cipher_key) {
	throw Error('We need a key to do cryptography!');
    }

    this.key = key || secrets.cipher_key;
};
/**
 * Encrypt a string to a dicipherable value.
 *
 * @param {string} string
 * @return {string}
 */
Crypt.prototype.encrypt = function(string) {
    var cipher = crypto.createCipher('aes256', this.key);

    var ciph = cipher.update(string, 'utf8', 'hex');
    return ciph + cipher.final('hex');
};

Crypt.prototype.decrypt = function() {
    throw Error('Not implemented');
};

exports.Crypt = Crypt;