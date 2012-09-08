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
var db = require('../sandbox_db').db;
var DevSignup = require('../../logic/dev_signup').DevSignup;
var ObjectID = require('mongodb').ObjectID;
require('chai').Assertion.includeStack = true;

describe('DevSignup', function() {
    beforeEach(function() {
	this.ds = new DevSignup(db);
    });

    var getUser = function(uid, db, fn) {
	db.collection('dev_user', function(err, collection) {
	    if (err) throw err;
	    collection.findOne({_id: uid}, function (err, item) {
		if (err) throw err;
		fn(item);
	    })
	});
    };

    it('should exist.', function() {
	expect(this.ds).to.exist
    });
    describe('#signup()', function() {
	it('should create a user.', function(done) {
	    this.ds.signup('cheese', 'secret', function(uid) {
		getUser(uid, db, function(userDoc) {
		    expect(uid.id).to.equal(userDoc._id.id);
		    done();
		});
	    });
	});
	it('should not store the password in plaintext.', function(done) {
	    /**
	     * Recursively searches a document to find out if any of the
	     * properties equal a primitive. If any do, an exception is thrown.
	     */
	    var deepMatch = function(doc, match, fn) {
		for (var prop in doc) {
		    if (doc.hasOwnProperty(prop)) {
			var value = doc[prop];
			if (typeof value  === 'object') {
			    deepMatch(value, match, function() {});
			} else {
			    expect(value).to.not.equal(match);
			}
		    }
		}
		fn();
	    }
	    var password = 'secret'
	    this.ds.signup('cheese', password, function(uid) {
		getUser(uid, db, function(userDoc) {
		    deepMatch(userDoc, password, done);
		});
	    });
	});
    });
});