chai = require('chai')
sinon = require('sinon')
sinonChai = require('sinon-chai')
expect = chai.expect

SignupServlet = require('../../servlets/signup').SignupServlet
UserExistsError = require('../../logic/dev-signup').UserExistsError

chai.Assertion.includeStack = true
chai.use(sinonChai)

describe 'SignupServlet', ->
  describe '.signupPost', ->
    normalRequest =
      body:
        username: 'Cat Stevens'
        password: 'catstevens'
        'verify-password': 'catstevens'

    testDoesNotValidate = (requestBody, done) ->
      request = {body: requestBody}

      mockJson = (json) ->
        expect(json).to.have.property('success', false)
        expect(json.msg).to.have.length.above(0)
        done()
      response = {json: mockJson}

      signupServlet = new SignupServlet(null)
      signupServlet.signupPost(request, response)

    it 'errors when the username is invalid', (done) ->
      body =
        username: 'abcdefghijklmnopqrstuvwxyz'
        password: 'catstevens'
        'verify-password': 'catstevens'
      testDoesNotValidate(body, done)

    it 'errors when the password is invalid', (done) ->
      body =
        username: 'Cat Stevens'
        password: 'cat'
        'verify-password': 'cat'
      testDoesNotValidate(body, done)

    it 'errors when the verify password is invalid', (done) ->
      body =
        username: 'Cat Stevens'
        password: 'catstevens'
        'verify-password': 'catevenstevens'
      testDoesNotValidate(body, done)

    it 'succeeds when all the values are validated', (done) ->
      body =
        username: 'Cat Stevens'
        password: 'catstevens'
        'verify-password': 'catstevens'
      request = {body: body}

      mockJson = (json) ->
        expect(json.success).to.be.ok
        expect(json).to.not.have.property('msg')
        expect(json.redirect).to.equal('/login')
        done()
      response = {json: mockJson}

      signupSpy = sinon.spy (username, password, cb) ->
        cb(null, '46789')
      devSignup = signup: signupSpy

      signupServlet = new SignupServlet(devSignup)
      signupServlet.signupPost(request, response)

    it 'creates a new user', (done) ->
      signupSpy = sinon.spy (username, password, cb) ->
        cb(null, '46789')
      jsonStub = ->
        expect(signupSpy).to.be.calledWith(
          normalRequest.body.username,
          normalRequest.body.password,
        )
        done()

      devSignup = signup: signupSpy
      response = json: jsonStub

      signupServlet = new SignupServlet(devSignup)
      signupServlet.signupPost(normalRequest, response)

    it 'fails when a user already exists', (done) ->
      signupStub = (username, password, cb) ->
        cb(new UserExistsError())
      jsonStub = (json) ->
        expect(json).to.have.property('success', false)
        expect(json.msg).length.to.be.above(0)
        expect(json).to.not.have.property('redirect')
        done()

      devSignup = signup: signupStub
      response = json: jsonStub

      signupServlet = new SignupServlet(devSignup)
      signupServlet.signupPost(normalRequest, response)
