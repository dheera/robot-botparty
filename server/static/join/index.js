// Generate random room name if needed
if (!location.hash) { location.hash = randomId(6); }

window.onhashchange = function() {
    window.location.reload();
}

// roomName from http://.../robot-party/#roomName
let roomName = location.hash.substring(1);

// Room name needs to be prefixed with 'observable-'
const configuration = {
  iceServers: [{
    urls: 'stun:stun.l.google.com:19302'
  }]
};

let room;
let peerConnection;
let dataChannel;

let socket = io("https://botparty.dheera.net/");

let droneRoomName = "";
let isOfferer;

function verifyAuth(passCode, onSuccess, onFailure) {
  droneRoomName = hash(roomName + "-" + passCode);

  // We're connected to the room and received an array of 'members'
  // connected to the room (including us). Signaling server is ready.
  socket.on(droneRoomName + '.members', members => {
    console.log('MEMBERS', members);
    // If we are the second user to connect to the room we will be creating the offer
    isOfferer = members.length === 2;

    if(isOfferer) {
      onSuccess();
      startWebRTC(isOfferer);
    } else {
      //socket.unsubscribe();
      onFailure();
    }
  });

  socket.emit("subscribe", droneRoomName);
}



function onSuccess() {};
function onError(error, data) {
  console.error(error, data);
};

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
    console.log("onicecandidate");
    if (event.candidate) {
      sendMessage({'candidate': event.candidate});
    }
  };

  // If user is offerer let the 'negotiationneeded' event create the offer
  if (isOfferer) {
    peerConnection.onnegotiationneeded = () => {
      console.log("onnegotiationneeded");
      peerConnection.createOffer().then(localDescCreated).catch(onError);
    }
  }

  // When a remote stream arrives display it in the #remoteVideo element
  peerConnection.ontrack = event => {
    console.log("ontrack");
    const stream = event.streams[0];
    if (!remoteVideo.srcObject || remoteVideo.srcObject.id !== stream.id) {
      remoteVideo.srcObject = stream;
    }
  };

  /* navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  }).then(stream => {
    // Display your local video in #localVideo element
    localVideo.srcObject = stream;
    // Add your stream to be sent to the conneting peer
    stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

  }, onError); */

  stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

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
    } else if(message.ping) {
      sendMessage({'pong': true});
    }
  });
}

function localDescCreated(desc) {
  console.log("localDescription", desc.sdp);
  peerConnection.setLocalDescription(
    desc,
    () => sendMessage({'sdp': peerConnection.localDescription}),
    onError
  );
}
