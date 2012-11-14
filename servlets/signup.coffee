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

DevSignup = require('../logic/dev-signup').DevSignup
UserExistsError = require('../logic/dev-signup').UserExistsError

class SignupServlet
  constructor: (@devSignup) ->
    @routes = [
      {match: '/signup', route: @signupGet, method: 'get'},
      {match: '/signup', route: @signupPost, method: 'post'},
    ]

  signupGet: (req, res) ->
    env = { title: 'Signup' }
    res.render('signup', env)

  signupPost: (req, res) =>
    validated = this._validateRequest(req.body)
    if (validated.error)
      return res.json success: false, msg: validated.error

    @devSignup.signup validated.username, validated.password, (err, encID) ->
      if err
        if err instanceof UserExistsError
          msg = 'There already exists a user with this name.'
        else
          msg = 'We are having technical difficulties, please try again later!'
        res.json success: false, msg: msg
      else
        res.json success: true, redirect: '/login'

  _validateRequest: (body) ->
    username = (val) ->
      return val.length >= 5 and val.length <= 15
    password = (val) ->
      return val.length > 5 and val.length <= 25
    verifyPassword = (val) ->
      return val == body.password
    fields =
      username:
        validator: username
        msg: 'Usernames must be between 5 and 15 characters long.'
      password:
        validator: password
        msg: 'Passwords must be between 6 and 25 characters long.'
      'verify-password':
        validator: verifyPassword
        msg: 'The passwords do not match.'


    values = {}
    for name, map of fields
      field = body[name]
      if field and map.validator(field)
        values[name] = field
      else
        return {error: map.msg}
    return values


class SignupServletFactory
  @create: (params) ->
    devSignup = new DevSignup params.db, params.crypt
    return new SignupServlet devSignup

exports.SignupServlet = SignupServlet
exports.servlet = SignupServletFactory
