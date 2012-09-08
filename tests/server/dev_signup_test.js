var expect = require('chai').expect;
var db = require('../sandbox_db').db;
var DevSignup = require('../../logic/dev_signup').DevSignup;
var ObjectID = require('mongodb').ObjectID;
require('chai').Assertion.includeStack = true;

var getUser = function(uid, db, fn) {
    db.collection('dev_user', function(err, collection) {
	if (err) throw err;
	collection.findOne({_id: uid}, function (err, item) {
	    if (err) throw err;
	    fn(item);
	})
    });
};

describe('DevSignup', function() {
    beforeEach(function() {
	this.ds = new DevSignup(db);
    });
    it('should exist.', function() {
	expect(this.ds).to.exist
    });
    describe('#signup()', function() {
	it('should create a user.', function(done) {
	    this.ds.signup('cheese', 'secret', function(uid) {
		getUser(uid, db, function(userDoc) {
		    expect(uid.id).to.equal(userDoc._id.id);
		    done();
		});
	    });
	});
	it('should not store the password in plaintext.', function(done) {
	    var password = 'secret'
	    this.ds.signup('cheese', password, function(uid) {
		getUser(uid, db, function(userDoc) {
		    for(var property in userDoc) {
			if (userDoc.hasOwnProperty(property)) {
			    expect(userDoc[property]).to.not.equal(password)
			}
		    }
		    done();
		});
	    });
	});
    });
});