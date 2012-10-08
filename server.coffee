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

Response = require('./logic/response').Response

###
# This class is responsible for all http routing and processing.
###
class Server
  constructor: (servlets, @app, @http, @port) ->
    for servlet in servlets
      for route in servlet.routes
        @app[route.method] route.match, @wrapRoute(route.route)

  ###
  # Instead of of the raw res and req objects, let's pass
  # a nodelings' Response object
  ###
  wrapRoute: (route) ->
    return (req, res) ->
      response = new Response res
      route(req, response)

  ###
  # Permanently listens for http requests.
  ###
  run: ->
    port = @port
    @http.createServer(@app).listen @port, ->
      console.log 'Express server listening on port ' + port

exports.Server = Server