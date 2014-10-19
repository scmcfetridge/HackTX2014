'use strict';

var peer = new Peer({key: 'xf5d4rad9yffxbt9'});

var bx = 0;
var lx = 0;
var by = 0;
var ly = 0;
var bz = 0;
var lz = 0;

var id = window.prompt("Enter ID");
var conn = peer.connect(id);
conn.send({});

conn.on('data', function(data) {
  alert(data);
});

conn.on('open', function(){

  Leap.loop({enableGestures: true}, function( frame ) {  
    // Pinching section
    if (frame.hands.length > 0) {
      var hand = frame.hands[0];
      var finger = hand.fingers[1];
      var position = finger.tipPosition;
      console.log(finger.tipPosition);
      var pinchBool = hand.pinchStrength > 0.6;

      // Add a circle at this position
      conn.send({x: position[0], y: position[1], z: position[2], pinch: pinchBool});
      }

    //   if(position != null){
    //   if (bx > position[0]) bx = position[0];
    //   if (lx < position[0]) lx = position[0];
    //   if (by > position[1]) by = position[1];
    //   if (ly < position[1]) ly = position[1];
    //   if (bz > position[2]) bz = position[2];
    //   if (lz < position[2]) lz = position[2];
    // }
    //   console.log('bx ', bx);
    //   console.log('lx ', lx);
    //   console.log('by ', by);
    //   console.log('ly ', ly);
    //   console.log('bz ', bz);
    //   console.log('lz ', lz);
  });
});