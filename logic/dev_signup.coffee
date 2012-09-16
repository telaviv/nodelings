###
# Copyright 2012 Shawn Krisman
#
# This file is part of Nodelings.
#
# Nodelings is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# Nodelings is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
#
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with Nodelings.  If not, see <http://www.gnu.org/licenses/>.
###

###
# Allows creation of a "developer" user. These are people allowed to
# make maps.
###

bcrypt = require('bcrypt')

UserExistsError = ->
UserExistsError.prototype = new Error()

###
# @constructor
# @param {db} db mongodb instance.
# @param {Crypt} crypt
###
DevSignup = (db, crypt) ->
  @db = db
  @crypt = crypt
  return this


DevSignup.UserExistsError = UserExistsError

###
# Creates a user in the db.
#
# @param {string} username
# @param {string} password
# @param {function} cb callback function. Takes 2 args.
#                   err, and the encUID.
#
# @return {string} encrypted user id
###
DevSignup.prototype.signup = (username, password, cb) ->
    @db.collection 'dev_user', (err, collection) =>
      if err then throw err
      collection.findOne {username: username}, (err, item) =>
        if err then throw err

        if item
          cb(new UserExistsError('username: ' + username + ' already exists.'))
        else
          postInsert = (err, docs) =>
            if err then throw err
            userDoc = docs[0]

            encID = @crypt.encryptObjectID(userDoc._id)
            cb(null, encID)

          collection.insert({
            username: username,
            password_hash: @_hashPassword(password),
            sessions: []},
            {safe: true},
            postInsert
          )

###
# Creates a cryptographically secure password hash.
#
# @param {string} password
#
# @return {string} hashed password
###
DevSignup.prototype._hashPassword = (password) ->
    return bcrypt.hashSync(password, 8)



exports.DevSignup = DevSignup
