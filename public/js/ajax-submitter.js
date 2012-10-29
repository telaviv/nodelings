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
 * Submits forms designed to be used with ajax.
 *
 * Forms used with this class typically have vacuous actions and
 * have their 'data-url' attribute set to their action.
 *
 * When this class submits the form it expects back json with a 'success'
 * field. When success is true a 'redirect' field is included that has a
 * value of a url to redirect to. When success is false, a 'msg' field is
 * included with a value of a string to be inserted into the msg param.
 *
 * @param form - jquery form to have its submit event listened to.
 * @param msg - jquery element to have text inserted into it. A class
 *              'invalid' will be added to it when text is inserted.
 */
var AjaxSubmitter = function(form, msg) {
    this.form = form;
    form.submit($.proxy(this.submit, this));
};

AjaxSubmitter.prototype.submit = function(evt) {
    evt.preventDefault();

    var url = this.form.data('url');
    var data = this.form.serialize();
    var type = this.form.attr('method');
    $.ajax({url: url, data: data, type: type});
};
