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
# GET test page
###

FileUtils = require('./../util/file-utils').FileUtils

class TestServlet
  constructor: ->
    @routes = [
      {match: '/tests', route: @tests, method: 'get'}
    ]

  tests: (req, res) =>
    env = { title: 'Nodeling Tests' }
    env['testFiles'] = @testFiles()
    res.render('tests', env)

  testFiles: ->
    publicTestDir = '/js/tests/'
    privateTestDir = __dirname + '/../public/js/tests/'
    matches = FileUtils.matches(privateTestDir, /(.*-spec\.js$)/)

    tests = []
    for match in matches
      tests.push(publicTestDir + match[1])

    return tests

class TestServletFactory
  @create: ->
    return new TestServlet()

exports.servlet = TestServletFactory
