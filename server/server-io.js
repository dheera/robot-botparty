const { RateLimiterMemory } = require('rate-limiter-flexible');
const log = require('pino')({prettyPrint: true, level: 'debug'});

module.exports = (app, io) => {

rooms = {};

const rateLimiter = new RateLimiterMemory(
  {
    points: 150,
    duration: 1,
  });

const keywords = ["connection", "connect", "disconnect", "reconnect", "subscribe", "unsubscribe", "publish"];

setInterval(() => {
    for(roomName in rooms) {
      console.log(roomName);
      for(i in rooms[roomName]) {
        if(!rooms[roomName][i]) { console.log("-"); continue; }
        if(!rooms[roomName][i].socket) { console.log("--"); continue; }
        console.log(rooms[roomName][i].socket.id);
      }
      console.log("");
    }
}, 5000);

io.on('connection', function(socket) {

  // close if client doesn't subscribe to anything in 3 seconds
  socket.connectionTimeout = setTimeout(() => {
    socket.disconnect(true);
  }, 3000);

  socket.subscriptions = [];

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

  socket.on('subscribe', async (roomName) => {
    log.info({'subscribe': {
      'socket.id': socket.id,
      'socket.ip': socket.ip,
      'roomName': roomName,
    }});
    try {
        await rateLimiter.consume(socket.handshake.address);
        if(socket.connectionTimeout) clearTimeout(socket.connectionTimeout);
	if(keywords.includes(roomName)) {
	    log.error({'subscribe.badRoomNameError': {'socket.id': socket.id, 'socket.ip': socket.ip}});
            return;
	}
	if(roomName.indexOf(".")!==-1) {
	    log.error({'subscribe.badRoomNameError': {'socket.id': socket.id, 'socket.ip': socket.ip}});
            return;
	}
        if(socket.subscriptions.length > 10) {
	   log.error({'subscribe.tooManySubscriptionsError': {'socket.id': socket.id, 'socket.ip': socket.ip}});
           socket.disconnect(true);
           return;
	}
        if(!(roomName in rooms)) {
            rooms[roomName] = [];
        }
        rooms[roomName].push({socket: socket});
        socket.subscriptions.push(roomName);

        log.info({[roomName + '.members']: rooms[roomName].map(s=>s.socket.id)});
        socket.emit(roomName + '.members', rooms[roomName].map(s=>s.socket.id));
    } catch(rejRes) {
        log.error({'subscribe.error': rejRes});
    }
  });

  socket.on('unsubscribe', async (roomName) => {
    log.info({'unsubscribe': {
      'socket.id': socket.id,
      'socket.ip': socket.ip,
      'roomName': roomName,
    }});

    try {
        await rateLimiter.consume(socket.handshake.address);
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
    } catch(rejRes) {
        log.error({'subscribe.error': rejRes});
    }
  });

  socket.on('publish', async (data) => {
    log.info({'publish': {
      'socket.id': socket.id,
      'socket.ip': socket.ip,
      'data': data,
    }});
    try {
        await rateLimiter.consume(socket.handshake.address);
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
    } catch(rejRes) {
        log.error({'subscribe.error': rejRes});
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
