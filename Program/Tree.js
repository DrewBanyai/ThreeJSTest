class Tree {
	static stateEnum = {
		SPROUT: 1,
		SAPLING: 2,
		YOUTH: 3,
		GROWN: 4,
	}

	constructor(data) {
        this.worldObject = new WorldObject({ type: "tree", subtype: "basic", baseObject: this });
		this.currentState = Tree.stateEnum.SPROUT;
		this.growthCycle = Tree.getGrowthCycle(this.worldObject.objectType);
		this.growthTime = 0;
		this.indexXZ = data.indexXZ;
		this.height = data.height;
		this.groundBlock = null;
		this.shadow = null;
		this.generateContent();
	}

	generateContent() {
		let position = GroundBlock.getBlockPosition(this.indexXZ);
		let model = {};
		generateModel_TreeSeed(model, position);

		this.worldObject.addToMeshGroup(model.trunk);
		this.worldObject.addToMeshGroup(model.tree);
		this.worldObject.addToMeshGroup(model.shadow);

		//  Save off the shadow
		this.shadow = model.shadow;

		return null;
	}

	switchState(oldState, newState) {
		if (oldState === newState) { return; }

		//  Destroy the old object
		this.removeTree();

		//  Create the new object
		switch (newState) {
			case Tree.stateEnum.SPROUT:		this.createSeed(); 		break;
			case Tree.stateEnum.SAPLING:	this.createSprout(); 	break;
			case Tree.stateEnum.YOUTH:		this.createYouth(); 	break;
			case Tree.stateEnum.GROWN:		this.createGrown(); 	break;
		}

		this.currentState = newState;
	}

	removeTree() { this.worldObject.clearMeshGroup(); }

	createSeed() {
		let position = GroundBlock.getBlockPosition(this.indexXZ);
		let model = {};
		generateModel_TreeSeed(model, position);
		this.worldObject.addToMeshGroup(model.trunk);
		this.worldObject.addToMeshGroup(model.tree);
	}

	createSprout() {
		let position = GroundBlock.getBlockPosition(this.indexXZ);
		let model = {};
		generateModel_TreeSprout(model, position);
		this.worldObject.addToMeshGroup(model.trunk);
		this.worldObject.addToMeshGroup(model.tree);
	}

	createYouth() {
		let position = GroundBlock.getBlockPosition(this.indexXZ);
		let model = {};
		generateModel_TreeYouth(model, position);
		this.worldObject.addToMeshGroup(model.trunk);
		this.worldObject.addToMeshGroup(model.tree);
	}

	createGrown() {
		let position = GroundBlock.getBlockPosition(this.indexXZ);
		let model = {};
		generateModel_TreeGrown(model, position);
		this.worldObject.addToMeshGroup(model.trunk);
		this.worldObject.addToMeshGroup(model.tree);
	}

	update(timeDelta) {
		if (this.currentState === Tree.stateEnum.GROWN) { return; }

		this.growthTime += timeDelta;
		switch (this.currentState) {
			case Tree.stateEnum.YOUTH: 		if (this.growthCycle.grown <= this.growthTime) { this.switchState(Tree.stateEnum.YOUTH, Tree.stateEnum.GROWN); } 		break;
			case Tree.stateEnum.SAPLING: 	if (this.growthCycle.youth <= this.growthTime) { this.switchState(Tree.stateEnum.SAPLING, Tree.stateEnum.YOUTH); } 		break;
			case Tree.stateEnum.SPROUT: 	if (this.growthCycle.sapling <= this.growthTime) { this.switchState(Tree.stateEnum.SPROUT, Tree.stateEnum.SAPLING); } 	break;
			default:						console.log(`State: ${this.currentState}`); this.switchState(null, Tree.stateEnum.SPROUT); 								break;
		}
	}

	static getGrowthCycle(type) {
		switch (type) {
			case "tree": 		return { sprout: 0, sapling: 3, youth: 6, grown: 9 };
			default:			return { sprout: 0, sapling: 10, youth: 20, grown: 30 };
		}
	}
}