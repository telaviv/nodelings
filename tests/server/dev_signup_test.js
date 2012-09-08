var assert = require('chai').assert;
var db = require('../sandbox_db').db;
var DevSignup = require('../../logic/dev_signup').DevSignup;
var ObjectID = require('mongodb').ObjectID;
require('chai').Assertion.includeStack = true;


var assertUserExists = function(db, uid, fn) {
    db.collection('dev_user', function(err, collection) {
	if (err) throw err;
	collection.findOne({_id: uid}, {_id: 1}, function (err, item) {
	    if (err) throw err;
	    assert.strictEqual(item._id.id, uid.id);
	    fn();
	})
    });
};

describe('DevSignup', function() {
    it('should exist.', function() {
	var ds = new DevSignup(db);
	assert.isDefined(ds);
    });
    describe('#signup()', function() {
	it('should create a user.', function(done) {
	    var ds = new DevSignup(db);
	    ds.signup('cheese', 'secret', function(uid) {
		assertUserExists(db, uid, done);
	    });
	});
    });
});