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
});



