var http = require('http');
var home = require('./cmds/home.js');

http.createServer(function(request, response) {
    homeCmd = new home.HomeCmd();
    homeCmd.route(request, response);
}).listen(8888);
