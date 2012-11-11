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
 */

/**
 * Validation class for the signup form.
 */
var SignupValidator = function(container) {
    var sections = ['username', 'password', 'verify-password'];
    for (var i = 0; i < sections.length; ++i) {
        var member = sections[i];
        var section = container.find('div.' + member);
        this[member] = {
            input: section.children('input'),
            msg: section.children('.inline-message')
        };
    }
    this.username.input.blur($.proxy(this.validateUsername, this));
    this.password.input.blur($.proxy(this.validatePassword, this));
    this['verify-password'].input.blur($.proxy(this.validateVerifyPassword, this));
};


SignupValidator.prototype.validateUsername = function() {
    var validator = function(text) {
        return text.length >= 5 && text.length <= 15;
    };

    this.validate(
        this.username.input,
        this.username.msg,
        validator,
        'Your username should be between 5 and 15 characters.'
    );
};

SignupValidator.prototype.validatePassword = function() {
    var validator = function(text) {
        return text.length > 5 && text.length <= 25;
    };

    this.validate(
        this.password.input,
        this.password.msg,
        validator,
        'Your password should be betweeen 6 and 25 characters.'
    );
};

SignupValidator.prototype.validateVerifyPassword = function() {
    var validator = function(text) {
        return text === this.password.input.val();
    };

    this.validate(
        this['verify-password'].input,
        this['verify-password'].msg,
        $.proxy(validator, this),
        'Your password should be at least 6 characters.'
    );
};

/**
 * @param {!jQuery} input
 * @param {!jQuery} msg place to put the failureText
 * @param {function(string)} validator returns true if the string in the input
 *                           is a valid string.
 * @param {string} failureText placed in the msg element in case of failure.
 */
SignupValidator.prototype.validate = function(input, msg, validator, failureText) {
    var text = input.val();
    msg.removeClass('invalid');
    if (validator(text)) {
        msg.text('');
    } else {
        msg.addClass('invalid').text(failureText);
    }
}




