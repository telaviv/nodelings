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
Response = require('../../logic/response').Response

chai.Assertion.includeStack = true
chai.use(sinonChai)

describe 'Response', ->
  describe '.render', ->
    it "uses nodejs's render method.", ->
      jresponse = {render: ->}
      spy = sinon.spy jresponse, 'render'

      response = new Response(jresponse)
      response.render 'cats', 'dogs'

      expect(spy.withArgs('cats', 'dogs')).to.have.been.calledOnce

    it 'includes all js files in the js directory', ->
      jresponse = {render: ->}
      renderSpy = sinon.spy jresponse, 'render'
      matchesStub = sinon.stub(FileUtils, 'matches').returns(
        [['this.js', 'this.js'], ['that.js', 'that.js']]);

      response = new Response(jresponse)
      response.render 'cats', {}

      passedEnv = renderSpy.getCall(0).args[1];
      expect(passedEnv).to.have.property('jsFiles')
        .and.to.include('/js/this.js')
        .and.to.include('/js/that.js')

  describe '.json', ->
    it 'Sets the body to the passed in json.', ->
      json = {keep: 'on keeping on', amirite: true}
      msg = JSON.stringify json

      jresponse =
        write: ->

        setHeader: ->

        end: ->

      spy = sinon.spy jresponse, 'write'

      response = new Response(jresponse)
      response.json json

      expect(spy.withArgs(msg)).to.have.been.calledOnce

