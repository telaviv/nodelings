/**
 * Copyright 2012 Shawn Krisman
 * This file is part of Nodelings.
 *
 * Nodelings is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Nodelings is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 *
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Nodelings.  If not, see <http://www.gnu.org/>
 **/

describe('AjaxSubmitter', function() {
    var expect = chai.expect;

    var formMarkup = [
        "<form action='#' method='post' data-url='/wherever'>",
        	"<input type='text' name='cake' value='Red Velvet'/>",
        "</form>"
    ].join('\n');

    var msgMarkup = '<p>';

    beforeEach(function() {
        this.form = $(formMarkup);
        this.msg = $(msgMarkup);
        $('body').append(this.form);
        $('body').append(this.msg);
        this.ajaxSubmitter = new AjaxSubmitter(this.form, this.msg);
    });

    afterEach(function() {
        this.form.remove();
        this.msg.remove();
    });

    it('submits the form to the data-url', function() {
        var xhr = sinon.useFakeXMLHttpRequest();
        var requests = [];
        xhr.onCreate = function (xhr) {
            requests.push(xhr);
        };

        this.form.submit();
        expect(requests).to.have.length(1);
        expect(requests[0].method).to.equal('POST');
        expect(requests[0].url).to.equal('/wherever');

        xhr.restore();
    });

    it('redirects on server success', function() {
        var stub = sinon.stub(Location, 'redirect');
        var server = sinon.fakeServer.create();
        var redirUrl = '/walter/white';
        var body = JSON.stringify({success: true, redirect: redirUrl});
        server.respondWith([200, {}, body]);

        this.form.submit();
        server.respond();
        expect(stub).to.have.been.calledWith(redirUrl);

        server.restore();
        stub.restore();
    });


    it('populates msg with text on server failure', function() {
        var server = sinon.fakeServer.create();
        var errorMsg = 'The snarfle was eaten!';
        var body = JSON.stringify({success: false, msg: errorMsg});
        server.respondWith([200, {}, body]);

        this.form.submit();
        server.respond();
        expect(this.msg.text()).to.equal(errorMsg);

        server.restore();
    });

    it('populates msg with text on protocol failure', function() {
        var server = sinon.fakeServer.create();
        server.respondWith([500, {}, '']);

        this.form.submit();
        server.respond();
        expect(this.msg.text()).to.have.length.above(0);

        server.restore();
    });

});
