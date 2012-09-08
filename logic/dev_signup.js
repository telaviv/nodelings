/**
 *  Allows creation of a "developer" user. These are people allowed to
 *  make maps.
 */
var DevSignup = function(db) {
    this.db = db;
}

DevSignup.prototype.signup = function(username, password, fn) {
    this.db.collection('dev_user', function(err, collection) {
	if (err) throw err;
	collection.insert(
	    {username: username, authentication: {password: password}},
	    {safe: true},
	    function(err, docs) {
		if (err) throw err;
		var userDoc = docs[0];
		fn(userDoc._id);
	    }
	);
    });
};

exports.DevSignup = DevSignup;
