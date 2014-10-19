'use strict';

var peer = new Peer({key: 'ehbbvg90n4xtj4i'});

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
      if (hand.pinchStrength > 0.6) {
        // call function for drawing 
        var finger = hand.fingers[1];
        var position = finger.tipPosition;
        console.log(finger.tipPosition);

        // Add a circle at this position
        conn.send({x: position[0], y: position[1], z: position[2]});
      }
    }
    if (frame.gestures.length > 0) {
        var swipeDirection;
        var action;
        for (var i = 0; i < frame.gestures.length; i++) {
          var gesture = frame.gestures[i];
          if(gesture.type == "swipe") {
              //Classify swipe as either horizontal or vertical
              var isHorizontal = Math.abs(gesture.direction[0]) > Math.abs(gesture.direction[1]);
              //Classify as right-left or up-down
              if(isHorizontal){
                  if(gesture.direction[0] > 0){
                      swipeDirection = "right";
                      action = "next";
                  } else {
                      swipeDirection = "left";
                      action = "next";
                  }
              } else { //vertical
                  if(gesture.direction[1] > 0){
                      swipeDirection = "up";
                      action = "erase";
                  } else {
                      swipeDirection = "down";
                      action = "erase";
                  }                  
              }
              console.log(swipeDirection);
              conn.send({direction: action});
           }
         }
      }
  });
});