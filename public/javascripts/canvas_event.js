/**
 * Listens for various dom events on a canvas element and turns them into game 
 * specific events.
 *
 * This class listens for mouse click/move events and converts them to
 * 'board.click' and 'board.move' events on the internal eventManager.
 *
 * 'board.click'/'board.move' events have  properties 'x' and 'y' which refer
 * the pixel on the canvas from the top left corner.
 *
 * TODO: support touch events.
 */
var CanvasEvent = function(eventManager, canvas) {
    this.em = eventManager;
    this.canvas = canvas
    this.canvas.click($.proxy(this.adaptClickEvent, this));
};

CanvasEvent.prototype.adaptClickEvent = function(event) {
    var offset = this.canvas.offset();
    var gameEventValue = {
	x: event.pageX - offset.left,
	y: event.pageY - offset.top
    };
    this.em.pushEvent('board.click', gameEventValue);
};