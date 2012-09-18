###
# Copyright 2012 Shawn Krisman
#
# This file is part of Nodelings.
#
# Nodelings is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# Nodelings is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
#
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with Nodelings.  If not, see <http://www.gnu.org/licenses/>.
###

###
# Module dependencies.
###

express = require('express');
routes = require('./routes');
blank = require('./routes/blank.js');
signup = require('./routes/signup.js');
tests = require('./routes/tests.js');
http = require('http');
path = require('path');
config = require('./config').config;

app = express();

app.configure ->
  app.set('port', config.app_port);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));


app.configure 'development', ->
  app.use(express.errorHandler());
  app.locals.pretty = true;

app.get('/', routes.index);
app.get('/blank', blank.blank);
app.get('/signup', signup.signup);
app.get('/tests', tests.tests);

http.createServer(app).listen app.get('port'), ->
  console.log("Express server listening on port " + app.get('port'));
