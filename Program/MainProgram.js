var container, stats;
var camera, controls, scene, renderer;
var draggableObjects = [];
var mouse = new THREE.Vector2(10000, 10000), INTERSECTED;
var radius = 100, theta = 0;
var raycaster = new THREE.Raycaster();
var mouseOverObject = null;
var selectedObject = null;
var clock = new THREE.Clock();

let testWorld = null;
let characterInventory = null;

init();

function createCameraAndRenderer() {
	//  Create a 3D camera, and set it behind the 0,0,0 position, aiming at it.
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 5000 );
	camera.position.y = 1000;
	camera.position.z = 1000;

	//  Create a WebGL renderer to render the scene through the camera
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);

	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFShadowMap;

	//  Set the camera to be controllable by the mouse
	controls = new THREE.MapControls( camera, renderer.domElement );
	controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
	controls.dampingFactor = 0.99;
	controls.screenSpacePanning = false;
	controls.minDistance = 100;
	controls.maxDistance = 1000;
	controls.maxPolarAngle = Math.PI / 2;

	container.appendChild(renderer.domElement);
}

function createTitleBar() {
	//  Create the title bar at the top of the screen
	var info = document.createElement( 'div' );
	info.id = "TopScreenTitle",
	info.style.position = 'absolute';
	info.style.top = '10px';
	info.style.width = '100%';
	info.style.textAlign = 'center';
	info.innerHTML = '<a href="https://github.com/DrewBanyai/ThreeJSTest" target="_blank" rel="noopener">Basic THREE.js test</a>';
	container.appendChild( info );
	
	//  Create the object type label at the top of the screen
	var objectType = document.createElement( 'div' );
	objectType.id = "ObjectTypeTitle",
	objectType.style.position = 'absolute';
	objectType.style.top = '30px';
	objectType.style.width = '100%';
	objectType.style.textAlign = 'center';
	objectType.innerHTML = "";
	container.appendChild( objectType );
	
	//  Create the object type label at the top of the screen
	var selectedType = document.createElement( 'div' );
	selectedType.id = "SelectedTypeTitle",
	selectedType.style.position = 'absolute';
	selectedType.style.top = '50px';
	selectedType.style.width = '100%';
	selectedType.style.textAlign = 'center';
	selectedType.innerHTML = "";
	container.appendChild( selectedType );
	
	//  Create the day time label at the top of the screen
	var dayTimeLabel = document.createElement( 'div' );
	dayTimeLabel.id = "SelectedTypeTitle",
	dayTimeLabel.style.position = 'absolute';
	dayTimeLabel.style.top = '50px';
	dayTimeLabel.style.left = "800px";
	dayTimeLabel.style.width = '100%';
	dayTimeLabel.style.textAlign = 'center';
	dayTimeLabel.innerHTML = "TEST";
	container.appendChild( dayTimeLabel );
}

function createCharacterInventory() {
	characterInventory = new CharacterInventory();
	container.appendChild(characterInventory.content);
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
	
	testWorld = new TestWorld({ backgroundColor: "rgb(240, 240, 240)", ambientLightColor: "rgb(222, 222, 222)" });
	
	createCameraAndRenderer();

	createTitleBar();

	createCharacterInventory();
	
	createStatsBlock();
	
	//  Add an event listener to keep track of screen size and ratio
	window.addEventListener( 'resize', onWindowResize, false );
	
	//  Add an event listener to keep track of mouse position
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );

	window.addEventListener( 'mousedown', function( event ) {
		switch (event.button) {
			case 0: //  Left button
			{
				selectedObject = (mouseOverObject && mouseOverObject.objectType === "Character") ? mouseOverObject : null;
				//characterInventory.content.style.visibility = selectedObject ? "visible" : "hidden";
				let selectedObjectLabel = document.getElementById("SelectedTypeTitle");
				if (selectedObjectLabel) { selectedObjectLabel.innerText = selectedObject ? "Character selected" : null; }
			}
			break;

			case 1: //  Middle button
			{
				selectedObject = null;
				//characterInventory.content.style.visibility = "hidden";
				let selectedObjectLabel = document.getElementById("SelectedTypeTitle");
				if (selectedObjectLabel) { selectedObjectLabel.innerText = selectedObject ? "Character selected" : null; }
			}
			break;

			case 2: //  Right button
			{
				if (selectedObject === null) { return; }
				if (mouseOverObject === null) { return; }
				if (selectedObject.objectType !== "Character") { return; }
				rightClickObject(mouseOverObject);
			}
			break;
		}
	});
	
	animate();
}

function rightClickObject(object) {
	let objectFullType = object.getFullType();
	switch (objectFullType) {
		case "GroundBlock - Grass":
		case "GroundBlock - Dirt":
		case "GroundBlock - Tree":
			{
				let groundBlockPos = mouseOverObject.baseObject.content.position;
				let additive = GroundBlock.getTopMiddleDelta();
				selectedObject.baseObject.commandToMove(additive.add(groundBlockPos), mouseOverObject.baseObject);
			}
			break;
		case "Tree - Basic":
			{
				let groundBlockPos = mouseOverObject.baseObject.groundBlock.content.position;
				let additive = GroundBlock.getTopMiddleDelta();
				selectedObject.baseObject.commandToMove(additive.add(groundBlockPos), mouseOverObject.baseObject.groundBlock);
			}
			break;
	}
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

function getFirstMouseIntersectObject() {
	raycaster.setFromCamera( mouse, camera );

	let intersects = raycaster.intersectObjects(testWorld.scene.children);
	if (intersects.length === 0) { return null; }
	let object = intersects[0].object;
	if (!object || !object.worldObject) { return null; }

	return object.worldObject;
}

function highlightFirstMouseIntersect() {
	let intersectObject = getFirstMouseIntersectObject();

	if (intersectObject === null) { 
		if (mouseOverObject) { mouseOverObject.dehighlightObject(); }
		mouseOverObject = null;
		let objectTypeTitle = document.getElementById("ObjectTypeTitle");
		if (objectTypeTitle) { objectTypeTitle.innerText = ""; }
		return;
	}

	//  If we haven't already selected this object, select it as the mouse over object and highlight it
	if (mouseOverObject !== intersectObject) {
		//  If we already have a highlighted object, de-highlight it
		if (mouseOverObject) { mouseOverObject.dehighlightObject(); }
		
		//  Save off the new object and highlight it
		mouseOverObject = intersectObject;
		mouseOverObject.highlightObject();

		let objectTypeTitle = document.getElementById("ObjectTypeTitle");
		if (objectTypeTitle) { objectTypeTitle.innerText = mouseOverObject.objectType ? (mouseOverObject.getFullType()) : ""; }
	}
}

function animate() {
	requestAnimationFrame(animate);

	let deltaTime = clock.getDelta();
	testWorld.characters.forEach((character) => character.update(deltaTime));
	testWorld.update(deltaTime);
	
	highlightFirstMouseIntersect();

	render();
	stats.update();
}

function render() {
	controls.update();
	
	renderer.render(testWorld.getScene(), camera);
}