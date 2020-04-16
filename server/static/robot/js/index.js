// Generate random room name if needed
if (!location.hash) {
  location.hash = makeid(6);
}

window.onhashchange = function() {
    window.location.reload();
}

let roomName = location.hash.substring(1);

function makeid(length) {
   var result           = '';
   var characters       = 'abcdefghijklmnpoqrstuvwxyz';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}
let hash = function(b){for(var a=0,c=b.length;c--;)a+=b.charCodeAt(c),a+=a<<10,a^=a>>6;a+=a<<3;a^=a>>11;return((a+(a<<15)&4294967295)>>>0).toString(16)};

let robotId;
let passCode;

function readSettings() {
  robotId = window.localStorage.getItem("robotId") || -1;
  passCode = window.localStorage.getItem("passCode") || "";
  droneRoomName =  hash(roomName + "-" + passCode);
}

let droneRoomName;
const configuration = {
  iceServers: [{
    urls: 'stun:stun.l.google.com:19302'
  }]
};
let socket;
let room;
let peerConnection;
let isOfferer = false;

function onSuccess() {};
function onError(error) {
  console.error(error);
};

function connectSocket() {
  if(socket) socket.disconnect();
  socket = io("https://botparty.dheera.net/");
  socket.on('connect', ()=>{
    socket.on(droneRoomName + '.members', members => {
      console.log('MEMBERS', members);
      // If we are the second user to connect to the room we will be creating the offer
      isOfferer = members.length === 2;
      // const isOfferer = false;
      startWebRTC(isOfferer);
      });

      socket.emit("subscribe", droneRoomName);
  });
}

// Send signaling data via Scaledrone
function sendMessage(message) {
  socket.emit('publish', {
    roomName: droneRoomName,
    message: message,
  });
}

function startWebRTC(isOfferer) {
  peerConnection = new RTCPeerConnection(configuration);

  // 'onicecandidate' notifies us whenever an ICE agent needs to deliver a
  // message to the other peer through the signaling server
  peerConnection.onicecandidate = event => {
    // console.log("onicecandidate", event);
    if (event.candidate) {
      sendMessage({'candidate': event.candidate});
    }
  };

  // If user is offerer let the 'negotiationneeded' event create the offer
  if (isOfferer) {
    peerConnection.onnegotiationneeded = () => {
      // console.log("onnegotiationneeded");
      peerConnection.createOffer().then(localDescCreated).catch(onError);
    }
  }

  // When a remote stream arrives display it in the #remoteVideo element
  peerConnection.ontrack = event => {
    //console.log("ontrack");
    const stream = event.streams[0];
    if (!remoteVideo.srcObject || remoteVideo.srcObject.id !== stream.id) {
      remoteVideo.srcObject = stream;
    }
    $("#panelLocalVideo").fadeOut();
  };

  peerConnection.onconnectionstatechange = event => {
    if(peerConnection.connectionState==="failed") {
      peerConnection.close();
      startWebRTC(isOfferer);
    }
  };

  navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  }).then(stream => {
    // Display your local video in #localVideo element
    localVideo.srcObject = stream;
    // Add your stream to be sent to the conneting peer
    stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
  }, onError);

  // Listen to signaling data from Scaledrone
  socket.on(droneRoomName + '.message', (data) => {
    // Message was sent by us
    if (data.sender === socket.id) {
      return;
    }

    const message = data.message;

    if (message.sdp) {
      console.log("remoteDescription", message.sdp);

      // This is called after receiving an offer or answer from another peer
      peerConnection.setRemoteDescription(new RTCSessionDescription(message.sdp), () => {
        // When receiving an offer lets answer it
        if (peerConnection.remoteDescription.type === 'offer') {
          peerConnection.createAnswer().then(localDescCreated).catch(onError);
        }
      }, onError);
    } else if (message.candidate) {
      // Add the new ICE candidate to our connections remote description
      peerConnection.addIceCandidate(
        new RTCIceCandidate(message.candidate), onSuccess, onError
      );
    } else if (message.stick) {
      console.log(message.stick);
      driveStick(message.stick);
    }
  });
}

let left_reversed = false;
let right_reversed = true;
let deadband = 0.3;

function applyDeadband(input) {
  if(input > 1.0) return 1.0;
  if(input < -1.0) return -1.0;
  let sign = Math.sign(input);
  let value = Math.abs(input);

  return sign * (deadband + (1.0 - deadband) * value);
}

function driveStick(stickValues) {
  let linear = -stickValues[1];
  let angular = -0.85*stickValues[0];
  console.log("linear", linear, "angular", angular);

  let motor_left = (linear - angular);
  let motor_right = (linear + angular);

  motor_left = 255*applyDeadband(motor_left);
  motor_right = 255*applyDeadband(motor_right);

  if(left_reversed) motor_left = -motor_left;
  if(right_reversed) motor_right = -motor_right;

  if(motor_left > 255) motor_left = 255;
  if(motor_left < -255) motor_left = -255;
  if(motor_right > 255) motor_right = 255;
  if(motor_right < -255) motor_right = -255;

  command = "G ";

  if(motor_right >= 0) command += Math.round(motor_right) + " 0 ";
  else command += "0 " + Math.round(-motor_right) + " ";

  if(motor_left >= 0) command += Math.round(motor_left) + " 0 ";
  else command += "0 " + Math.round(-motor_left) + " ";

  console.log(command);
  send(command);
}

function localDescCreated(desc) {
  console.log("localDescription", desc.sdp);
  peerConnection.setLocalDescription(
    desc,
    () => sendMessage({'sdp': peerConnection.localDescription}),
    onError
  );
}

var serviceuuid = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
var CHARACTERISTIC_UUID_RX = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E";
var CHARACTERISTIC_UUID_TX = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E";

console.log("Service uuid: " + serviceuuid.toLowerCase());
console.log("CHARACTERISTIC_UUID_RX: " + CHARACTERISTIC_UUID_RX.toLowerCase());

const terminal = new BluetoothTerminal(
    serviceuuid.toLowerCase(),
    CHARACTERISTIC_UUID_TX.toLowerCase(),
    CHARACTERISTIC_UUID_RX.toLowerCase(),
'\n','\n');

terminal.receive = function(data) {
  console.log(data);
};

// Implement own send function to log outcoming data to the terminal.
const send = (data) => {
  terminal.send(data).
      then(() => console.log(data)).
      catch((error) => console.log(error));
};

function connectBluetooth() {
  terminal.disconnect();
  terminal.connect().
    then(() => {
      console.log("connected to " + (terminal.getDeviceName() ? terminal.getDeviceName() : defaultDeviceName));
    });
}

$(()=>{
  readSettings();
  connectSocket();
})
