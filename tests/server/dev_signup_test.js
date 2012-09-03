var assert = require('chai').assert;
var devSignup = require('../../logic/dev_signup');
require('chai').Assertion.includeStack = true;

describe('DevSignup', function(){
    it('should exist.', function(){
	var ds = devSignup.create();
	assert.isDefined(ds);
    })
})