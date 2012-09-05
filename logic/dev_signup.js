/**
 *  Allows creation of a "developer" user. These are people allowed to
 *  make maps.
 */
var DevSignup = function(db) {
    this.db = db;
}

DevSignup.prototype.signup = function(db) {
}

exports.DevSignup = DevSignup;
