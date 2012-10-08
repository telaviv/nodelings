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

FileUtils = require('../../util/file-utils').FileUtils
fs = require('fs')

chai.Assertion.includeStack = true
chai.use(sinonChai)

describe 'FileUtils', ->
  describe '#matches', ->
    it 'returns only files that match the regex', sinon.test(->
      readdirSync = @stub(fs, 'readdirSync').returns(
        ['cats', 'dogs', 'cats'])

      matches = FileUtils.matches '/whatevs/', /^cats$/
      expect(matches).to.have.length(2)
    )

    it 'returns the entire match object', sinon.test(->
      readdirSync = @stub(fs, 'readdirSync').returns(['whole-part'])

      matches = FileUtils.matches '/come-on/', /^whole-(part)$/
      expect(matches[0][0]).to.equal('whole-part')
      expect(matches[0][1]).to.equal('part')
    )
