var casper = require('casper').create({
    verbose: true,
    logLevel: 'debug'
});
var event_manager = require('./public/javascripts/event_manager.js')

// listening to a custom event

var testCycleOneEvent = function() {
    var em = new event_manager.EventManager();
    var event = {
	type: 'test',
	value: {counter: 0},
    };
    var listener = {
	react: function react(nevent) {
	    nevent.value.counter += 1;
	}
    };

    em.addListener(event.type, listener)
    em.pushEvent(event.type, event.value);
    em.cycleEvents();
    casper.test.assertEqual(event.value.counter, 1);
}

tests = [testCycleOneEvent];

casper.start().each(tests, function eachCasper(self, test) {
    self.then(function runTest() {
	test();
    });
});

casper.run()

