'use strict';

var camera, scene, renderer;
var effect, controls;
var element, container;
var info, palm, fingers = [];
var lastPoint = null;

var clock = new THREE.Clock();

init();
animate();

function createLine(point1, point2) {
  var material = new THREE.LineBasicMaterial({
      color: 0x0000ff,
      linewidth: 20
  });

  var geometry = new THREE.Geometry();
    geometry.vertices.push(
        new THREE.Vector3(point1[0], point1[1], point1[2]),
        new THREE.Vector3(point2[0], point2[1], point2[2])
    );

  var line = new THREE.Line( geometry, material );

  return line;
}

function createBall(x, y, z, r) {
    var material = new THREE.MeshLambertMaterial({color: 0x00FF66});
    var ka = 0.4;
    material.ambient.setRGB(material.color.r * ka, material.color.g * ka, material.color.b * ka);
    var sphere = new THREE.Mesh(new THREE.SphereGeometry(r, r * 5, r * 5), material);
    sphere.position.y = y / 7.5;
    sphere.position.x = z + 10;
    sphere.position.z = x + 75;
    return sphere;
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
  controls.noPan = false;
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

  var point1 = [60, 10, 90];
  var point2 = [20, 30, 70];
  var line = createLine(point1, point2);
  scene.add(line);

  window.addEventListener('resize', resize, false);
  setTimeout(resize, 1);
}

var peer = new Peer('mobile', {key: 'ehbbvg90n4xtj4i'});
peer.on('open', function(id){
  console.log("Connected");
});

peer.on('connection', function(conn) {
  conn.on('data', function(data) {
    console.log('Received', data);
    // if (lastPoint == null) {
    //   lastPoint = data;
    // }
    // else {
    //   var temp = createLine(data, lastPoint);
    //   scene.add(temp);
    //   lastPoint = data;
    // }
    // render();
  });
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
