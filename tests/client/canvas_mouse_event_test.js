var event_manager = require('./public/javascripts/event_manager.js');
var canvas_mouse_event = require('./public/javascripts/canvas_mouse_event.js');
var utils = require('./public/javascripts/utils.js');

var casper = require('casper').create({
    verbose: true,
    logLevel: 'debug',
    clientScripts: ['public/javascripts/lib/jquery-1.8.0.min.js']
});

var CANVAS_OFFSET_TOP = utils.randInt(0, 500);
var CANVAS_OFFSET_LEFT = utils.randInt(0, 500);
var CANVAS_WIDTH = 300; // px
var CANVAS_HEIGHT = 300; // px
var CANVAS_ID = 'canvas';

var createDom = function() {
    $('body').append('<canvas>', {
	width: CANVAS_WIDTH,
	height: CANVAS_HEIGHT,
	id: CANVAS_ID,
	offset: {top: CANVAS_OFFSET_TOP, left: CANVAS_OFFSET_LEFT}
    });
};

casper.start().then(function() {
    createDom();
});


