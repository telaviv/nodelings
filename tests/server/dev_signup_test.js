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
var sandboxDB = require('../sandbox_db');

var Crypt = require('../../util/crypt').Crypt;
var DevSignup = require('../../logic/dev_signup').DevSignup;

require('chai').Assertion.includeStack = true;

describe('DevSignup', function() {
    var crypt = new Crypt('testing');
    beforeEach(function(done) {
	var that = this;
	sandboxDB.create(function(err, db) {
	    if (err) throw err;
	    that.db = db;
	    that.ds = new DevSignup(db, crypt);
	    done();
	});
    });

    var getUser = function(encUID, db, fn) {
	var that = this;
	db.collection('dev_user', function(err, collection) {
	    if (err) throw err;
	    var uid = crypt.decryptObjectID(encUID);
	    collection.findOne({_id: uid}, function (err, item) {
		if (err) throw err;
		fn(item);
	    })
	});
    };

    // generates a unique string
    var unique = function() {
	return (new Date()).getTime().toString();
    }

    it('exists', function() {
	expect(this.ds).to.exist;
    });
    describe('#signup()', function() {
	it('creates a user', function(done) {
	    var that = this;
	    that.ds.signup(unique(), 'secret', function(err, encUID) {
		if (err) throw error;
		getUser(encUID, that.db, function(userDoc) {
		    var foundUID = crypt.encryptObjectID(userDoc._id);
		    expect(encUID).to.equal(foundUID);
		    done();
		});
	    });
	});
	it('does not store the password in plaintext', function(done) {
	    var that = this;
	    /**
	     * Recursively searches a document to find out if any of the
	     * properties equal a primitive. If any do, an exception is thrown.
	     */
	    var deepMatch = function(doc, match, fn) {
		var vacuous = function() {};
		for (var prop in doc) {
		    if (doc.hasOwnProperty(prop)) {
			var value = doc[prop];
			if (typeof value  === 'object') {
 			    deepMatch(value, match, vacuous);
			} else {
			    expect(value).to.not.equal(match);
			}
		    }
		}
		fn();
	    }
	    var password = 'secret';
	    that.ds.signup(unique(), password, function(err, encUID) {
		getUser(encUID, that.db, function(userDoc) {
		    deepMatch(userDoc, password, done);
		});
	    });
	});
	it('prevents username collisions', function(done) {
	    var that = this;
	    var username = unique();
	    that.ds.signup(username, 'tea', function(err) {
		if (err) throw err;
		that.ds.signup(username, 'biscuits', function(err) {
		    expect(err).to.exist;
		    expect(err).to.be.an.instanceof(DevSignup.UserExistsError);
		    that.db.collection('dev_user', function(err, collection) {
			if (err) throw err;
			collection.find({username: username}).toArray(function(err, items) {
			    if (err) throw err;
			    expect(items.length).to.equal(1);
			    done();
			});
		    });
		});
	    });
	});
    });
});