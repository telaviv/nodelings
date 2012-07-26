homeCmdPrototype = {
    route : function(request, response) {
	response.writeHead(200, {"Content-Type": "text/plain"});
	response.write("Hello World");
	response.end();
    }
}

HomeCmd = function() {
    return Object.create(homeCmdPrototype);
}

exports.HomeCmd = HomeCmd