class Bed {
	constructor(data) {
        this.worldObject = new WorldObject({ type: "Bed", subtype: "Basic", baseObject: this });
		this.blockPositionIndex = data.blockPositionIndex;
		this.content = this.generateContent();
	}

	generateContent() {
		let bedFullHeight = 0.1;
		let plotSize = GroundBlock.getPlotSize();
		let plotYDelta = GroundBlock.getTopMiddleDelta();
		let bedPostSize = { x: plotSize.x * 0.05, y: bedFullHeight * 0.38, z: plotSize.x * 0.05 };
		let bedPostGeom = new THREE.BoxBufferGeometry(bedPostSize.x, bedPostSize.y, bedPostSize.z);
		let bedFrameSize = { x: plotSize.x, y: bedFullHeight * 0.43, z: plotSize.z * 2 };
		let bedFrameGeom = new THREE.BoxBufferGeometry(bedFrameSize.x, bedFrameSize.y, bedFrameSize.z);
		let mattressSize = { x: plotSize.x * 0.9, y: bedFullHeight * 0.036, z: plotSize.z * 1.8 };
		let mattressGeom = new THREE.BoxBufferGeometry(mattressSize.x, mattressSize.y, mattressSize.z);
		let pillowSize = { x: plotSize.x * 0.9, y: bedFullHeight * 0.154, z: plotSize.z * 0.4 };
		let pillowGeom = new THREE.BoxBufferGeometry(pillowSize.x, pillowSize.y, pillowSize.z);

		let bedPostColor = "rgb(60, 60, 60)";
		let bedFrameColor = "rgb(60, 30, 10)";
		let mattressColor = "rgb(200, 200, 200)";
		let pillowColor = "rgb(200, 200, 200)";

		let bedPosition = (this.blockPositionIndex ? GroundBlock.getBlockPosition(this.blockPositionIndex) : (new THREE.Vector3()));
		bedPosition.y += plotYDelta.y;

		//  Top left bed post
		let bedPostTL = new THREE.Mesh(bedPostGeom, new THREE.MeshLambertMaterial({ color: bedPostColor }));
        bedPostTL.position.set(bedPosition.x - (plotSize.x / 2) + (bedPostSize.x / 2), bedPosition.y + (bedPostSize.y / 2), bedPosition.z - (plotSize.z / 2) + (bedPostSize.z / 2));
		this.worldObject.addToMeshGroup(bedPostTL);

		//  Top right bed post
		let bedPostTR = new THREE.Mesh(bedPostGeom, new THREE.MeshLambertMaterial({ color: bedPostColor }));
        bedPostTR.position.set(bedPosition.x + (plotSize.x / 2) - (bedPostSize.x / 2), bedPosition.y + (bedPostSize.y / 2), bedPosition.z - (plotSize.z / 2) + (bedPostSize.z / 2));
		this.worldObject.addToMeshGroup(bedPostTR);

		//  Bottom left bed post
		let bedPostBL = new THREE.Mesh(bedPostGeom, new THREE.MeshLambertMaterial({ color: bedPostColor }));
        bedPostBL.position.set(bedPosition.x - (plotSize.x / 2) + (bedPostSize.x / 2), bedPosition.y + (bedPostSize.y / 2), bedPosition.z + plotSize.z + (plotSize.z / 2) - (bedPostSize.z / 2));
		this.worldObject.addToMeshGroup(bedPostBL);

		//  Bottom right bed post
		let bedPostBR = new THREE.Mesh(bedPostGeom, new THREE.MeshLambertMaterial({ color: bedPostColor }));
        bedPostBR.position.set(bedPosition.x + (plotSize.x / 2) - (bedPostSize.x / 2), bedPosition.y + (bedPostSize.y / 2), bedPosition.z + plotSize.z + (plotSize.z / 2) - (bedPostSize.z / 2));
		this.worldObject.addToMeshGroup(bedPostBR);

		//  Main bed frame
		let bedFrame = new THREE.Mesh(bedFrameGeom, new THREE.MeshLambertMaterial({ color: bedFrameColor }));
        bedFrame.position.set(bedPosition.x, bedPosition.y + bedPostSize.y + (bedFrameSize.y / 2), bedPosition.z + (plotSize.z / 2));
		this.worldObject.addToMeshGroup(bedFrame);

		//  Mattress
		let bedMattress = new THREE.Mesh(mattressGeom, new THREE.MeshLambertMaterial({ color: mattressColor }));
        bedMattress.position.set(bedPosition.x, bedPosition.y + bedPostSize.y + bedFrameSize.y + (mattressSize.y / 2), bedPosition.z + (plotSize.z / 2));
		this.worldObject.addToMeshGroup(bedMattress);

		//  Pillow
		let bedPillow = new THREE.Mesh(pillowGeom, new THREE.MeshLambertMaterial({ color: pillowColor }));
        bedPillow.position.set(bedPosition.x, bedPosition.y + bedPostSize.y + bedFrameSize.y + mattressSize.y + (pillowSize.y / 2), bedPosition.z - (pillowSize.z / 2));
		this.worldObject.addToMeshGroup(bedPillow);
	
		return null;
	}
};