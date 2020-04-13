let stream;

$(() => {
  navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  }).then(stream_ => {
    stream = stream_;
    // Display your local video in #localVideo element
    localVideo.srcObject = stream;
  }).catch(err => {
    if(err.name === "NotAllowedError") {
      $("#errorMessage").text("Please enable your camera and microphone and reload the page.").slideDown();
      $("input").hide();
      $("button").hide();
    } else if(err.name === "NotFoundError") {
      $("#errorMessage").text("Camera or microphone not found. Please ensure that you have one plugged in and reload the page.").slideDown();
      $("input").hide();
      $("button").hide();
    } else {
      $("#errorMessage").text(err.name + ": " + err.message).slideDown();
      $("input").hide();
      $("button").hide();
    }
  });

  $("#displayRoomName").text(roomName);

  $("#inputPassCode").on('keyup', function (e) {
    if (e.keyCode === 13) {
      verifyAuth(
        $("#inputPassCode").val(),
        () => {
          $("#panelJoin").hide();
        }, ()=> {
          console.log("authentication failure");
          $("#errorMessage").text("Bad passcode").slideDown().delay(2000).slideUp();
        }
      );
    }
  });

  $("#buttonJoin").click(()=>{
    verifyAuth(
      $("#inputPassCode").val(),
      () => {
        $("#panelJoin").hide();
      }, ()=> {
        console.log("authentication failure");
        $("#errorMessage").text("Bad passcode").slideDown().delay(2000).slideUp();
      }
    );
  });
});
