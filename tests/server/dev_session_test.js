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
    beforeEach(function(done) {
	var that = this;
	sandboxDB.create(function(err, db) {
	    if (err) throw err;
	    that.db = db;
	    that.devSignup = new DevSignup(db);
	    that.devSession = new DevSession(db, new Crypt(), 3);
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
	    factories.createUser(that.db, function(encUID) {
		// now lets create the session
		that.devSession.create(encUID, function(sid) {
		    // lets make sure our encSID is a real id in the db.
		    that.db.collection('dev_user', function(err, collection) {
			if (err) throw err;
			var uid = (new Crypt()).decryptObjectID(encUID);
			collection.findOne({_id: uid}, {sessions: 1}, function(err, doc) {
			    var sessions = doc.sessions;
			    expect(sessions.length).to.equal(1);
			    expect(sessions[0]).to.equal(sid);
			    done();
			});
		    });
		});
	    });
	});
    });
});



require('chai').Assertion.includeStack = true;

