function AssertException(message) { this.message = message; }

AssertException.prototype.toString = function () {
    return 'AssertException: ' + this.message;
}

var assert = function(exp, message) {
    if (!exp) {
	throw new AssertException(message);
    }
}

var assertions = {
    assertEqual: function(a, b) {
	assert(a == b, a + " does not equal " + b);
    }
}
    