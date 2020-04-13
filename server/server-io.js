const log = require('pino')({prettyPrint: true, level: 'debug'});

module.exports = (app, io) => {

rooms = {};

io.on('connection', function(socket) {
  if(socket && socket.handshake && socket.handshake.headers) {
      if("x-real-ip" in socket.handshake.headers) {
        socket.ip = socket.handshake.headers["x-real-ip"];
      } else {
        socket.ip = socket.conn.remoteAddress;
      }
  }

  log.info({'connection': {
    'socket.id': socket.id,
    'socket.ip': socket.ip,
  }});

  socket.on('subscribe', (roomName) => {
    log.info({'subscribe': {
      'socket.id': socket.id,
      'socket.ip': socket.ip,
      'roomName': roomName,
    }});
    if(!(roomName in rooms)) {
      rooms[roomName] = [];
    }
    rooms[roomName].push({socket: socket});

    log.info({[roomName + '.members']: rooms[roomName].map(s=>s.socket.id)});
    socket.emit(roomName + '.members', rooms[roomName].map(s=>s.socket.id));
  });

  socket.on('unsubscribe', (roomName) => {
    log.info({'unsubscribe': {
      'socket.id': socket.id,
      'socket.ip': socket.ip,
      'roomName': roomName,
    }});

    if(!(roomName in rooms)) {
      rooms[roomName] = [];
    }

    for(i in rooms[roomName]) {
      if(!rooms[roomName][i]) continue;
      if(rooms[roomName][i].socket === socket) {
        delete(rooms[roomName][i]);
      }
    }
    rooms[roomName] = rooms[roomName].filter(el => el != null);
  });

  socket.on('publish', (data) => {
    log.info({'publish': {
      'socket.id': socket.id,
      'socket.ip': socket.ip,
      'data': data,
    }});
    if(!data.message) return;
    if(!data.roomName) return;
    if(!(data.roomName in rooms)) return;
    for(i in rooms[data.roomName]) {
      if(!rooms[data.roomName][i]) continue;
      if(!rooms[data.roomName][i].socket) continue;
      rooms[data.roomName][i].socket.emit(data.roomName + '.message', {
        sender: socket.id,
        message: data.message,
      });
    }
  });

  socket.on('disconnect', () => {
    log.info({'disconnect': {
      'socket.id': socket.id,
      'socket.ip': socket.ip,
    }});
    for(roomName in rooms) {
      for(i in rooms[roomName]) {
        if(!rooms[roomName][i]) continue;
        if(rooms[roomName][i].socket === socket) {
          delete(rooms[roomName][i]);
        }
      }
      rooms[roomName] = rooms[roomName].filter(el => el != null);
    }
  });
});

}
