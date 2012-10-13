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
};

SignupValidator.prototype.validateUsername = function() {
    this.username.msg.removeClass('invalid');
    var username = this.username.input.val();
    if (username.length < 5 || username.length > 15) {
        this.username.msg.addClass('invalid');
        this.username.msg.text('The username should be between 5 and 15 characters long.');
    } else {
        this.username.msg.text('');
    }
};


