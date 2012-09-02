var casper = require('casper').create({
    verbose: true,
    logLevel: 'debug',
});

var CANVAS_OFFSET_TOP = 75;
var CANVAS_OFFSET_LEFT = 75;
var CANVAS_WIDTH = 100; // px
var CANVAS_HEIGHT = 100; // px
var CANVAS_ID = 'canvas';
var CANVAS_ATTRIBUTES = { // jquery attributes to make the element.
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    id: CANVAS_ID,
    offset: {top: CANVAS_OFFSET_TOP, left: CANVAS_OFFSET_LEFT}
};

var createDom = function(canvasAttributes) {
    $('body').append($('<canvas>', canvasAttributes));
};


var testClickEvent = function() {

    var clientSetup = function _clientSetup(offset, canvasClickLoc, canvasId) {
	var canvasX = canvasClickLoc.left;
	var canvasY = canvasClickLoc.top;
	var documentX = canvasX + offset.left;
	var documentY = canvasY + offset.top;
	
	var em = new EventManager();
	
	var canvasEvent = new CanvasEvent(em, $('#' + canvasId));
	var counter = {count: 0};
	window.counter = counter;
	window.em = em;
	var clickListener = {
	    react: function(event) {
		counter.count += 1;
	    }
	};

	em.addListener('board.click', clickListener);
	canvasEvent.adaptClickEvent({pageX: documentX, pageY: documentY});
    };

    var clientPostEmit = function _clientPostEmit() {
	window.em.cycleEvents();
	assertions.assertEqual(window.counter.count, 1);
    }

    offset = {left: CANVAS_OFFSET_LEFT, top: CANVAS_OFFSET_TOP};
    canvasClickLoc = {left: 37, top: 105};

    casper.evaluate(
	clientSetup, 
	{offset: offset, canvasClickLoc: canvasClickLoc, canvasId: CANVAS_ID}
    );
    
    /*
    casper.page.sendEvent(
	'click',
	offset.left + canvasClickLoc.left,
	offset.top + canvasClickLoc.top
    );
    */
    casper.evaluate(clientPostEmit);
};

tests = [
    testClickEvent
];

casper.on('page.error', function(msg, trace) {
    this.echo("Error: " + msg);
    for (var i = 0; i < trace.length; ++i) {
	this.echo('\t' + trace[i].file +
		  ': ' + trace[i].function +
		  ' line ' + trace[i].line);
    }

    this.die('Client Side Exception', 1);
});

casper.start('http://localhost:3000/blank').then(function createDomRunner() {
    casper.evaluate(createDom, {canvasAttributes: CANVAS_ATTRIBUTES});
    casper.debugHTML();
    this.each(tests, function eachTest(self, testCase) {
	self.then(function runTest() {
	    testCase();
	});
    });
});

casper.run();