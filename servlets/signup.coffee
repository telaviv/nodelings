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
# Signup endpoints.
###

class SignupServlet
  constructor: (@devSession) ->
    @routes = [
      {match: '/signup', route: @signupGet, method: 'get'},
      {match: '/signup', route: @signupPost, method: 'post'},
    ]

  signupGet: (req, res) ->
    env = { title: 'Signup' }
    res.render('signup', env)

  signupPost: (req, res) ->
    throw Error('Not Implemented')

class SignupServletFactory
  @create: (params) ->
    Crypt = require('../util/crypt').Crypt
    DevSession = require('../logic/dev-session').DevSession
    secrets = require('../secrets').secrets
    DEV_SESSIONS = 3


    db = params.db
    crypt = new Crypt(secrets.cipher_key)
    devSession = new DevSession(db, crypt, DEV_SESSIONS)

    return new SignupServlet(devSession)

exports.SignupServlet = SignupServlet
exports.servlet = SignupServletFactory
