var assert = require('chai').assert;
var db = require('../sandbox_db');
var DevSignup = require('../../logic/dev_signup').DevSignup;
var ObjectID = require('mongodb').ObjectID;
require('chai').Assertion.includeStack = true;

describe('DevSignup', function() {
    it('should exist.', function() {
	var ds = new DevSignup(db);
	assert.isDefined(ds);
    });
    describe('#signup()', function() {
	it('should create a user.', function(done) {
	    var ds = new DevSignup(db);
	    ds.signup(function(err, uid) {
		if (err) throw err;
		db.collection('dev_user', function(err, collection) {
		    if (err) throw err;
		    collection.findOne({_id: new ObjectID(uid)}, {_id: 1})
			.cursor.nextObject(function(err, doc) {
			    assert.isEqual(doc._id, new ObjectID(uid));
			    done();
			});
		});
	    });
	});
    });
});