var container, stats;
var camera, controls, scene, renderer;
var objects = [];
var mouse = new THREE.Vector2(), INTERSECTED;
var radius = 100, theta = 0;
var raycaster = new THREE.Raycaster();
var mouseOverObject = null;

init();

function createInitialScene() {
	//  Create a basic scene with a background color and an embient light value
	scene = new THREE.Scene();
	scene.background = new THREE.Color(0xf0f0f0);
	scene.add(new THREE.AmbientLight(0x505050));
	
	//  Add a new spotlight shining over all objects in the scene
	var light = new THREE.SpotLight(0xffffff, 1.5);
	light.position.set(0, 500, 2000);
	light.angle = Math.PI / 9;

	//  Define the light shadow, so that dynamic shadows can generate
	light.castShadow = true;
	light.shadow.camera.near = 1000;
	light.shadow.camera.far = 4000;
	light.shadow.mapSize.width = 1024;
	light.shadow.mapSize.height = 1024;
	scene.add(light);
}

function createTestGeometry() {
	//  Create a flyweight geometry object to copy into objects
	var geometry = new THREE.BoxBufferGeometry( 40, 40, 40 );

	//  Copy it into a large number of objects, randomly determining each objects color, rotation, and scale
	for ( var i = 0; i < 200; i ++ ) {
		var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: "rgb(" + parseInt(Math.random() * 255).toString() + ", " + parseInt(Math.random() * 255).toString() + ", " + parseInt(Math.random() * 255).toString() + ")" /*Math.random() * 0xffffff*/ } ) );

		object.position.x = Math.random() * 1000 - 500;
		object.position.y = Math.random() * 600 - 300;
		object.position.z = Math.random() * 800 - 400;

		object.rotation.x = Math.random() * 2 * Math.PI;
		object.rotation.y = Math.random() * 2 * Math.PI;
		object.rotation.z = Math.random() * 2 * Math.PI;

		object.scale.x = Math.random() * 2 + 1;
		object.scale.y = Math.random() * 2 + 1;
		object.scale.z = Math.random() * 2 + 1;

		object.castShadow = true;
		object.receiveShadow = true;

		//  Add each object to the scene and objects list
		scene.add(object);
		objects.push(object);
	}
}

function createCameraAndRenderer() {
	//  Create a 3D camera, and set it behind the 0,0,0 position, aiming at it.
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 5000 );
	camera.position.z = 1000;

	//  Set the camera to be controllable by the mouse
	controls = new THREE.TrackballControls( camera );
	controls.rotateSpeed = 1.0;
	controls.zoomSpeed = 1.2;
	controls.panSpeed = 0.8;
	controls.noZoom = false;
	controls.noPan = false;
	controls.staticMoving = true;
	controls.dynamicDampingFactor = 0.3;

	//  Create a WebGL renderer to render the scene through the camera
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);

	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFShadowMap;

	container.appendChild(renderer.domElement);
	
	//  Set the controls on both the camera and objects list
	var dragControls = new THREE.DragControls( objects, camera, renderer.domElement );
	dragControls.addEventListener('dragstart', function (e) { controls.enabled = false; });
	dragControls.addEventListener('dragend', function (e) { controls.enabled = true; });
}

function createTitleBar() {
	//  Create the title bar at the top of the screen
	var info = document.createElement( 'div' );
	info.style.position = 'absolute';
	info.style.top = '10px';
	info.style.width = '100%';
	info.style.textAlign = 'center';
	info.innerHTML = '<a href="http://threejs.org" target="_blank" rel="noopener">three.js</a> webgl - draggable cubes';
	container.appendChild( info );
}

function createStatsBlock() {
	stats = new Stats();
	container.appendChild(stats.dom);
}

function init() {
	if ( !WEBGL.isWebGLAvailable() ) {
		var warning = WEBGL.getWebGLErrorMessage();
		document.getElementById( 'container' ).appendChild( warning );
		return;
	}
	
	container = document.createElement( 'div' );
	document.body.appendChild( container );
	
	createInitialScene();
	
	createTestGeometry();
	
	createCameraAndRenderer();

	createTitleBar();
	
	createStatsBlock();
	
	//  Add an event listener to keep track of screen size and ratio
	window.addEventListener( 'resize', onWindowResize, false );
	
	//  Add an event listener to keep track of mouse position
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	
	animate();
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentMouseMove( event ) {
	event.preventDefault();
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function highlightFirstMouseIntersect() {
	raycaster.setFromCamera( mouse, camera );
	var intersects = raycaster.intersectObjects( scene.children );
	
	if (intersects.length === 0) { 
		if (mouseOverObject) { mouseOverObject.material.emissive.setHex(mouseOverObject.savedHex); }
		mouseOverObject = null;
		return;
	}
	
	//  If we haven't already selected this object, select it as the mouse over object and highlight it
	if (mouseOverObject !== intersects[0].object) {
		//  If we already have a highlighted object, de-highlight it
		if (mouseOverObject) { mouseOverObject.material.emissive.setHex(mouseOverObject.savedHex); }
		
		//  "Select" the new object and highlight it, saving off the old color for later
		mouseOverObject = intersects[0].object;
		mouseOverObject.savedHex = mouseOverObject.material.emissive.getHex();
		mouseOverObject.material.emissive.setHex( 0xff0000 );
	}
}

function animate() {
	requestAnimationFrame(animate);
	
	highlightFirstMouseIntersect();

	render();
	stats.update();
}

function render() {
	controls.update();
	
	renderer.render(scene, camera);
}