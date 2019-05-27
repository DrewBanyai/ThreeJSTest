class WorldObject {
	constructor(data) {
		this.objectType = data.type;
		this.objectSubtype = data.subtype;
		this.meshCollection = data.mesh ? [ data.mesh ] : [];
		this.baseObject = data.baseObject;

		this.highlightColor = data.highlightColor ? data.highlightColor : 0xFF0000;
	}

	addToMeshCollection(mesh) { this.meshCollection.push(mesh); }
	getMeshCollection() { return this.meshCollection; }
	setIsRayColliding(func) { this.isRayColliding = func; }

	isRayColliding(raycaster) {
		let intersects = raycaster.intersectObjects(this.meshCollection);
		return (intersects.length > 0);
	}

	highlightObject() {
		if (!this.meshCollection || (this.meshCollection.length === 0)) return;
		this.meshCollection.forEach((mesh) => {
			if (mesh.material.emissive) {
				mesh.savedHex = mesh.material.emissive.getHex();
				mesh.material.emissive.setHex(this.highlightColor);
			}
		});
	}

	dehighlightObject() {
		this.meshCollection.forEach((mesh) => {
			if (mesh.material.emissive) {
				mesh.material.emissive.setHex(mesh.savedHex);
			}
		});
	}

	setColor(color) {
		this.meshCollection.forEach((mesh) => {
			mesh.material.color.set(color);
		});
	}
};