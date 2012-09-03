/**
 * Helper functions for unit tests.
 */
var testing = {

    /**
     * Initializes casper to add helpful debugging hooks.
     */
    initialize: function _initialize(casper) {
	casper.on('page.error', function(msg, trace) {
	    this.echo("Error: " + msg);
	    for (var i = 0; i < trace.length; ++i) {
		this.echo('\t' + trace[i].file +
			  ': ' + trace[i].function +
			  ' line ' + trace[i].line);
	    }

	    this.die('Client Side Exception', 1);
	});
    },

    /**
     * Injects various libraries into page.
     */
    include: function _include(casper, includes) {
	var rootDir = 'public/javascripts/';
	for (var i = 0; i < includes.length; ++i) {
	    if(!casper.page.injectJs(rootDir + includes[i])) {
		casper.die('Could not find include "' + includes[i] + '"');
	    }
	}
    }
};

exports.testing = testing;