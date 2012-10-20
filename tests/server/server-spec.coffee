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
Response = require('../../logic/response').Response

chai.Assertion.includeStack = true
chai.use(sinonChai)

describe 'Server', ->
  it 'assigns a single route correctly', ->
    match = '/fake'
    routeSpy = sinon.spy()
    servlet = {routes: [{match: match, route: routeSpy, method: 'get'}]}

    app = {get: ->}
    appSpy = sinon.spy(app, 'get')

    new Server([servlet], app)

    expect(appSpy.withArgs(match)).to.have.been.calledOnce
    modifiedRoute = appSpy.getCall(0).args[1]
    modifiedRoute(null, null)
    expect(routeSpy).to.have.been.calledOnce

  it 'assigns multiple routes correctly', ->
    app = {get: ->}
    spy = sinon.spy(app, 'get')
    routes = []
    for i in [1..3]
      obj = {match: '/fake' + i, route: sinon.spy(), method: 'get'}
      routes.push(obj)
      spy.withArgs(obj.match, obj.route)

    new Server([{routes: routes}], app)

    for obj, i in routes
      expect(spy.withArgs(obj.match)).to.have.been.calledOnce
      modifiedRoute = spy.getCall(i).args[1]
      modifiedRoute(null, null)
      expect(obj.route).to.have.been.calledOnce

  it 'selectively chooses http method based on the method arg', ->
    getSpy = sinon.spy()
    postSpy = sinon.spy()
    app = {get: getSpy, post: postSpy}

    routes = []
    routes.push({match: '/fake-get', route: sinon.spy(), method: 'get'})
    routes.push({match: '/fake-post', route: sinon.spy(), method: 'post'})

    new Server([{routes: routes}], app)

    expect(getSpy).to.have.been.calledOnce
    expect(getSpy).to.have.been.calledWith(routes[0].match)
    expect(postSpy).to.have.been.calledOnce
    expect(postSpy).to.have.been.calledWith(routes[1].match)

  it 'handles multiple servlets', ->
    servletA = {routes: [{match: '/fake-A', route: 'A', method: 'get'}]}
    servletB = {routes: [{match: '/fake-B', route: 'B', method: 'get'}]}
    app = {get: ->}
    spy = sinon.spy(app, 'get')

    new Server([servletA, servletB], app)

    routeA = servletA.routes[0]
    routeB = servletB.routes[0]

    expect(spy.withArgs(routeA.match)).to.have.been.calledOnce
    expect(spy.withArgs(routeB.match)).to.have.been.calledOnce

  it "passes nodelings' Response objects to servlets", ->
    app = {get: ->}
    appSpy = sinon.spy app, 'get'
    rawRouteSpy = sinon.spy()
    servlet = {routes: [{match: '/end', route: rawRouteSpy, method: 'get'}]}

    new Server([servlet], app)

    modifiedRoute = appSpy.getCall(0).args[1]
    # modified routes take "raw" req and res objects. null works fine here.
    modifiedRoute(null, null)

    response = rawRouteSpy.getCall(0).args[1]
    expect(response).to.be.an.instanceof(Response)

  describe 'run', ->
    it 'listens on the servlet created by createServer', ->
      port = 8080
      listenSpy = sinon.spy()
      addListenerSpy = sinon.spy()
      server = {listen: listenSpy, addListener: addListenerSpy}
      app = 'im an app'

      (new Server([], app, server, port)).run()

      expect(addListenerSpy.withArgs('request', app)).to.have.been.calledOnce
      expect(listenSpy.withArgs(port)).to.have.been.calledOnce