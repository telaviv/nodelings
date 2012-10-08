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

###
# Represents an http response. Has utility methods that perform
# various http response actions via side effects.
###

class Response
  # @param resp node's response object.
  constructor: (@resp) ->

  # Render's a template.
  # @param {string} view name.
  # @param {object} env variables to be made available to the template.
  render: (view, env) ->
    @resp.render(view, env)

exports.Response = Response