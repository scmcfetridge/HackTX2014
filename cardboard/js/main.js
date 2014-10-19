'use strict';

var camera, scene, renderer;
var effect, controls;
var element, container;
var info, palm, fingers = [];
var lastPoint = [];
lastPoint[0] = null;

var clock = new THREE.Clock();
var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

init();
animate();

function createLine(x1, y1, z1, x2, y2, z2) {
  var material = new THREE.LineBasicMaterial({
      color: 0x0000ff,
      linewidth: 20
  });

  var geometry = new THREE.Geometry();
    geometry.vertices.push(
        new THREE.Vector3(x1 + 30, y1 / 7, z1 + 50),
        new THREE.Vector3(x2 + 30, y2 / 7, z2 + 50)
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

function clearMe(scene){
    var obj, i;
    var camera, scene, renderer, light, mesh;
    for ( i = scene.children.length - 1; i >= 0 ; i -- ) {
        obj = scene.children[ i ];
        if ( obj !== scene && obj !== camera && obj !== light && obj !== mesh) {
            scene.remove(obj);
        }
    }
  
    camera = new THREE.PerspectiveCamera(90, 1, 0.001, 700);
  camera.position.set(0, 10, 0);
  scene.add(camera);
  
    var light = new THREE.HemisphereLight(0xffffff, 0x000000, 0.4);
  scene.add(light);

  var texture = THREE.ImageUtils.loadTexture(
    'textures/congruent_outline.png'
  );
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat = new THREE.Vector2(50, 50);
  //texture.anisotropy = renderer.getMaxAnisotropy();

  var material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    specular: 0xffffff,
    shininess: 20,
    shading: THREE.FlatShading,
    map: texture
  });
  //renderer.setClearColorHex( 0xa3a3a3, 1 );
  var geometry = new THREE.PlaneGeometry(1000, 1000);

  var mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2;
  scene.add(mesh);

};

function createBox(x, y, z, h) {
    var material = new THREE.MeshLambertMaterial({color: 0xFFFF00});
    var ka = 0.4;
    material.ambient.setRGB(material.color.r * ka, material.color.g * ka, material.color.b * ka);
    var box = new THREE.Mesh(new THREE.BoxGeometry(h, h, h), material);
    box.position.y = y;
    box.position.x = z/3;
    box.position.z = x;
    console.log ('actual ', x, y ,z);
    return box;
  }


function init() {
  renderer = new THREE.WebGLRenderer();
  element = renderer.domElement;
  container = document.getElementById('example');
  container.appendChild(element);

  effect = new THREE.StereoEffect(renderer, { separation: 0.3 });

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(90, 1, 0.001, 500);
  camera.position.set(-100, 30, 0);
  camera.lookAt(1, 0, 0);
  scene.add(camera);

  controls = new THREE.OrbitControls(camera, element);
  controls.rotateUp(Math.PI / 4);
  controls.target.set(
    camera.position.x + 0.1,
    camera.position.y,
    camera.position.z
  );
  
  
  controls.noZoom = true;
  controls.autoRotate = isMobile;
  controls.noPan = true;
  //controls.autoRotate = true;

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

  // var point1 = [60, 10, 90];
  // var point2 = [20, 30, 70];
  // var line = createLine(point1.x, point2);
  // scene.add(line);

  window.addEventListener('resize', resize, false);
  setTimeout(resize, 1);
}

var peer = new Peer({key: 'xf5d4rad9yffxbt9'});
peer.on('open', function(id){
  alert(JSON.stringify(id));
});

peer.on('connection', function(conn) {
  conn.on('data', function(data) {
    if (data.length == 4 ) {
    console.log('Received', data);
    var c = createBox(data.x, data.y / 5, data.z, 4);
    scene.add(c);
    // if (data[2] < 100 && data[2] > -100 && data[0] < 100 && data[0] > -100){
    // if (lastPoint[0] == null) {
    //   lastPoint[0] = data.x;
    //   lastPoint[1] = data.y;
    //   lastPoint[2] = data.z;
    // }
    // else if(!data.pinch) {
    //   lastPoint[0] = null;
    // }
    // else {
    //   var temp = createLine(data.x, data.y, data.z, lastPoint[0], lastPoint[1], lastPoint[2]);
    //   scene.add(temp);
    //   lastPoint[0] = data.x;
    //   lastPoint[1] = data.y;
    //   lastPoint[2] = data.z;
    // }
    // render();
  //}
  }
    else if (data.direction == 'next') {
      clearMe(scene);
      next();
    }
    else if (data.direction =='erase') {
      clearMe(scene);
    }
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
