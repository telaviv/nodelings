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
# Login page and post.
###

class Login
  constructor: ->
    @routes = [
      {match: '/login', route: @loginPage, method: 'get'}
    ]

  loginPage: (req, res) =>
    env = { title: 'Login Page' }
    res.render('login', env)

class LoginServletFactory
  @create: ->
    return new Login()

exports.servlet = LoginServletFactory
