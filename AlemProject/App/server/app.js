/**
 * Main application file
 */

'use strict';

import express from 'express';
import config from './config/environment';
import http from 'http';
var passport = require('passport');

// Setup server
var app = express();
var server = http.createServer(app);
require('./config/express')(app);
require('./routes')(app, passport);
require('./config/passport')(passport);

// Start server
function startServer() {
  server.listen(config.port, config.ip, function() {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  });
}

setImmediate(startServer);

// Expose app
exports = module.exports = app;
