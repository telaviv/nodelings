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
# Creates a db on an alias used just for unit tests.
###

config = require('../../config').config
mongo = require('mongodb')
Server = mongo.Server
Db = mongo.Db

server = new Server(
    config.mongo_host, config.mongo_port, {auto_reconnect: true})
db = new Db(config.mongo_name + '-sandbox', server, {native_parser: true})

###
# Destroys all the collections in the db.
###
clear = (cb) -> db.dropDatabase(cb)

###
# Creates an initializes the db instance.
###
create = (cb) -> require('../../logic/db').initialize(db, cb)


exports.db = db
exports.clear = clear
exports.create = create
