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

config = require('./config').config
express = require('express')
fs = require('fs')
http = require('http')
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

  @createServlets: ->
    # find all files in the servlet directory and create objects from them.
    servletDir = __dirname + '/servlets/'
    files = fs.readdirSync(servletDir)
    servlets = []

    for file in files
      match = file.match(/(.*)\.js$/)
      if match
        servlets.push(new (require(servletDir + match[1]).servlet)())

    return servlets

  @create: ->
    servlets = @createServlets()
    app = @createApp()
    port = config.app_port

    return new Server(servlets, app, http, port)

exports.ServerFactory = ServerFactory