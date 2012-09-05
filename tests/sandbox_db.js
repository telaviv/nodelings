/**
 * Creates a db on an alias used just for unit tests.
 */

var config = require('../config').config;
var mongo = require('mongodb')
var Server = mongo.Server;
var Db = mongo.Db;

var server = new Server(
    config.mongo_host, config.mongo_port, {auto_reconnect: true});
var db = new Db(config.mongo_name + '-sandbox', server, {native_parser: true});

/**
 * Destroys all the collections in the db.
 */
var clear = function(callback) {
    db.dropDatabase(callback);
}

exports.db = db;
exports.clear = clear;

