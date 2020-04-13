const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const log = require('pino')({prettyPrint: true, level: 'debug'});

require('http').globalAgent.maxSockets = Infinity;

app.use('/', express.static('static'));

require("./server-io.js")(app, io);

http.listen(3000, function(){
  log.info({'listen': 'listening for connections on *:3000'});
});
