/*
 * Handles all arbitrary events.
 */

var EventManager = function() {
    this.eventQueue = [];
    this.listenerMap = {}
}

EventManager.prototype = {

    pushEvent: function(type, value) {
	this.eventQueue.push({'type' : type, 'value' : value});
    },

    addListener: function(type, listener) {
	if (this.listenerMap[type]) {
	    this.listenerMap[type].push(listener);
	} else {
	    this.listenerMap[type] = [listener];
	}
    },

    cycleEvents: function() {
	while (this.eventQueue.length != 0) {
	    var event = this.eventQueue.shift();
	    var listeners = this.listenerMap[event.type];
	    if (listeners) {
		for (var i = 0; i < listeners.length; i++) {
		    listeners[i].react(event);
		}
	    }
	}
    }
}

exports.EventManager = EventManager;