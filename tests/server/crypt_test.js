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

var expect = require('chai').expect;
var Crypt = require('../../util/crypt').Crypt;
var ObjectID = require('mongodb').ObjectID;

require('chai').Assertion.includeStack = true;

describe('Crypt', function() {
    describe('#encrypt()', function() {
	it('should not easily have a collision between keys', function() {
	    var cryptA = new Crypt('jelly');
	    var cryptB = new Crypt('belly');
	    var msg = 'cats';

	    expect(cryptA.encrypt(msg)).to.not.equal(cryptB.encrypt(msg));
	});
    });
    describe('#decrypt()', function() {
	it('should decrypt an encrypted string.', function() {
	    var string = 'faces, faces everywhere!'
	    var crypt = new Crypt('cake');
	    var ciph = crypt.encrypt(string);

	    expect(crypt.decrypt(ciph)).to.equal(string);
	});
    });
    describe('#encryptObjectID', function() {
	it('should turn an ObjectID into a string.', function() {
	    var oid = new ObjectID(747);
	    var crypt = new Crypt('tales');

	    var ciph = crypt.encryptObjectID(oid);
	    expect(ciph).to.be.a('string');
	});
    });
    describe('#decryptObjectID', function() {
	it('should decrypt to the same value as from encryptObjectID', function() {
	    var oid = new ObjectID(3238493);
	    var crypt = new Crypt('spin');

	    var ciph = crypt.encryptObjectID(oid);
	    var deciph = crypt.decryptObjectID(ciph);

	    expect(deciph.id).to.equal(oid.id);
	});
    });
});



