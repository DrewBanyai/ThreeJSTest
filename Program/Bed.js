class Bed {
	constructor(data) {
        this.worldObject = new WorldObject({ type: "Bed", subtype: "Basic", baseObject: this });
		this.blockPositionIndex = data.blockPositionIndex;
		this.content = this.generateContent();
	}

	generateContent() {
		let plotSize = GroundBlock.getPlotSize();
		let bedPostSize = { x: 5, y: 15, z: 5 };
		let bedPostGeom = new THREE.BoxBufferGeometry(bedPostSize.x, bedPostSize.y, bedPostSize.z);
		let bedFrameSize = { x: plotSize.x, y: 30, z: plotSize.z * 2 };
		let bedFrameGeom = new THREE.BoxBufferGeometry(bedFrameSize.x, bedFrameSize.y, bedFrameSize.z);
		let mattressSize = { x: plotSize.x * 0.9, y: 2, z: plotSize.z * 1.8 };
		let mattressGeom = new THREE.BoxBufferGeometry(mattressSize.x, mattressSize.y, mattressSize.z);
		let pillowSize = { x: plotSize.x * 0.9, y: 8, z: plotSize.z * 0.4 };
		let pillowGeom = new THREE.BoxBufferGeometry(pillowSize.x, pillowSize.y, pillowSize.z);

		//  Top left bed post
		let bedPostTL = new THREE.Mesh(bedPostGeom, new THREE.MeshLambertMaterial({ color: "rgb(60, 60, 60)" }));
        let positionTL = (this.blockPositionIndex ? GroundBlock.getBlockPosition(this.blockPositionIndex) : (new THREE.Vector3()));
        bedPostTL.position.set(positionTL.x - (plotSize.x / 2) + (bedPostSize.x / 2), positionTL.y + (plotSize.y / 2) + (bedPostSize.y / 2), positionTL.z - (plotSize.z / 2) + (bedPostSize.z / 2));
		this.worldObject.addToMeshGroup(bedPostTL);

		//  Top right bed post
		let bedPostTR = new THREE.Mesh(bedPostGeom, new THREE.MeshLambertMaterial({ color: "rgb(60, 60, 60)" }));
        let positionTR = (this.blockPositionIndex ? GroundBlock.getBlockPosition(this.blockPositionIndex) : (new THREE.Vector3()));
        bedPostTR.position.set(positionTR.x + (plotSize.x / 2) - (bedPostSize.x / 2), positionTR.y + (plotSize.y / 2) + (bedPostSize.y / 2), positionTR.z - (plotSize.z / 2) + (bedPostSize.z / 2));
		this.worldObject.addToMeshGroup(bedPostTR);

		//  Bottom left bed post
		let bedPostBL = new THREE.Mesh(bedPostGeom, new THREE.MeshLambertMaterial({ color: "rgb(60, 60, 60)" }));
        let positionBL = (this.blockPositionIndex ? GroundBlock.getBlockPosition(this.blockPositionIndex) : (new THREE.Vector3()));
        bedPostBL.position.set(positionBL.x - (plotSize.x / 2) + (bedPostSize.x / 2), positionBL.y + (plotSize.y / 2) + (bedPostSize.y / 2), positionBL.z + plotSize.z + (plotSize.z / 2) - (bedPostSize.z / 2));
		this.worldObject.addToMeshGroup(bedPostBL);

		//  Bottom right bed post
		let bedPostBR = new THREE.Mesh(bedPostGeom, new THREE.MeshLambertMaterial({ color: "rgb(60, 60, 60)" }));
        let positionBR = (this.blockPositionIndex ? GroundBlock.getBlockPosition(this.blockPositionIndex) : (new THREE.Vector3()));
        bedPostBR.position.set(positionBR.x + (plotSize.x / 2) - (bedPostSize.x / 2), positionBR.y + (plotSize.y / 2) + (bedPostSize.y / 2), positionBR.z + plotSize.z + (plotSize.z / 2) - (bedPostSize.z / 2));
		this.worldObject.addToMeshGroup(bedPostBR);

		//  Main bed frame
		let bedFrame = new THREE.Mesh(bedFrameGeom, new THREE.MeshLambertMaterial({ color: "rgb(60, 30, 10)" }));
        let positionFrame = (this.blockPositionIndex ? GroundBlock.getBlockPosition(this.blockPositionIndex) : (new THREE.Vector3()));
        bedFrame.position.set(positionFrame.x, positionFrame.y + (plotSize.y / 2) + bedPostSize.y + (bedFrameSize.y / 2), positionFrame.z + (plotSize.z / 2));
		this.worldObject.addToMeshGroup(bedFrame);

		//  Mattress
		let bedMattress = new THREE.Mesh(mattressGeom, new THREE.MeshLambertMaterial({ color: "rgb(200, 200, 200)" }));
        let positionMattress = (this.blockPositionIndex ? GroundBlock.getBlockPosition(this.blockPositionIndex) : (new THREE.Vector3()));
        bedMattress.position.set(positionMattress.x, positionMattress.y + (plotSize.y / 2) + bedPostSize.y + bedFrameSize.y + (mattressSize.y / 2), positionMattress.z + (plotSize.z / 2));
		this.worldObject.addToMeshGroup(bedMattress);

		//  Pillow
		let bedPillow = new THREE.Mesh(pillowGeom, new THREE.MeshLambertMaterial({ color: "rgb(60, 60, 60)" }));
        let positionPillow = (this.blockPositionIndex ? GroundBlock.getBlockPosition(this.blockPositionIndex) : (new THREE.Vector3()));
        bedPillow.position.set(positionPillow.x, positionPillow.y + (plotSize.y / 2) + bedPostSize.y + bedFrameSize.y + mattressSize.y + (pillowSize.y / 2), positionPillow.z - (pillowSize.z / 2));
		this.worldObject.addToMeshGroup(bedPillow);
	
		return null;
	}
};