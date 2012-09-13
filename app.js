/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var blank = require('./routes/blank.js');
var signup = require('./routes/signup.js');
var http = require('http');
var path = require('path');
var config = require('./config').config;

var app = express();

app.configure(function(){
    app.set('port', config.app_port);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
    app.use(express.errorHandler());
    app.locals.pretty = true;
});

app.get('/', routes.index);
app.get('/blank', blank.blank);
app.get('/signup', signup.signup);

http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});
