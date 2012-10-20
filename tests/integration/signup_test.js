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

var casper = require('casper').create({
    verbose: true,
    logLevel: 'debug'
});
var system = require('system');
var testing = require('./tests/testing.js').testing;


var verifySelectors = function _verifySelectors() {
    casper.test.assert(casper.exists('input[name="username"]'))
    casper.test.assert(casper.exists('input[name="password"]'))
    casper.test.assert(casper.exists('input[name="verify-password"]'))
}

tests = [
    verifySelectors
];

// set up casper to have additional debugging hooks.
testing.initialize(casper);
var PORT = parseInt(system.env.PORT) || 3001;
casper.start('https://localhost:' + PORT + '/signup').then(function createDomRunner() {
    this.each(tests, function eachTest(self, testCase) {
	    self.then(function runTest() {
	        testCase();
	    });
    });
});

casper.run();