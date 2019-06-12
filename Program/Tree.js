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
		this.content = this.generateContent();
	}

	generateContent() {
		let position = GroundBlock.getBlockPosition(this.indexXZ);
		let treeModel = generateModel_TreeGrown(position);

		this.worldObject.addToMeshGroup(treeModel.trunk);
		this.worldObject.addToMeshGroup(treeModel.tree);
		this.worldObject.addToMeshGroup(treeModel.shadow);

		//  Save off the shadow
		this.shadow = treeModel.shadow;

		return null;
	}
};