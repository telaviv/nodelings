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

chai = require('chai')
sinon = require('sinon')
sinonChai = require('sinon-chai')
expect = chai.expect

Server = require('../../server').Server

chai.Assertion.includeStack = true
chai.use(sinonChai)

describe 'Server', ->
  it 'assigns a single route correctly', ->
    match = '/fake'
    route = sinon.spy()
    servlet = {routes: [{match: match, route: route}]}

    app = {get: ->}
    spy = sinon.spy(app, 'get')
    spy.withArgs(match, route)

    new Server(app, [servlet])

    expect(spy.withArgs(match, route)).to.have.been.calledOnce

  it 'assigns multiple routes correctly', ->
    app = {get: ->}
    spy = sinon.spy(app, 'get')
    routes = []
    for i in [1..3]
      obj = {match: '/fake' + i, route: i}
      routes.push(obj)
      spy.withArgs(obj.match, obj.route)

    new Server(app, [{routes: routes}])

    for obj in routes
      expect(spy.withArgs(obj.match, obj.route)).to.have.been.calledOnce
