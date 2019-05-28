class WorldObject {
	constructor(data) {
		this.objectType = data.type;
		this.objectSubtype = data.subtype;
		this.meshObjectGroup = new THREE.Group();
		this.baseObject = data.baseObject;

		this.highlightColor = data.highlightColor ? data.highlightColor : 0xFF0000;
	}

	addToMeshGroup(item) { item.worldObject = this; this.meshObjectGroup.add(item); }
	removeFromMeshGroup(item) { this.meshObjectGroup.children = this.meshObjectGroup.children.filter(function(value, index, arr) { return value !== item; })};
	clearMeshGroup() { while (this.meshObjectGroup.children.length > 0) { this.meshObjectGroup.children.pop(); } }
	getMeshObjectGroup() { return this.meshObjectGroup; }
	setIsRayColliding(func) { this.isRayColliding = func; }
	getFullType() { return this.objectType + " - " + this.objectSubtype; }

	isRayColliding(raycaster) {
		let intersects = raycaster.intersectObjects(this.meshObjectGroup);
		return (intersects.length > 0);
	}

	highlightObject(meshObject) {
		if (!meshObject) { meshObject = this.meshObjectGroup; }
		if (!meshObject || (meshObject.children.length === 0)) return;

		meshObject.children.forEach((meshObject) => {
			if (meshObject.type === "Group") { this.highlightObject(meshObject); }
			else if (meshObject.material && meshObject.material.emissive) {
				meshObject.savedHex = meshObject.material.emissive.getHex();
				meshObject.material.emissive.setHex(this.highlightColor);
			}
		});
	}

	dehighlightObject(meshObject) {
		if (!meshObject) { meshObject = this.meshObjectGroup; }
		if (!meshObject || (meshObject.children.length === 0)) return;

		meshObject.children.forEach((meshObject) => {
			if (meshObject.type === "Group") { this.dehighlightObject(meshObject); }
			else if (meshObject.material && meshObject.material.emissive) {
				meshObject.material.emissive.setHex(meshObject.savedHex);
			}
		});
	}
};