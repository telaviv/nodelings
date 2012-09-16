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

expect = require('chai').expect
factories = require('../testing/factories')
sandboxDB = require('../testing/sandbox_db')

Crypt = require('../../util/crypt').Crypt
DevSession = require('../../logic/dev_session').DevSession

require('chai').Assertion.includeStack = true

describe 'DevSignup', ->
    crypt = new Crypt('hey guyz!')

    beforeEach (done) ->
      sandboxDB.create (err, db) =>
        if err then throw err
        @db = db
        @devSession = new DevSession(db, crypt, 2)
        done()

    it 'exists', ->
      expect(@devSession).to.exist

    describe '#create()', ->
      it 'creates a session in the db', (done) ->
        # first lets create the user.
        factories.createDevUser @db, crypt, (encUID) =>
        # now lets create the session
          @devSession.create encUID, (sid) =>
            # lets make sure our encSID is a real id in the db.
            factories.getDevUser encUID, @db, crypt, (doc) =>
              sessions = doc.sessions
              expect(sessions.length).to.equal(1)
              expect(sessions[0]).to.equal(sid)
              done()

      it 'creates a string from a session id and encUID', (done) ->
        factories.createDevUser @db, crypt, (encUID) =>
          @devSession.create encUID, (sid) =>
            @devSession.createSessionToken encUID, sid, (token) =>
              expect(token).to.be.a('string')
              done()

    describe '#validateSessionToken()', ->
      it 'passes with a token from create session token', (done) ->
        factories.createDevUser @db, crypt, (encUID) =>
          @devSession.create encUID, (sid) =>
            @devSession.createSessionToken encUID, sid, (token) =>
              @devSession.validateSessionToken token, (isValid) =>
                expect(isValid).to.equal(encUID)
                done()

      it 'fails when too many sessions have been created', (done) ->
        factories.createDevUser @db, crypt, (encUID) =>
          @devSession.create encUID, (sid) =>
            @devSession.createSessionToken encUID, sid, (token) =>
              # the test devSession has two allowable sessions. lets verify
              # that the token is valid after the creation of one more session.
              @devSession.create encUID, (sid) =>
                @devSession.validateSessionToken token, (isValid) =>
                  expect(isValid).to.equal(encUID)
                  # this time it should fail
                  @devSession.create encUID, =>
                    @devSession.validateSessionToken token, (isValid) =>
                      expect(isValid).to.equal(null)
                      done()
