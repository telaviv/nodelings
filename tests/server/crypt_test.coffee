###
# Copyright 2012 Shawn Krisman
# This file is part of Nodelings.
# Nodelings is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# Nodelings is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
#
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with Nodelings.  If not, see <http://www.gnu.org/licenses/>.
###

expect = require('chai').expect;
Crypt = require('../../util/crypt').Crypt;
ObjectID = require('mongodb').ObjectID;

require('chai').Assertion.includeStack = true;

describe 'Crypt', ->
    describe '#encrypt()', ->
        it 'should not easily have a collision between keys', ->
            cryptA = new Crypt('jelly');
            cryptB = new Crypt('belly');
            msg = 'cats';

            expect(cryptA.encrypt(msg)).to.not.equal(cryptB.encrypt(msg));
    describe '#decrypt()', ->
    	it 'should decrypt an encrypted string.', ->
    	    string = 'faces, faces everywhere!'
    	    crypt = new Crypt('cake');
    	    ciph = crypt.encrypt(string);

    	    expect(crypt.decrypt(ciph)).to.equal(string);
    describe '#encryptObjectID', ->
    	it 'should turn an ObjectID into a string.', ->
    	    oid = new ObjectID(747);
    	    crypt = new Crypt('tales');

    	    ciph = crypt.encryptObjectID(oid);
    	    expect(ciph).to.be.a('string');
    describe '#decryptObjectID', ->
    	it 'should decrypt to the same value as from encryptObjectID', ->
    	    oid = new ObjectID(3238493);
    	    crypt = new Crypt('spin');

    	    ciph = crypt.encryptObjectID(oid);
    	    deciph = crypt.decryptObjectID(ciph);

    	    expect(deciph.id).to.equal(oid.id);



