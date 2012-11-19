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
              	      	'<span class="username">',
                      		'<input name="username"/>',
                      		'<span class="inline-message"></span>',
                      	'</span>',
              	      	'<span class="password">',
                      		'<input name="password"/>',
                      		'<span class="inline-message"></span>',
                      	'</span>',
              	      	'<span class="verify-password">',
                      		'<input name="verify-password"/>',
                      		'<span class="inline-message"></span>',
                      	'</span>',
                      '</form>'].join('')

    beforeEach(function() {
        this.markup = $(markupText)
        $('body').append(this.markup);
        new SignupValidator(this.markup);
    });

    afterEach(function() {
        this.markup.remove();
    });

    it('validates username input', function() {
        // our only limits are that the name has to be
        // >= 5  && <= 15 characters.

        var input = this.markup.find('span.username input');
        var msg = this.markup.find('span.username .inline-message');

        input.val('Loui');
        input.blur();
        expect(msg.hasClass('invalid')).to.be.ok;
        expect(msg.text()).to.be.ok;

        input.val('Louis CK');
        input.blur();
        expect(msg.hasClass('invalid')).to.not.be.ok;
        expect(msg.text()).to.not.be.ok;

        input.val('Louis Louis Louis Louis');
        input.blur();
        expect(msg.hasClass('invalid')).to.be.ok;
        expect(msg.text()).to.be.ok;
    });

    it('validates password input', function() {
        // 6 character limit to passwords.

        var input = this.markup.find('span.password input');
        var msg = this.markup.find('span.password .inline-message');

        input.val('passw');
        input.blur();
        expect(msg.hasClass('invalid')).to.be.ok;
        expect(msg.text()).to.be.ok;

        input.val('passw*!,');
        input.blur();
        expect(msg.hasClass('invalid')).to.not.be.ok;
        expect(msg.text()).to.not.be.ok;
    });

    it('validates verify-password input', function() {
        // 6 character limit to passwords.

        var passInput = this.markup.find('span.password input');
        var input = this.markup.find('span.verify-password input');
        var msg = this.markup.find('span.verify-password .inline-message');

        passInput.val('password');

        input.val('password!');
        input.blur();
        expect(msg.hasClass('invalid')).to.be.ok;
        expect(msg.text()).to.be.ok;

        input.val('password');
        input.blur();
        expect(msg.hasClass('invalid')).to.not.be.ok;
        expect(msg.text()).to.not.be.ok;
    });
});


