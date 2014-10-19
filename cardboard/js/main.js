'use strict';

var camera, scene, renderer;
var effect, controls;
var element, container;
var info, palm, fingers = [];

var clock = new THREE.Clock();

init();
animate();

function createLine() {
  var material = new THREE.LineBasicMaterial({
      color: 0x0000ff
  });

  var geometry = new THREE.Geometry();
  geometry.vertices.push(
      new THREE.Vector3(-100, 800, 0),
      new THREE.Vector3(0, 100, 200),
      new THREE.Vector3(140, 0, 100)
  );

  var line = new THREE.Line( geometry, material );

  return line;
}

function init() {
  renderer = new THREE.WebGLRenderer();
  element = renderer.domElement;
  container = document.getElementById('example');
  container.appendChild(element);

  effect = new THREE.StereoEffect(renderer, { separation: 0.3 });

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(90, 1, 0.001, 700);
  camera.position.set(0, 10, 0);
  scene.add(camera);

  controls = new THREE.OrbitControls(camera, element);
  controls.rotateUp(Math.PI / 4);
  controls.target.set(
    camera.position.x + 0.1,
    camera.position.y,
    camera.position.z
  );
  controls.noZoom = true;
  controls.noPan = true;
  controls.autoRotate = true;

  function setOrientationControls(e) {
    if (!e.alpha) {
      return;
    }

    controls = new THREE.DeviceOrientationControls(camera, true);
    controls.connect();
    controls.update();

    element.addEventListener('click', fullscreen, false);

    window.removeEventListener('deviceorientation', setOrientationControls);
  }
  window.addEventListener('deviceorientation', setOrientationControls, true);


  var light = new THREE.HemisphereLight(0xffffff, 0x000000, 0.4);
  scene.add(light);

  var texture = THREE.ImageUtils.loadTexture(
    'textures/congruent_outline.png'
  );
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat = new THREE.Vector2(50, 50);
  texture.anisotropy = renderer.getMaxAnisotropy();

  var material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    specular: 0xffffff,
    shininess: 20,
    shading: THREE.FlatShading,
    map: texture
  });
renderer.setClearColorHex( 0xa3a3a3, 1 );
  var geometry = new THREE.PlaneGeometry(1000, 1000);

  var mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2;
  scene.add(mesh);
  // palm
    geometry = new THREE.BoxGeometry( 100, 20, 80 );
    material = new THREE.MeshNormalMaterial();
    palm = new THREE.Mesh( geometry, material );
    palm.position.x = 100;
    palm.position.y = 25;
    palm.position.z = -100;
    palm.castShadow = true;
    palm.receiveShadow = true;
    scene.add( palm );

    // fingers
    geometry = new THREE.BoxGeometry( 16, 12, 1 );
    for (var i = 0; i < 5; i++) {
      mesh = new THREE.Mesh( geometry, material );
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add( mesh );
      fingers.push( mesh );
    }

  var line = createLine();
  scene.add(line);
  
  window.addEventListener('resize', resize, false);
  setTimeout(resize, 1);
}

Leap.loop( function( frame ) {
    var hand, direction, len;
    if ( frame.hands.length > 0) {
      hand = frame.hands[0];
      palm.position.set( hand.stabilizedPalmPosition[0], hand.stabilizedPalmPosition[1], hand.stabilizedPalmPosition[2] );
      direction = new THREE.Vector3(hand.direction[0], hand.direction[1], hand.direction[2] );  // best so far
      palm.lookAt( direction.add( palm.position ) );
      palm.rotation.z = -hand.roll();
      //palm.rotation.set( hand.pitch(), -hand.yaw(), hand.roll() );
      palm.visible = true;

      data.innerHTML = 'Hand X:' + hand.stabilizedPalmPosition[0].toFixed(0) + ' Y:' +  hand.stabilizedPalmPosition[1].toFixed(0) + ' Z:' + hand.stabilizedPalmPosition[2].toFixed(0);

    } else {
      palm.visible = false;
    }

    len = frame.pointables.length;
    if ( len > 0) {
      var pointable;
      palm.hasFingers = true;
      for (var i = 0; i < 5; i++) {
        finger = fingers[i];
        if ( i < len ) {
          pointable = frame.pointables[i];
          finger.position.set( pointable.stabilizedTipPosition[0], pointable.stabilizedTipPosition[1], pointable.stabilizedTipPosition[2] );
          direction = v( pointable.direction[0], pointable.direction[1], pointable.direction[2]);
          finger.lookAt( direction.add( finger.position ) );
          finger.scale.z = pointable.length;
          finger.visible = true;
        } else {
          finger.visible = false;
        }
      }
    } else if ( palm.hasFingers ) {
      for (var i = 0; i < 5; i++) {
        fingers[i].visible = false;
      }
      palm.hasFingers = false;
    }
  });

function resize() {
  var width = container.offsetWidth;
  var height = container.offsetHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  effect.setSize(width, height);
}

function update(dt) {
  resize();

  camera.updateProjectionMatrix();

  controls.update(dt);
}

function render(dt) {
  effect.render(scene, camera);
}

function animate(t) {
  requestAnimationFrame(animate);

  update(clock.getDelta());
  render(clock.getDelta());
}

function fullscreen() {
  if (container.requestFullscreen) {
    container.requestFullscreen();
  } else if (container.msRequestFullscreen) {
    container.msRequestFullscreen();
  } else if (container.mozRequestFullScreen) {
    container.mozRequestFullScreen();
  } else if (container.webkitRequestFullscreen) {
    container.webkitRequestFullscreen();
  }

}
