var assert = require('chai').assert;
var devSignup = require('../../logic/dev_signup');
var db = require('../sandbox_db');
require('chai').Assertion.includeStack = true;

describe('DevSignup', function(){
    it('should exist.', function(){
	var ds = devSignup.create(db);
	assert.isDefined(ds);
    })
})