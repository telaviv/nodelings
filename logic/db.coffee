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
# Utility functions for working with mongodb.
###

config = require('../config').config
mongo = require('mongodb')
Server = mongo.Server
Db = mongo.Db

###
# Initialize a mongodb object to work with Nodelings.
#
#  @param {db} db mongodb instance
#  @param {function} cb callback
###
initialize = (db, cb) ->
  db.ensureIndex(
    'dev_user',
    {username: 1},
    {unique: true, dropDups: true},
    (err) -> cb(err, db)
  )

###
# Create a new db object.
#
# @param {boolean=} optional. True if the db is supposed to be sandboxed.
###
create = (sandbox)->
  sandbox = (if sandbox? then sandbox else config.mongo_sandbox)
  server = new Server(
    config.mongo_host, config.mongo_port, {auto_reconnect: true})

  name = config.mongo_name
  name += (if config.mongo_sandbox then '-sandbox' else '')

  db = new Db(name, server, {native_parser: true})
  return db

exports.initialize = initialize
exports.create = create
