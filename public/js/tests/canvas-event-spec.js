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
 * along with Nodelings.  If not, see <http://www.gnu.org/
 **/

describe('CanvasEvent', function() {
    var expect = chai.expect;

    var CANVAS_OFFSET_TOP = 75;
    var CANVAS_OFFSET_LEFT = 75;
    var CANVAS_WIDTH = 100; // px
    var CANVAS_HEIGHT = 100; // px
    var CANVAS_ID = 'canvas';

    beforeEach(function() {
	var canvas = $('<canvas>');
	canvas.attr({
	    id: CANVAS_ID, width: CANVAS_WIDTH, height: CANVAS_HEIGHT})
	canvas.css({
	    position: 'absolute', left: CANVAS_OFFSET_LEFT, top: CANVAS_OFFSET_TOP});

	$('body').append(canvas);
    });

    afterEach(function() {
	    $('canvas#' + CANVAS_ID).remove();
    });

    it('adapts events on the canvas to game events', function() {
	var em = new EventManager();
	var canvasEvent = new CanvasEvent(em, $('canvas#' + CANVAS_ID));

	var canvasX = 37;
	var canvasY = 46;
	var documentX = canvasX + CANVAS_OFFSET_LEFT
	var documentY = canvasY + CANVAS_OFFSET_TOP

	var count = 0; // number of times the listener was called.
	var clickListener = {
	    react: function(event) {
		expect(event.type).to.equal('board.click');
		expect(event.value.x).to.equal(canvasX);
		expect(event.value.y).to.equal(canvasY);
		count += 1;
	    }
	};
	em.addListener('board.click', clickListener);

	// emit mouse event.
	var evt = $.Event('click');
	evt.pageX = documentX;
	evt.pageY = documentY;
	$('#' + CANVAS_ID).trigger(evt);

	em.cycleEvents();
	expect(count).to.equal(1);
    });
});


