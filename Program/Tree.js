class Tree {
	constructor(data) {
        this.worldObject = new WorldObject({ type: "Tree", subtype: "Basic", baseObject: this });
		this.blockPositionIndex = data.blockPositionIndex;
		this.height = data.height;
		this.trunk = null;
		this.tree = null;
		this.groundBlock = null;
		this.content = this.generateContent();
	}

	generateContent() {
		let trunkSize = { x: 40, y: 220, z: 40 };
        let trunkGeom = new THREE.BoxBufferGeometry(trunkSize.x, trunkSize.y, trunkSize.z);
		this.trunk = new THREE.Mesh(trunkGeom, new THREE.MeshLambertMaterial({ color: "rgb(210, 105, 30)" }));
        let position1 = (this.blockPositionIndex ? GroundBlock.getBlockPosition(this.blockPositionIndex) : (new THREE.Vector3()));
        this.trunk.position.set(position1.x, position1.y + (GroundBlock.getPlotSize().y / 2) + (trunkSize.y / 2), position1.z);
		this.worldObject.addToMeshCollection(this.trunk);
		
		let treeSize = { x: 120, y: 200, z: 120 };
        let treeGeom = new THREE.BoxBufferGeometry(treeSize.x, treeSize.y, treeSize.z);
		this.tree = new THREE.Mesh(treeGeom, new THREE.MeshLambertMaterial({ color: "rgb(100, 230, 100)" }));
        let position2 = (this.blockPositionIndex ? GroundBlock.getBlockPosition(this.blockPositionIndex) : (new THREE.Vector3()));
		this.tree.position.set(position2.x, position2.y + (GroundBlock.getPlotSize().y / 2) + trunkSize.y + (treeSize.y / 2), position2.z);
		this.worldObject.addToMeshCollection(this.tree);

		return this.worldObject.meshCollection;
	}
};