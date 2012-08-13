var utils = require('./public/javascripts/utils.js');

var casper = require('casper').create({
    verbose: true,
    logLevel: 'debug',
});

var CANVAS_OFFSET_TOP = utils.randInt(50, 500);
var CANVAS_OFFSET_LEFT = utils.randInt(50, 500);
var CANVAS_WIDTH = 300; // px
var CANVAS_HEIGHT = 300; // px
var CANVAS_ID = 'canvas';
var CANVAS_ATTRIBUTES = { // jquery attributes to make the element.
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    id: CANVAS_ID,
    offset: {top: CANVAS_OFFSET_TOP, left: CANVAS_OFFSET_LEFT}
};

var createDom = function(canvasAttributes) {
    $('body').append('<canvas>', canvasAttributes);
};


var testClickEvent = function(
    left_offset, top_offset, canvasId, tester) {

    var canvasX = 37;
    var canvasY = 103;
    var documentX = canvasX + left_offset;
    var documentY = canvasY + top_offset;

    var em = new EventManager();
    var canvasEvent = new CanvasEvent(em, $('#' + canvasId));
    var counter = {count: 0};
    var clickListener = {
	react: function(event) {
	    counter.count += 1;
	}
    };

    em.addListener('board.click', clickListener);
    casper.emit('mouse.click', {pageX: documentX, pageY: documentY});

    console.log(tester.assertEqual(counter.count, 1));
};

tests = [
    {fn: testClickEvent, args: {left_offset: CANVAS_OFFSET_LEFT,
				top_offset: CANVAS_OFFSET_TOP,
				canvasId: CANVAS_ID,
				tester: casper.test}}
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

casper.start().then(function createDomRunner() {
    this.page.injectJs('public/javascripts/lib/jquery-1.8.0.min.js');
    this.page.injectJs('./public/javascripts/event_manager.js');
    this.page.injectJs('./public/javascripts/canvas_event.js');
    casper.evaluate(createDom, {canvasAttributes: CANVAS_ATTRIBUTES});
    this.each(tests, function eachTest(self, testCase) {
	self.then(function runTest() {
	    casper.evaluate(testCase.fn, testCase.args);
	});
    });
});

casper.run();