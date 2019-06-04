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
		let trunkSize = { x: 0.072, y: 0.396, z: 0.072 };
        let trunkGeom = new THREE.BoxBufferGeometry(trunkSize.x, trunkSize.y, trunkSize.z);
		let trunkMesh = new THREE.Mesh(trunkGeom, new THREE.MeshLambertMaterial({ color: Colors.TreeTrunk }));
        let position1 = (this.indexXZ ? GroundBlock.getBlockPosition(this.indexXZ) : (new THREE.Vector3()));
        trunkMesh.position.set(position1.x, position1.y + (GroundBlock.getPlotSize().y / 2) + (trunkSize.y / 2), position1.z);
		trunkMesh.castShadow = true;
		trunkMesh.receiveShadow = true;
		this.worldObject.addToMeshGroup(trunkMesh);
		
		let treeSize = { x: 0.216, y: 0.36, z: 0.216 };
        let treeGeom = new THREE.BoxBufferGeometry(treeSize.x, treeSize.y, treeSize.z);
		let treeMesh = new THREE.Mesh(treeGeom, new THREE.MeshLambertMaterial({ color: Colors.TreeTop }));
        let position2 = (this.indexXZ ? GroundBlock.getBlockPosition(this.indexXZ) : (new THREE.Vector3()));
		treeMesh.position.set(position2.x, position2.y + (GroundBlock.getPlotSize().y / 2) + trunkSize.y + (treeSize.y / 2), position2.z);
		treeMesh.castShadow = true;
		
		this.shadow = customizeShadow(treeMesh, 0.25); // mesh, opacity
		this.worldObject.addToMeshGroup(treeMesh);
		this.worldObject.addToMeshGroup(this.shadow);

		return null;
	}
};