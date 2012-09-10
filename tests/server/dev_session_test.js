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
var factories = require('../testing/factories');
var sandboxDB = require('../sandbox_db');

var Crypt = require('../../util/crypt').Crypt;
var DevSignup = require('../../logic/dev_signup').DevSignup;
var DevSession = require('../../logic/dev_session').DevSession;

describe('DevSignup', function() {
    var crypt = new Crypt('hey guyz!');
    beforeEach(function(done) {
	var that = this;
	sandboxDB.create(function(err, db) {
	    if (err) throw err;
	    that.db = db;
	    that.devSession = new DevSession(db, crypt, 2);
	    done();
	});
    });

    it('exists', function() {
	expect(this.devSession).to.exist;
    });

    describe('#create()', function() {
	it('creates a session in the db', function(done) {
	    var that = this;
	    // first lets create the user.
	    factories.createDevUser(that.db, crypt, function(encUID) {
		// now lets create the session
		that.devSession.create(encUID, function(sid) {
		    // lets make sure our encSID is a real id in the db.
		    factories.getDevUser(encUID, that.db, crypt, function(doc) {
			    var sessions = doc.sessions;
			    expect(sessions.length).to.equal(1);
			    expect(sessions[0]).to.equal(sid);
			    done();
		    });
		});
	    });
	});
    });

    describe('#createSessionToken()', function() {
	it('creates a string from a session id and encUID', function(done) {
	    var that = this;

	    factories.createDevUser(that.db, crypt, function(encUID) {
		that.devSession.create(encUID, function(sid) {
		    that.devSession.createSessionToken(encUID, sid, function(token) {
			expect(token).to.be.a('string');
			done();
		    });
		});
	    });
	});
    });

    describe('#validateSessionToken()', function() {
	it('passes with a token from create session token', function(done) {
	    var that = this;

	    factories.createDevUser(that.db, crypt, function(encUID) {
		that.devSession.create(encUID, function(sid) {
		    that.devSession.createSessionToken(encUID, sid, function(token) {
			that.devSession.validateSessionToken(encUID, token, function(isValid) {
			    expect(isValid).to.equal(true);
			    done();
			});
		    });
		});
	    });
	});
    });
});



require('chai').Assertion.includeStack = true;

