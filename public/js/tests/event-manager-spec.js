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

describe('EventManager', function() {
    var expect = chai.expect;

    beforeEach(function() {
	    this.em = new EventManager();
    });

    it('exists', function() {
	    expect(this.em).to.exist;
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

    describe('.cycleEvents', function() {
	it('handles zero events', function() {
	    // lets just verify this doesn't blow up.
	    this.em.cycleEvents();
	});

	it('handles one event', function() {
	    var event = new EventCounter('test');
	    var listener = new ListenerAdder();

	    this.em.addListener(event.type, listener);
	    this.em.pushEvent(event.type, event.value);
	    this.em.cycleEvents();
	    expect(event.value.counter).to.equal(1);
	});

	it('handles multiple events', function() {
	    var event1 = new EventCounter('test 1');
	    var event2 = new EventCounter('test 2');
	    var listener = new ListenerAdder();

	    this.em.addListener(event1.type, listener);
	    this.em.addListener(event2.type, listener);
	    this.em.pushEvent(event1.type, event1.value);
	    this.em.pushEvent(event2.type, event2.value);
	    this.em.cycleEvents();

	    expect(event1.value.counter).to.equal(1);
	    expect(event2.value.counter).to.equal(1);
	});

	it('handles multiple listeners', function() {
	    var event = new EventCounter('test');
	    var listener1 = new ListenerAdder();
	    var listener2 = new ListenerAdder();

	    this.em.addListener(event.type, listener1);
	    this.em.addListener(event.type, listener2);
	    this.em.pushEvent(event.type, event.value);
	    this.em.cycleEvents();

	    expect(event.value.counter).to.equal(2);
	});

	it("doesn't ignore events thrown while cycling.", function() {
	    var event1 = new EventCounter('test 1');
	    var event2 = new EventCounter('test 2');
	    var throwListener = {
		react: $.proxy(function react(event) {
		    event.value.counter += 1;
		    this.em.pushEvent(event2.type, event2.value);
		}, this)
	    };
	    var normalListener = new ListenerAdder();

	    this.em.addListener(event1.type, throwListener);
	    this.em.addListener(event2.type, normalListener);
	    this.em.pushEvent(event1.type, event1.value);
	    this.em.cycleEvents();

	    expect(event1.value.counter).to.equal(1);
	    expect(event2.value.counter).to.equal(1);
	});
    });
});