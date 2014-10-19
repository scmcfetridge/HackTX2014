'use strict';

var peer = new Peer('desktop', {key: 'ehbbvg90n4xtj4i'});

var id = window.prompt("Enter ID");
var conn = peer.connect('game');
conn.send({});

conn.on('open', function(data) {
  Leap.loop({enableGestures: true}, function( frame ) {  
    // Pinching section
    if (frame.hands.length > 0) {
      var hand = frame.hands[0];
      if (hand.pinchStrength > 0.6) {
        // call function for drawing 
        var finger = hand.fingers[1];
        var position = finger.tipPosition;
        console.log(finger.tipPosition);

        // Add a circle at this position
        conn.send({x: position[0], y: position[1], z: position[2]});
      }
    }
  });
}
