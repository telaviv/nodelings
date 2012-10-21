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
    var formMarkup = [
        "<form action='#' method='post' data-url='/wherever'>",
        	"<input type='text' name='cake'>Red Velvet</input>",
        "</form>"
    ].join('\n');

    var msgMarkup = '<p>';

    beforeEach(function() {
        this.form = $(formMarkup);
        this.msg = $(msgMarkup);
        $('body').append(this.form);
        $('body').append(this.msg);
    });

    afterEach(function() {
        this.form.remove();
        this.msg.remove();
    });

    it('can be instantiated', function() {
        new AjaxSubmitter(this.form, this.msg);
    });
});


