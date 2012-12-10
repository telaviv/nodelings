###
# Copyright 2012 Shawn Krisman
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

crypto = require('crypto')
fs = require('fs')
https = require('https')

config = require('./config').config
db = require('./logic/db')
express = require('express')
secrets = require('./secrets').secrets
Crypt = require('./util/crypt').Crypt
FileUtils = require('./util/file-utils').FileUtils
Server = require('./server').Server

# Factory for the server class.
class ServerFactory
  @createApp: ->
    # All the initialization for the express object
    app = express();

    app.configure ->
      app.set('views', __dirname + '/views');
      app.set('view engine', 'jade');
      app.use(express.favicon());
      app.use(express.logger('dev'));
      app.use(express.bodyParser());
      app.use(express.methodOverride());
      app.use(app.router);
      app.use(express.static(__dirname + '/public'));


    app.configure 'development', ->
      app.use(express.errorHandler());
      app.locals.pretty = true;

    return app

  @createServer: ->
    privateKey = fs.readFileSync(config.ssl_private_key)
    certificate = fs.readFileSync(config.ssl_certificate)

    options =
      key: privateKey
      cert: certificate
      # these are to mitigate BEAST attacks
      ciphers: '!aNULL:!eNULL:!EXPORT:!DSS:!DES:RC4-SHA:RC4-MD5:ALL'
      honorCipherOrder: true

    return https.createServer(options)

  @createServlets: (cb) ->
    # find all files in the servlet directory and create objects from them.
    servletDir = __dirname + '/servlets/'
    matches = FileUtils.matches(servletDir, /(.*)\.js$/)
    crypt = @createCrypt()

    @createDb (db) ->
      params = {db: db, crypt: crypt}

      servlets = []
      for match in matches
        servlets.push require(servletDir + match[1]).servlet.create(params)

      cb(servlets)

  @createCrypt: ->
    return new Crypt(secrets.cipher_key)

  @createDb: (cb) ->
    servletDB = db.create()
    db.initialize servletDB, (err, servletDB)->
      throw err if err
      cb(servletDB)

  @create: (cb) ->
    @createServlets (servlets) =>
      app = @createApp()
      server = @createServer()
      port = config.app_port

      cb(new Server(servlets, app, server, port))

exports.ServerFactory = ServerFactory