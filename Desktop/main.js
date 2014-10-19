'use strict';

var peer = new Peer({key: 'ehbbvg90n4xtj4i'});

var id = window.prompt("Enter ID");
var conn = peer.connect(id);
conn.send({x: "thisthing"});

conn.on('data', function(data) {
  alert(data);
});

Leap.loop({enableGestures: true}, function( frame ) {  
    conn.send({x: 10, y: 100, z: 10});
  // Pinching section
  if (frame.hands.length > 0) {
    var hand = frame.hands[0];
    if (hand.pinchStrength > 0.6) {
      // call function for drawing 
      var finger = hand.fingers[1];
      var position = finger.tipPosition;
      console.log("Yo position wow", finger.tipPosition);

      // Add a circle at this position
      conn.send({x: position[0], y: position[1], z: position[2]});
    }
  }
});
