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
var DevSession = require('../../logic/dev_session').DevSession;

describe('DevSignup', function() {
    beforeEach(function(done) {
	var that = this;
	sandboxDB.create(function(err, db) {
	    if (err) throw err;
	    that.db = db;
	    that.devSignup = new DevSignup(db);
	    that.devSession = new DevSession(db);
	    done();
	});
    });
    it('exists', function() {
	expect(this.devSession).to.exist;
    });
});



require('chai').Assertion.includeStack = true;

