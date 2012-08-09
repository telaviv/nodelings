var casper = require('casper').create({
    verbose: true,
    logLevel: 'debug'
});
var event_manager = require('./public/javascripts/event_manager.js')

var EventCounter = function(type) {
    this.type = type;
    this.value = {counter: 0};
}

var ListenerAdder = function() {
    this.react = function(event) {
	event.value.counter += 1;
    }
}

var testCycleZeroEvents = function() {
    var em = new event_manager.EventManager();
    // lets just verify this doesn't blow up.
    em.cycleEvents();
}

var testCycleOneEvent = function() {
    var em = new event_manager.EventManager();
    var event = new EventCounter('test');
    var listener = new ListenerAdder();

    em.addListener(event.type, listener)
    em.pushEvent(event.type, event.value);
    em.cycleEvents();
    casper.test.assertEqual(event.value.counter, 1);
}

var testCycleMultipleEvents = function() {
    var em = new event_manager.EventManager();
    var event1 = new EventCounter('test 1');
    var event2 = new EventCounter('test 2');
    var listener = new ListenerAdder();

    em.addListener('test 1', listener);
    em.addListener('test 2', listener);
    em.pushEvent(event1.type, event1.value);
    em.pushEvent(event2.type, event2.value);
    em.cycleEvents();

    casper.test.assertEqual(event1.value.counter, 1);
    casper.test.assertEqual(event2.value.counter, 1);
}


tests = [
    testCycleZeroEvents,
    testCycleOneEvent,
    testCycleMultipleEvents
];

casper.start().each(tests, function eachCasper(self, testCase) {
    self.then(function runTest() {
	testCase();
    });
});

casper.run()

