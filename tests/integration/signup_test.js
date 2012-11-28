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

testing.initialize(casper);
PORT = system.env.PORT || 3001;
unique = function() {return Math.floor(Math.random() * 1e16).toString();}

casper.start('https://localhost:' + PORT + '/signup');

casper.then(function() {
    this.test.comment('Form elements exist.');
    this.test.assert(casper.exists('input[name="username"]'))
    this.test.assert(casper.exists('input[name="password"]'))
    this.test.assert(casper.exists('input[name="verify-password"]'))
});

casper.then(function() {
    this.test.comment('Incorrect form submission.');
    this.fill('form[name="signup-form"]', {
        'username': unique(),
        'password': 'password',
        'verify-password': 'fake-password',
    }, false);
});

casper.then(function() {
    this.test.comment('Click the input.');
    this.click('input[name="verify-password"]');
});

casper.then(function() {
    this.test.comment('There should be an inline error msg.');
    var err = this.fetchText('span.verify-password .inline-message');
    this.test.assert(err.length > 0, "expected an inline error msg.");
});

casper.then(function() {
    this.fill('form[name="signup-form"]', {
        'username': unique(),
        'password': 'password',
        'verify-password': 'password',
    }, false);
});

casper.then(function() {
    casper.evaluate(function() {
        $('form[name="signup-form"]').submit();
    });
});

casper.wait(3000, function() {
    this.echo('url: ' + this.getCurrentUrl());
});


casper.run();