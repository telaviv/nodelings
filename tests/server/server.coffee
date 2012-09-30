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
    servlet = {routes: [{match: match, route: route, method: 'get'}]}

    app = {get: ->}
    spy = sinon.spy(app, 'get')
    spy.withArgs(match, route)

    new Server([servlet], app)

    expect(spy.withArgs(match, route)).to.have.been.calledOnce

  it 'assigns multiple routes correctly', ->
    app = {get: ->}
    spy = sinon.spy(app, 'get')
    routes = []
    for i in [1..3]
      obj = {match: '/fake' + i, route: i, method: 'get'}
      routes.push(obj)
      spy.withArgs(obj.match, obj.route)

    new Server([{routes: routes}], app)

    for obj in routes
      expect(spy.withArgs(obj.match, obj.route)).to.have.been.calledOnce

  it 'selectively chooses http type based on the method', ->
    getSpy = sinon.spy()
    postSpy = sinon.spy()
    app = {get: getSpy, post: postSpy}

    routes = []
    routes.push({match: '/fake-get', route: sinon.spy(), method: 'get'})
    routes.push({match: '/fake-post', route: sinon.spy(), method: 'post'})

    new Server([{routes: routes}], app)

    expect(getSpy).to.have.been.calledOnce
    expect(getSpy).to.have.been.calledWithExactly(
      routes[0].match, routes[0].route)
    expect(postSpy).to.have.been.calledOnce
    expect(postSpy).to.have.been.calledWithExactly(
      routes[1].match, routes[1].route)

  it 'handles multiple servlets', ->
    servletA = {routes: [{match: '/fake-A', route: 'A', method: 'get'}]}
    servletB = {routes: [{match: '/fake-B', route: 'B', method: 'get'}]}
    app = {get: ->}
    spy = sinon.spy(app, 'get')

    new Server([servletA, servletB], app)

    routeA = servletA.routes[0]
    routeB = servletB.routes[0]

    expect(spy.withArgs(routeA.match, routeA.route)).to.have.been.calledOnce
    expect(spy.withArgs(routeB.match, routeB.route)).to.have.been.calledOnce