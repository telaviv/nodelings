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

/**
 * Handles session creation and deletion.
 * Also provides utility methods for dealing with sessions.
 */

/**
 * @constructor
 * @param {db} db mongdb instance.
 * @param {Crypt} crypt
 * @param {number} totalSessions maximum amount of sessions for a dev user.
 */

var DevSession = function(db, crypt, totalSessions) {
    this.db = db;
    this.crypt = crypt;
    this.totalSessions = totalSessions;
};

/**
 * Creates a new session for the user.
 *
 * @param {string} encUID
 * @param {function} cb callback. Should take one arg:
 *                   {string} sid the session id.
 */
DevSession.prototype.create = function(encUID, cb) {
    var that = this;
    var uid = that.crypt.decryptObjectID(encUID);
    that.db.collection('dev_user', function(err, collection) {
	if (err) throw err;
	collection.findOne({_id: uid}, {sessions: 1}, function(err, doc) {
	    var oldSessions = doc.sessions;
	    var newSessions = that._createNewSessionArray(oldSessions);
	    var sid = newSessions[0];

	    // Now lets insert the entire array back into the doc
	    collection.findAndModify(
		{_id: uid, sessions: oldSessions},
		{},
		{$set: {sessions: newSessions}},
		{},
		function(err, doc) {
		    if (err) throw err;

		    // if the sessions have already been modified, we need to
		    // retry the operation.
		    if (!doc) {
			that.create(encUID, cb);
		    } else {
			cb(sid);
		    }
		}
	    );
	});
    });
};

DevSession.prototype._createNewSessionArray = function(oldSessions) {
    var newSessions = oldSessions.slice();
    // the "session id" is just a timestamp.
    var sid = (new Date()).getTime().toString();

    // lets make sure there isn't a preexisting sid with this value.
    while(oldSessions.indexOf(sid) != -1) {
	sid = (new Date()).getTime().toString();
    }

    // if there are too many sessions we need to remove one of them.
    if (newSessions.unshift(sid) > this.totalSessions) {
	newSessions.pop();
    }
    return newSessions;
}


/**
 * Creates a session token from a encUID and session id.
 *
 * @param {string} encUID encrypted user id.
 * @param {string} sid session id.
 * @param {function} cb call back function that takes one arg:
 *                   {string} session token;
 */
DevSession.prototype.createSessionToken = function(encUID, sid, cb) {
    var token = this.crypt.encrypt(encUID + ';' + sid);
    cb(token);
};

/**
 * Verifies that a session token belongs to the given user.
 *
 * @param {string} token session token
 * @param {function} cb call back function that takes one arg:
 *                   {string} the encrypted user id if valid. null otherwise.
 */
DevSession.prototype.validateSessionToken = function(token, cb) {
    var that = this;

    var arr = that.crypt.decrypt(token).split(';');
    var encUID = arr[0];
    var uid = that.crypt.decryptObjectID(encUID);
    var sid = arr[1];

    that.db.collection('dev_user', function(err, collection) {
	if (err) throw err;

	collection.findOne({_id: uid}, {sessions: 1}, function(err, doc) {
	    if (err) throw err;

	    // this can happen if uid doesn't belong to a user.
	    if (!doc) {
		cb(null);
	    } else {
		if (doc.sessions.indexOf(sid) === -1) {
		    cb(null);
		} else {
		    cb(encUID);
		}
	    }
	});
    });
};


exports.DevSession = DevSession;