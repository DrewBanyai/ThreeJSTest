class Tree {
	static stateEnum = {
		SPROUT: 1,
		SAPLING: 2,
		YOUTH: 3,
		GROWN: 4,
	}

	constructor(data) {
        this.worldObject = new WorldObject({ type: "tree", subtype: "basic", baseObject: this });
		this.currentState = Tree.stateEnum.GROWN;
		this.indexXZ = data.indexXZ;
		this.height = data.height;
		this.groundBlock = null;
		this.shadow = null;
		this.generateContent();
	}

	generateContent() {
		let position = GroundBlock.getBlockPosition(this.indexXZ);
		let model = {};
		generateModel_TreeGrown(model, position);

		this.worldObject.addToMeshGroup(model.trunk);
		this.worldObject.addToMeshGroup(model.tree);
		this.worldObject.addToMeshGroup(model.shadow);

		//  Save off the shadow
		this.shadow = model.shadow;

		return null;
	}
};