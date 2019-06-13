class Crop {
	static stateEnum = {
		SEED: 1,
		SPROUT: 2,
		YOUTH: 3,
		GROWN: 4,
	}

	constructor(data) {
        this.worldObject = new WorldObject({ type: "crop", subtype: data.cropType, baseObject: this });
		this.currentState = Crop.stateEnum.SEED;
		this.indexXZ = data.indexXZ;
		this.growthTime = 0;
		this.growthCycle = Crop.getGrowthCycle(this.worldObject.objectSubtype);
		this.groundBlock = null;
		this.generateContent();
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
		let position = GroundBlock.getBlockPosition(this.indexXZ);
		let model = {};
		generateModel_BeansSeed(model, position);
		this.worldObject.addToMeshGroup(model.plant1);
		this.worldObject.addToMeshGroup(model.plant2);
		this.worldObject.addToMeshGroup(model.plant3);
	}

	createSprout() {
		let position = GroundBlock.getBlockPosition(this.indexXZ);
		let model = {};
		generateModel_BeansSprout(model, position);
		this.worldObject.addToMeshGroup(model.plant1);
		this.worldObject.addToMeshGroup(model.plant2);
		this.worldObject.addToMeshGroup(model.plant3);
	}

	createYouth() {
		let position = GroundBlock.getBlockPosition(this.indexXZ);
		let model = {};
		generateModel_BeansYouth(model, position);
		this.worldObject.addToMeshGroup(model.plant1);
		this.worldObject.addToMeshGroup(model.plant2);
		this.worldObject.addToMeshGroup(model.plant3);
	}

	createGrown() {
		let position = GroundBlock.getBlockPosition(this.indexXZ);
		let model = {};
		generateModel_BeansGrown(model, position);
		this.worldObject.addToMeshGroup(model.plant1);
		this.worldObject.addToMeshGroup(model.plant2);
		this.worldObject.addToMeshGroup(model.plant3);
	}

	update(timeDelta) {
		if (this.currentState === Crop.stateEnum.GROWN) { return; }

		this.growthTime += timeDelta;
		switch (this.currentState) {
			case Crop.stateEnum.YOUTH: 	if (this.growthCycle.grown <= this.growthTime) { this.switchState(Crop.stateEnum.YOUTH, Crop.stateEnum.GROWN); } 	break;
			case Crop.stateEnum.SPROUT: if (this.growthCycle.youth <= this.growthTime) { this.switchState(Crop.stateEnum.SPROUT, Crop.stateEnum.YOUTH); } 	break;
			case Crop.stateEnum.SEED: 	if (this.growthCycle.sprout <= this.growthTime) { this.switchState(Crop.stateEnum.SEED, Crop.stateEnum.SPROUT); } 	break;
			default:					console.log(`State: ${this.currentState}`); this.switchState(null, Crop.stateEnum.SEED); 							break;
		}
	}

	static getGrowthCycle(type) {
		switch (type) {
			case "beans": 		return { seed: 0, sprout: 3, youth: 6, grown: 9 };
			default:			return { seed: 0, sprout: 10, youth: 20, grown: 30 };
		}
	}
};