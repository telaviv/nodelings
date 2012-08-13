var event_manager = require('./public/javascripts/event_manager.js');

var casper = require('casper').create({
    verbose: true,
    logLevel: 'debug'
});


var EventCounter = function(type) {
    this.type = type;
    this.value = {counter: 0};
};

var ListenerAdder = function() {
    this.react = function(event) {
	event.value.counter += 1;
    };
};

var testCycleZeroEvents = function() {
    var em = new event_manager.EventManager();
    // lets just verify this doesn't blow up.
    em.cycleEvents();
};

var testCycleOneEvent = function() {
    var em = new event_manager.EventManager();
    var event = new EventCounter('test');
    var listener = new ListenerAdder();

    em.addListener(event.type, listener);
    em.pushEvent(event.type, event.value);
    em.cycleEvents();
    casper.test.assertEqual(event.value.counter, 1);
};

var testCycleMultipleEvents = function() {
    var em = new event_manager.EventManager();
    var event1 = new EventCounter('test 1');
    var event2 = new EventCounter('test 2');
    var listener = new ListenerAdder();

    em.addListener(event1.type, listener);
    em.addListener(event2.type, listener);
    em.pushEvent(event1.type, event1.value);
    em.pushEvent(event2.type, event2.value);
    em.cycleEvents();

    casper.test.assertEqual(event1.value.counter, 1);
    casper.test.assertEqual(event2.value.counter, 1);
};

var testMultipleListeners = function() {
    var em = new event_manager.EventManager();
    var event = new EventCounter('test');
    var listener1 = new ListenerAdder();
    var listener2 = new ListenerAdder();

    em.addListener(event.type, listener1);
    em.addListener(event.type, listener2);
    em.pushEvent(event.type, event.value);
    em.cycleEvents();

    casper.test.assertEqual(event.value.counter, 2);
};

var testEventThrownInCycle = function() {
    var em = new event_manager.EventManager();
    var event1 = new EventCounter('test 1');
    var event2 = new EventCounter('test 2');
    var throwListener = {
	react: function react(event) {
	    event.value.counter += 1;
	    em.pushEvent(event2.type, event2.value);
	}
    };
    var normalListener = new ListenerAdder();

    em.addListener(event1.type, throwListener);
    em.addListener(event2.type, normalListener);
    em.pushEvent(event1.type, event1.value);
    em.cycleEvents();

    casper.test.assertEqual(event1.value.counter, 1);
    casper.test.assertEqual(event2.value.counter, 1);
};

tests = [
    testCycleZeroEvents,
    testCycleOneEvent,
    testCycleMultipleEvents,
    testMultipleListeners,
    testEventThrownInCycle
];

casper.start().each(tests, function eachCasper(self, testCase) {
    self.then(function runTest() {
	casper.evaluate(testCase);
    });
});

casper.run();

