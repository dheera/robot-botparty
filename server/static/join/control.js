var touchCurrentX = 0;
var touchCurrentY = 0;

var touchStartX = 0;
var touchStartY = 0;

var touchInterval = null;
var touchLastTime = 0;

var lastStickTime = 0;

var currentX = 0;
var currentY = 0;

function initStick() {
  // pass
}

function moveStick(x, y) {
  lastStickTime = Date.now();
  currentX = x;
  currentY = y;
  $('.control-stick').css('-webkit-transform','translate(' + (100*currentX) + 'pt,' + (100*currentY) + 'pt)');
}

$(function() {
  $('.control-touch').bind('touchstart',function(e) {
    touchStartX = e.originalEvent.touches[0].clientX;
    touchStartY = e.originalEvent.touches[0].clientY;
    touchCurrentX = touchStartX;
    touchCurrentY = touchStartY;
    console.log('touch start: ' + touchStartX + ' ' + touchStartY);
    touchLastTime = Date.now();
    initStick();

    touchInterval = setInterval(function() {
      if(Date.now() - touchLastTime < 3000 && touchCurrentX !=0 && touchCurrentY !=0) {
        translationX = Math.floor(touchCurrentX - touchStartX) / $('.control-area')[0].clientWidth * 2;
        translationY = Math.floor(touchCurrentY - touchStartY) / $('.control-area')[0].clientHeight * 2;
        if(translationX > 1) translationX = 1;
        if(translationX < -1) translationX = -1;
        if(translationY > 1) translationY = 1;
        if(translationY < -1) translationY = -1;
        var marginSize = Math.abs(translationY)*0.1;
        if(translationX > 0) {
          translationX = Math.max(0, translationX - marginSize);
        }
        if(translationX < 0) {
          translationX = Math.min(0, translationX + marginSize);
        }
        moveStick(translationX, translationY);
      }
    }, 40);

  });

  $('.control-touch').bind('touchmove',function(e) {
    e.preventDefault();
    touchLastTime = Date.now();
    touchCurrentX = e.originalEvent.touches[0].clientX;
    touchCurrentY = e.originalEvent.touches[0].clientY;
  });

  $('.control-touch').bind('touchend', function(e) {
    touchCurrentX = 0;
    touchCurrentY = 0;
    moveStick(0, 0);
    clearInterval(touchInterval);
  });
  $('.control-touch').bind('touchleave', function(e) {
    touchCurrentX = 0;
    touchCurrentY = 0;
    moveStick(0, 0);
    clearInterval(touchInterval);
  });
  $('.control-touch').bind('touchcancel', function(e) {
    touchCurrentX = 0;
    touchCurrentY = 0;
    moveStick(0, 0);
    clearInterval(touchInterval);
  });

  $('.control-touch').bind('mousedown',function(e) {
    touchStartX = e.originalEvent.clientX;
    touchStartY = e.originalEvent.clientY;
    touchCurrentX = touchStartX;
    touchCurrentY = touchStartY;
    console.log('mouse start: ' + touchStartX + ' ' + touchStartY);
    touchLastTime = Date.now();
    initStick();

    touchInterval = setInterval(function() {
      if(Date.now() - touchLastTime < 3000 && touchCurrentX !=0 && touchCurrentY !=0) {
        translationX = Math.floor(touchCurrentX - touchStartX) / $('.control-area')[0].clientWidth * 2;
        translationY = Math.floor(touchCurrentY - touchStartY) / $('.control-area')[0].clientHeight * 2;
        if(translationX > 1) translationX = 1;
        if(translationX < -1) translationX = -1;
        if(translationY > 1) translationY = 1;
        if(translationY < -1) translationY = -1;
        var marginSize = Math.abs(translationY)*0.1;
        if(translationX > 0) {
          translationX = Math.max(0, translationX - marginSize);
        }
        if(translationX < 0) {
          translationX = Math.min(0, translationX + marginSize);
        }
        moveStick(translationX, translationY);
      }
    }, 40);
    isMouseDown = true;
  });

  $(window).bind('mousemove',function(e) {
    if(!isMouseDown) return;
    e.preventDefault();
    touchLastTime = Date.now();
    touchCurrentX = e.originalEvent.clientX;
    touchCurrentY = e.originalEvent.clientY;
  });

  $(window).bind('mouseup', function(e) {
    touchCurrentX = 0;
    touchCurrentY = 0;
    moveStick(0, 0);
    clearInterval(touchInterval);
    isMouseDown = false;
  });

  $(document).bind('mouseleave', function(e) {
    touchCurrentX = 0;
    touchCurrentY = 0;
    moveStick(0, 0);
    clearInterval(touchInterval);
    isMouseDown = false;
  });

});

var isMouseDown = false;

var currentKeyboardX = 0;
var currentKeyboardY = 0;

$(function() {
  $(document).on("keydown", function (e) {
    if(![37, 39, 38, 40].includes(e.which)) { return; }
    if(currentKeyboardX === 0 && currentKeyboardY === 0) {
      initStick();
    }
    if(e.which === 37) {
      currentKeyboardX -= 0.1;
    } else if(e.which === 39) {
      currentKeyboardX += 0.1;
    } else if(e.which === 38) {
      currentKeyboardY -= 0.1;
    } else if(e.which === 40) {
      currentKeyboardY += 0.1;
    } else {
      return;
    }
    if(currentKeyboardX > 0.5) currentKeyboardX = 0.5;
    if(currentKeyboardX < -0.5) currentKeyboardX = -0.5;
    if(currentKeyboardY > 0.5) currentKeyboardY = 0.5;
    if(currentKeyboardY < -0.5) currentKeyboardY = -0.5;
    moveStick(currentKeyboardX, currentKeyboardY);
  });

  $(document).on("keyup", function (e) {
    if(e.which === 37) {
      currentKeyboardX = 0;
    } else if(e.which === 39) {
      currentKeyboardX = 0;
    } else if(e.which === 38) {
      currentKeyboardY = 0;
    } else if(e.which === 40) {
      currentKeyboardY = 0;
    } else {
      return;
    }
    moveStick(currentKeyboardX, currentKeyboardY);
  });
});

$(()=>{
  setInterval(() => {
    if(socket && socket.connected && peerConnection && (peerConnection.connectionState==="connected" || peerConnection.iceConnectionState==="connected")) {
      sendMessage({"stick": [currentX, currentY, Date.now()]});
    }
  }, 100);
});
