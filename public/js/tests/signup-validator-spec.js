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

describe('SignupValidator', function() {
    var expect = chai.expect;
    var markupText = ['<form>',
              	      	'<div class="username">',
                      		'<input name="username"/>',
                      		'<span class="inline-message"></span>',
                      	'</div>',
              	      	'<div class="password">',
                      		'<input name="password"/>',
                      		'<span class="inline-message"></span>',
                      	'</div>',
              	      	'<div class="verify-password">',
                      		'<input name="verify-password"/>',
                      		'<span class="inline-message"></span>',
                      	'</div>',
                      '</form>'].join('')

    beforeEach(function() {
        this.markup = $(markupText)
        $('body').append(this.markup);
        new SignupValidator(this.markup);
    });

    afterEach(function() {
        this.markup.remove();
    });

    it('errors if you type an invalid username', function() {
        // our only limits are that the name has to be
        // 5 <= 15 characters.

        var input = this.markup.find('div.username input');
        var msg = this.markup.find('div.username .inline-message');

        input.val('Loui');
        input.blur();
        expect(msg.hasClass('invalid')).to.be.ok
        expect(msg.text()).to.be.ok

        input.val('Louis A');
        input.blur();
        expect(msg.hasClass('invalid')).to.not.be.ok
        expect(msg.text()).to.not.be.ok

        input.val('Louis Louis Louis Louis');
        input.blur();
        expect(msg.hasClass('invalid')).to.be.ok
        expect(msg.text()).to.be.ok
    });
});


