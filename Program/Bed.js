class Bed {
	constructor(data) {
        this.worldObject = new WorldObject({ type: "bed", subtype: "basic", baseObject: this });
		this.indexXZ = data.indexXZ;
		this.content = this.generateContent();
	}

	generateContent() {
		let position = GroundBlock.getBlockPosition(this.indexXZ);
		let model = generateModel_GenericBed(position);

		this.worldObject.addToMeshGroup(model.bedPostTL);
		this.worldObject.addToMeshGroup(model.bedPostTR);
		this.worldObject.addToMeshGroup(model.bedPostBL);
		this.worldObject.addToMeshGroup(model.bedPostBR);
		this.worldObject.addToMeshGroup(model.bedFrame);
		this.worldObject.addToMeshGroup(model.bedMattress);
		this.worldObject.addToMeshGroup(model.bedPillow);
	
		return null;
	}
};