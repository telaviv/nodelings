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

Response = require('../../logic/response').Response

chai.Assertion.includeStack = true
chai.use(sinonChai)

describe 'Response', ->
  describe '#render', ->
    it "uses nodejs's render method.", ->
      jresponse = {render: ->}
      spy = sinon.spy(jresponse, 'render')

      response = new Response(jresponse)
      response.render('cats', 'dogs')

      expect(spy.withArgs('cats', 'dogs')).to.have.been.calledOnce
