var camera, scene, renderer;
var geometry, material, cube, plane;
var controls;

var objects = [];

var raycaster;

var blocker = document.getElementById("blocker");
var overlay = document.getElementById("overlay");

var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

if (havePointerLock) {
	var element = document.body;
	var pointerlockchange = function (event) {
		if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
			controlsEnabled = true;
			controls.enabled = true;

			blocker.style.display = "none";
		} else {
			controls.enabled = false;

			blocker.style.display = "box";

			overlay.style.display = "";
		}
	};

	var pointerlockerror = function (event) {
		overlay.style.display = "";
	};

	document.addEventListener( 'pointerlockchange', pointerlockchange, false );
	document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
	document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

	document.addEventListener( 'pointerlockerror', pointerlockerror, false );
	document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
	document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

	overlay.addEventListener( 'click', function ( event ) {
		overlay.style.display = 'none';
		// Ask the browser to lock the pointer
			element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

		if ( /Firefox/i.test( navigator.userAgent ) ) {
			var fullscreenchange = function ( event ) {

				if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {

					document.removeEventListener( 'fullscreenchange', fullscreenchange );
					document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

					element.requestPointerLock();
				}

			};

			document.addEventListener( 'fullscreenchange', fullscreenchange, false );
			document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );
			element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

			element.requestFullscreen();

		} else {

			element.requestPointerLock();

		}

	}, false );
} else {
	overlay.innerHTML = "your browser does not support this WebGL experiment :("
}

init();
onWindowResize();
animate();

var controlsEnabled = false;

var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;
var jump = false;

var prevTime = performance.now();
var velocity = new THREE.Vector3();

function init() {
	camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 1000);

	scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0xffffff, 0, 750 );

	var light = new THREE.HemisphereLight(0xddddddff, 0x777788, 0.5)
	light.position.set(0.5, 1, 0.75);
	scene.add(light);

	dirLight = new THREE.DirectionalLight( 0xffffff, .025 );
	dirLight.name = 'Dir. Light';
	dirLight.position.set( 100, 100, 100 );
	dirLight.castShadow = true;
	dirLight.shadowCameraNear = camera.near;
	dirLight.shadowCameraFar = camera.far;
	dirLight.shadowCameraFov = 80;
	dirLight.shadowDarkness = .2;
	dirLight.shadowMapWidth = 2048;
	dirLight.shadowMapHeight = 2048;
	scene.add( dirLight );

	controls = new THREE.PointerLockControls(camera);
	scene.add(controls.getObject());

	var onKeyDown = function (event) {
		switch (event.keyCode) {
			case 38:
			case 87:
				moveForward = true;
				break;

			case 37:
			case 65:
				moveLeft = true;
				break;

			case 40:
			case 83:
				moveBackward = true;
				break;

			case 39:
			case 68:
				moveRight = true;
				break;

			case 32:
				jump = true;
				break;
		}
	};

	var onKeyUp = function (event) {
		switch(event.keyCode) {
			case 38:
			case 87:
				moveForward = false;
				break;

			case 37:
			case 65:
				moveLeft = false;
				break;

			case 40:
			case 83:
				moveBackward = false;
				break;

			case 39:
			case 68:
				moveRight = false;
				break;

			case 32:
				jump = false;
				break;
		}
	};

	document.addEventListener("keydown", onKeyDown, false);
	document.addEventListener("keyup", onKeyUp, false);

	raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10);

	geometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
	geometry.rotateX(-Math.PI / 2);

	for (var i = 0, l = geometry.vertices.length; i < 1; i++) {
		var vertex = geometry.vertices[i];
		vertex.x += Math.random() * 30 - 15;
		vertex.y += Math.random() * 10;
		vertex.z += Math.random() * 30 - 15;
	}

	material = new THREE.MeshLambertMaterial({color: 0xdddddd, emissive: 0x000000});

	plane = new THREE.Mesh(geometry, material);
	plane.receiveShadow = true;
	scene.add(plane);

	geometry = new THREE.BoxGeometry(40, 40, 40);
	material = new THREE.MeshPhongMaterial({specular: 0xffffff});
	var cube = new THREE.Mesh(geometry, material);
	cube.material.color.setHex(0xee4035);
	cube.position.x = 0;
	cube.position.y = 20;
	cube.position.z = 0;
	cube.castShadow = true;
	cube.receiveShadow = true;
	scene.add(cube);

	objects.push(cube);

	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setClearColor(0xffffff);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window,innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	document.body.appendChild(renderer.domElement);

	window.addEventListener("resize", onWindowResize, false);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
	requestAnimationFrame(animate);

	if (controlsEnabled) {
		raycaster.ray.origin.copy(controls.getObject().position);
		raycaster.ray.origin.y -= 10;

		var intersections = raycaster.intersectObjects(objects);

		var isOnObject = intersections.length > 0;

		var time = performance.now();

		var delta = (time - prevTime) / 1000;

		velocity.x -= velocity.x * 10.0 * delta;
		velocity.z -= velocity.z * 10.0 * delta;

		velocity.y -= 250.0 * delta;

		if (moveForward) velocity.z -= 400.0 * delta;
		if (moveBackward) velocity.z += 400.0 * delta;
		if (moveLeft) velocity.x -= 400.0 * delta;
		if (moveRight) velocity.x += 400.0 * delta;

		if (jump) {
			if (canJump) {
				velocity.y += 200;
				canJump = false;
				jump = false;
			} else {
				velocity.y += velocity.y / -100 + 10;
			}
		}

		if (isOnObject === true) {
			console.log("controls is on object");
			velocity.y = Math.max(0, velocity.y);
			canJump = true;
		}

		controls.getObject().translateX(velocity.x * delta);
		controls.getObject().translateY(velocity.y * delta);
		controls.getObject().translateZ(velocity.z * delta);

		if (controls.getObject().position.y < 10) {
			velocity.y = 0;
			controls.getObject().position.y = 10;
			canJump = true;
		}

		prevTime = time;
	}

	renderer.render(scene, camera);
}