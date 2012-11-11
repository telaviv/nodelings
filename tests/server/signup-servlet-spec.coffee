chai = require('chai')
sinon = require('sinon')
sinonChai = require('sinon-chai')
expect = chai.expect

SignupServlet = require('../../servlets/signup').SignupServlet

chai.Assertion.includeStack = true
chai.use(sinonChai)

describe 'SignupServlet', ->
  describe '.signupPost', ->
    testDoesNotValidate = (requestBody, done) ->
      request = {body: requestBody}

      mockJson = (json) ->
        expect(json.success).to.exist
        expect(json.success).to.not.be.ok
        expect(json.msg).to.exist
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
        expect(json.success).to.exist
        expect(json.success).to.be.ok
        expect(json.msg).to.not.exist
        expect(json.redirect).to.exist
        expect(json.redirect).to.equal('/login')
        done()
      response = {json: mockJson}

      signupServlet = new SignupServlet(null)
      signupServlet.signupPost(request, response)