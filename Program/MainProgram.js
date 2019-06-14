let container = null;
let camera = null;
let controls = null;
let scene = null;
let renderer = null;

let statsBlock = null;
let mousePosition = new THREE.Vector2(10000, 10000), INTERSECTED;
let raycaster = new THREE.Raycaster();
let clock = new THREE.Clock();

let mouseOverObject = null;
let selectedObject = null;

let worldController = null;

function createScene() {
	scene = new THREE.Scene();
}

function createCamera() {
	let aspectRatio = window.innerWidth / window.innerHeight;
	let fieldOfView = 25;
	let nearPlane = 0.1;
	let farPlane = 1000; 

	//  Create a 3D camera, and set it behind the 0,0,0 position, aiming at it.
	camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
	camera.position.set(-5, 6, 8);
	camera.lookAt(new THREE.Vector3(0,0,0));
}

function createRenderer() {
	//  Create a WebGL renderer to render the scene through the camera
	renderer = new THREE.WebGLRenderer({canvas:canvas,alpha: true, antialias: true});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;
	renderer.shadowMapSoft = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	document.body.appendChild(renderer.domElement);
}

function createCameraControls() {
	//  Set the camera to be controllable by the mouse
	controls = new THREE.MapControls( camera, renderer.domElement );
	controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
	controls.dampingFactor = 0.99;
	controls.screenSpacePanning = false;
	controls.minDistance = 1;
	controls.maxDistance = 1000;
	controls.maxPolarAngle = Math.PI / 2;
}

function createStatsBlock() {
	statsBlock = new Stats();
	container.appendChild(statsBlock.dom);
}

function createTitleBar() {
	let mainUI = new MainUI();
	container.appendChild(mainUI.content);
}

function createCharacterMenu() {
	let charMenu = new CharacterMenu();
	container.appendChild(charMenu.content);
}

function createWorldController() {
	//  Create the world controller instance, and pass in the scene so it can use it directly
	worldController = new WorldController(scene);
}

function setEventListeners() {
	//  Add an event listener to keep track of screen size and ratio
	window.addEventListener( 'resize', () => {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
	
		renderer.setSize( window.innerWidth, window.innerHeight );
	}, false );

	//  Add an event listener to keep track of mouse position
	document.addEventListener( 'mousemove', (event) => {
		event.preventDefault();
		mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
		mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
	}, false );

	//  Add an event listener to keep track of mouse clicks
	window.addEventListener( 'mousedown', function( event ) {
		switch (event.button) {
			case 0: //  Left button
			{
				selectedObject = (mouseOverObject && mouseOverObject.objectType === "Character") ? mouseOverObject : null;
				
				if (selectedObject) {
					CharacterMenu.SetCharacter(selectedObject);
					CharacterMenu.ShowMenu();
				}
				else { CharacterMenu.HideMenu(); }

				let selectedObjectLabel = document.getElementById("SelectedTypeTitle");
				if (selectedObjectLabel) { selectedObjectLabel.innerText = selectedObject ? `Character selected: ${selectedObject.baseObject.name}` : null; }
			}
			break;

			case 1: //  Middle button
			{
				selectedObject = null;
				CharacterMenu.HideMenu();
				let selectedObjectLabel = document.getElementById("SelectedTypeTitle");
				if (selectedObjectLabel) { selectedObjectLabel.innerText = null; }
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

	document.addEventListener('keydown', function(event) {
		if (event.keyCode == 32) {
			if (selectedObject !== null) {
				ChooseCommandList.SetCharacter(selectedObject.baseObject);
				CreateCommandList.SetCharacter(selectedObject.baseObject);
				if (ChooseCommandList.IsMenuActive()) { return; }
				ChooseCommandList.ShowMenu();
			}
		}
	});

	animateProgram();
}

function rightClickObject(object) {
	let objectFullType = object.getFullType();
	switch (objectFullType) {
		case "groundblock - grass":
		case "groundblock - dirt":
		case "groundblock - tree":
		case "groundblock - crop":
		case "groundblock - bed":
		case "groundblock - water":
			{
				selectedObject.baseObject.commandToMove(mouseOverObject.baseObject.indexXZ, mouseOverObject.baseObject);
			}
			break;
		case "tree - basic":
		case "crop - beans":
		case "bed - basic":
			{
				selectedObject.baseObject.commandToMove(mouseOverObject.baseObject.indexXZ, mouseOverObject.baseObject.groundBlock);
			}
			break;
	}
}

function getFirstMouseIntersectObject() {
	raycaster.setFromCamera(mousePosition, camera);

	let intersects = raycaster.intersectObjects(scene.children, true);
	if (intersects.length === 0) { return null; }
	
	for (let i = 0; i < intersects.length; ++i) {
		if (intersects[i].object && intersects[i].object.worldObject) { 
			return intersects[i].object.worldObject; 
		}
	}
	return null;
}

function highlightFirstMouseIntersect() {
	if (CreateCommandList.IsMenuActive()) { return; }

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

function animateProgram() {
	requestAnimationFrame(animateProgram);

	let timeDelta = clock.getDelta();
	worldController.update(timeDelta);
	
	highlightFirstMouseIntersect();

	//controls.update();
	statsBlock.update();
}

function initialize() {
	//  Check if WebGL is available. If not, show a warning and exit out
	if ( !WEBGL.isWebGLAvailable() ) {
		let warning = WEBGL.getWebGLErrorMessage();
		document.getElementById('container').appendChild(warning);
		return;
	}
	
	//  Create the base container that the program will exist in
	container = document.createElement( 'div' );
	document.body.appendChild(container);
	
	createScene();
	createCamera();
	createRenderer();
	createCameraControls();

	createStatsBlock();
	createTitleBar();
	createCharacterMenu();
	createWorldController();

	setEventListeners();

	beginRender();
}

function beginRender() {
	let render = function() {
		requestAnimationFrame( render );
		renderer.render( scene, camera );
	};
	render();
}

//  Run the initialize function above
initialize();