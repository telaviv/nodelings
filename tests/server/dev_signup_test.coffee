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
sandboxDB = require('../sandbox_db')

Crypt = require('../../util/crypt').Crypt
DevSignup = require('../../logic/dev_signup').DevSignup

require('chai').Assertion.includeStack = true

describe 'DevSignup', ->
  crypt = new Crypt('testing')

  beforeEach (done) ->
    sandboxDB.create (err, db) =>
      if (err) then throw err
      @db = db
      @ds = new DevSignup(db, crypt)
      done()

  # generates a unique string
  unique = -> (new Date()).getTime().toString()

  it 'exists', ->
    expect(this.ds).to.exist

  describe '#signup()', ->
    it 'creates a user', (done) ->
      @ds.signup unique(), 'secret', (err, encUID) =>
        if err then throw error
        factories.getDevUser encUID, @db, crypt, (userDoc) =>
          foundUID = crypt.encryptObjectID(userDoc._id)
          expect(encUID).to.equal(foundUID)
          done()

    it 'does not store the password in plaintext', (done) ->
      deepMatch = (doc, match, cb) ->
        for prop of doc
          if doc.hasOwnProperty(prop)
            value = doc[prop]
          if typeof value is 'object'
            deepMatch(value, match, ->)
          else
            expect(value).to.not.equal(match)
        cb()
      password = 'secret'
      @ds.signup unique(), password, (err, encUID) =>
        factories.getDevUser encUID, @db, crypt, (userDoc) =>
          deepMatch(userDoc, password, done)

    it 'prevents username collisions', (done) ->
      username = unique()
      @ds.signup username, 'tea', (err) =>
        if err then throw err
        @ds.signup username, 'biscuits', (err) =>
          expect(err).to.exist
          expect(err).to.be.an.instanceof(DevSignup.UserExistsError)
          @db.collection 'dev_user', (err, collection) =>
            if err then throw err
            collection.find({username: username}).toArray (err, items) =>
              if err then throw err
              expect(items.length).to.equal(1)
              done()
