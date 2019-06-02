class Crop {
	static stateEnum = {
		SEED: 1,
		SPROUT: 2,
		YOUTH: 3,
		GROWN: 4,
	}

	constructor(data) {
        this.worldObject = new WorldObject({ type: "Crop", subtype: data.cropType, baseObject: this });
		this.blockPositionIndex = data.blockPositionIndex;
		this.cropTime = 0;
		this.currentState = Crop.stateEnum.SEED;
		this.cropCycle = Crop.getCropCycle(this.worldObject.objectSubtype);
		this.groundBlock = null;
		this.content = this.generateContent();
	}

	generateContent() {
		this.switchState(null, Crop.stateEnum.SEED);
	}

	switchState(oldState, newState) {
		if (oldState === newState) { return; }

		//  Destroy the old object
		this.removeCrop();

		//  Create the new object
		switch (newState) {
			case Crop.stateEnum.SEED:		this.createSeed(); 		break;
			case Crop.stateEnum.SPROUT:		this.createSprout(); 	break;
			case Crop.stateEnum.YOUTH:		this.createYouth(); 	break;
			case Crop.stateEnum.GROWN:		this.createGrown(); 	break;
		}

		this.currentState = newState;
	}

	removeCrop() { this.worldObject.clearMeshGroup(); }

	createSeed() {
		let cropSize = { x: 0.018, y: 0.009, z: 0.018 };
		let plotSize = GroundBlock.getPlotSize();
		let plotMiddleTop = GroundBlock.getTopMiddleDelta();
		plotMiddleTop.add((this.blockPositionIndex ? GroundBlock.getBlockPosition(this.blockPositionIndex) : (new THREE.Vector3())));
		let seedGeom = new THREE.BoxBufferGeometry(cropSize.x, cropSize.y, cropSize.z);

		let position1 = (new THREE.Vector3(plotSize.x / 4, 0, plotSize.z / 6)).add(plotMiddleTop);
		let seed1 = new THREE.Mesh(seedGeom, new THREE.MeshLambertMaterial({ color: Colors.Beans_Seed }));
		seed1.position.set(position1.x, position1.y, position1.z);
		seed1.worldObject = this.worldObject;
		this.worldObject.addToMeshGroup(seed1);

		let position2 = (new THREE.Vector3(-1 * plotSize.x / 8, 0, -1 * plotSize.z / 3)).add(plotMiddleTop);
		let seed2 = new THREE.Mesh(seedGeom, new THREE.MeshLambertMaterial({ color: Colors.Beans_Seed }));
		seed2.position.set(position2.x, position2.y, position2.z);
		seed2.worldObject = this.worldObject;
		this.worldObject.addToMeshGroup(seed2);

		let position3 = (new THREE.Vector3(-1 * plotSize.x / 6, 0, plotSize.z / 4)).add(plotMiddleTop);
		let seed3 = new THREE.Mesh(seedGeom, new THREE.MeshLambertMaterial({ color: Colors.Beans_Seed }));
		seed3.position.set(position3.x, position3.y, position3.z);
		seed2.worldObject = this.worldObject;
		this.worldObject.addToMeshGroup(seed3);
	}

	createSprout() {
		let cropSize = { x: 0.0144, y: 0.036, z: 0.0144 };
		let plotSize = GroundBlock.getPlotSize();
		let plotMiddleTop = GroundBlock.getTopMiddleDelta();
		plotMiddleTop.add((this.blockPositionIndex ? GroundBlock.getBlockPosition(this.blockPositionIndex) : (new THREE.Vector3())));
		let seedGeom = new THREE.BoxBufferGeometry(cropSize.x, cropSize.y, cropSize.z);

		let position1 = (new THREE.Vector3(plotSize.x / 4, 0, plotSize.z / 6)).add(plotMiddleTop);
		let seed1 = new THREE.Mesh(seedGeom, new THREE.MeshLambertMaterial({ color: Colors.Beans_Sprout }));
		seed1.position.set(position1.x, position1.y, position1.z);
		seed1.worldObject = this.worldObject;
		this.worldObject.addToMeshGroup(seed1);

		let position2 = (new THREE.Vector3(-1 * plotSize.x / 8, 0, -1 * plotSize.z / 3)).add(plotMiddleTop);
		let seed2 = new THREE.Mesh(seedGeom, new THREE.MeshLambertMaterial({ color: Colors.Beans_Sprout }));
		seed2.position.set(position2.x, position2.y, position2.z);
		seed2.worldObject = this.worldObject;
		this.worldObject.addToMeshGroup(seed2);

		let position3 = (new THREE.Vector3(-1 * plotSize.x / 6, 0, plotSize.z / 4)).add(plotMiddleTop);
		let seed3 = new THREE.Mesh(seedGeom, new THREE.MeshLambertMaterial({ color: Colors.Beans_Sprout }));
		seed3.position.set(position3.x, position3.y, position3.z);
		seed3.worldObject = this.worldObject;
		this.worldObject.addToMeshGroup(seed3);
	}

	createYouth() {
		let cropSize = { x: 0.0108, y: 0.072, z: 0.0108 };
		let plotSize = GroundBlock.getPlotSize();
		let plotMiddleTop = GroundBlock.getTopMiddleDelta();
		plotMiddleTop.add((this.blockPositionIndex ? GroundBlock.getBlockPosition(this.blockPositionIndex) : (new THREE.Vector3())));
		let seedGeom = new THREE.BoxBufferGeometry(cropSize.x, cropSize.y, cropSize.z);

		let position1 = (new THREE.Vector3(plotSize.x / 4, 0, plotSize.z / 6)).add(plotMiddleTop);
		let seed1 = new THREE.Mesh(seedGeom, new THREE.MeshLambertMaterial({ color: Colors.Beans_Youth }));
		seed1.position.set(position1.x, position1.y, position1.z);
		seed1.worldObject = this.worldObject;
		this.worldObject.addToMeshGroup(seed1);

		let position2 = (new THREE.Vector3(-1 * plotSize.x / 8, 0, -1 * plotSize.z / 3)).add(plotMiddleTop);
		let seed2 = new THREE.Mesh(seedGeom, new THREE.MeshLambertMaterial({ color: Colors.Beans_Youth }));
		seed2.position.set(position2.x, position2.y, position2.z);
		seed2.worldObject = this.worldObject;
		this.worldObject.addToMeshGroup(seed2);

		let position3 = (new THREE.Vector3(-1 * plotSize.x / 6, 0, plotSize.z / 4)).add(plotMiddleTop);
		let seed3 = new THREE.Mesh(seedGeom, new THREE.MeshLambertMaterial({ color: Colors.Beans_Youth }));
		seed3.position.set(position3.x, position3.y, position3.z);
		seed3.worldObject = this.worldObject;
		this.worldObject.addToMeshGroup(seed3);
	}

	createGrown() {
		let cropSize = { x: 0.0108, y: 0.144, z: 0.0108 };
		let plotSize = GroundBlock.getPlotSize();
		let plotMiddleTop = GroundBlock.getTopMiddleDelta();
		plotMiddleTop.add((this.blockPositionIndex ? GroundBlock.getBlockPosition(this.blockPositionIndex) : (new THREE.Vector3())));
		let seedGeom = new THREE.BoxBufferGeometry(cropSize.x, cropSize.y, cropSize.z);

		let position1 = (new THREE.Vector3(plotSize.x / 4, 0, plotSize.z / 6)).add(plotMiddleTop);
		let seed1 = new THREE.Mesh(seedGeom, new THREE.MeshLambertMaterial({ color: Colors.Beans_Grown }));
		seed1.position.set(position1.x, position1.y, position1.z);
		seed1.worldObject = this.worldObject;
		this.worldObject.addToMeshGroup(seed1);

		let position2 = (new THREE.Vector3(-1 * plotSize.x / 8, 0, -1 * plotSize.z / 3)).add(plotMiddleTop);
		let seed2 = new THREE.Mesh(seedGeom, new THREE.MeshLambertMaterial({ color: Colors.Beans_Grown }));
		seed2.position.set(position2.x, position2.y, position2.z);
		seed2.worldObject = this.worldObject;
		this.worldObject.addToMeshGroup(seed2);

		let position3 = (new THREE.Vector3(-1 * plotSize.x / 6, 0, plotSize.z / 4)).add(plotMiddleTop);
		let seed3 = new THREE.Mesh(seedGeom, new THREE.MeshLambertMaterial({ color: Colors.Beans_Grown }));
		seed3.position.set(position3.x, position3.y, position3.z);
		seed3.worldObject = this.worldObject;
		this.worldObject.addToMeshGroup(seed3);
	}

	update(timeDelta) {
		if (this.currentState === Crop.stateEnum.GROWN) { return; }

		this.cropTime += timeDelta;
		switch (this.currentState) {
			case Crop.stateEnum.YOUTH: 	if (this.cropCycle.grown <= this.cropTime) { this.switchState(Crop.stateEnum.YOUTH, Crop.stateEnum.GROWN); } 	break;
			case Crop.stateEnum.SPROUT: if (this.cropCycle.youth <= this.cropTime) { this.switchState(Crop.stateEnum.SPROUT, Crop.stateEnum.YOUTH); } 	break;
			case Crop.stateEnum.SEED: 	if (this.cropCycle.sprout <= this.cropTime) { this.switchState(Crop.stateEnum.SEED, Crop.stateEnum.SPROUT); } 	break;
			default:					console.log(`Crop state: ${this.currentState}`); this.switchState(null, Crop.stateEnum.SEED); 					break;
		}
	}

	static getCropCycle(cropType) {
		switch (cropType) {
			case "Beans": 		return { seed: 0, sprout: 3, youth: 6, grown: 9 };
			default:			return { seed: 0, sprout: 10, youth: 20, grown: 30 };
		}
	}
};