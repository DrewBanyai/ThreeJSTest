class Character {
    constructor(data) {
        this.worldObject = new WorldObject({ type: "Character", subtype: "Model", baseObject: this });
		this.indexXZ = data.indexXZ;
        this.modelSizes = { head: { x: .090, y: .090, z: .090 }, body: { x: .120, y: .150, z: .050 }, arms: { x: .050, y: .120, z: .050 }, legs: { x: .050, y: .130, z: .050 } };
        this.model = { head: null, body: null, arm1: null, arm2: null, leg1: null, leg2: null };
        this.position = new THREE.Vector3();
        this.walkPath = null;
        this.positionTarget = null;
        this.walkSpeed = 0.36;
        this.actions = { chop: null, plant: null, harvest: null, sleep: null, drink: null };
        this.content = this.generateContent();
    }

    generateContent() {
        let headColor = "rgb(200, 100, 100)";
        let bodyColor = "rgb(100, 200, 100)";
        let arm1Color = "rgb(100, 100, 200)";
        let arm2Color = "rgb(100, 60, 200)";
        let leg1Color = "rgb(100, 100, 100)";
        let leg2Color = "rgb(100, 60, 100)";
        
		this.position = (this.indexXZ ? GroundBlock.getBlockPosition(this.indexXZ) : (new THREE.Vector3()));
		this.position.y += GroundBlock.getTopMiddleDelta().y;
        
        let headGeom = new THREE.BoxBufferGeometry(this.modelSizes.head.x, this.modelSizes.head.y, this.modelSizes.head.z);
        this.model.head = new THREE.Mesh(headGeom, new THREE.MeshLambertMaterial({ color: headColor }));
        let bodyGeom = new THREE.BoxBufferGeometry(this.modelSizes.body.x, this.modelSizes.body.y, this.modelSizes.body.z);
        this.model.body = new THREE.Mesh(bodyGeom, new THREE.MeshLambertMaterial({ color: bodyColor }));
        let armsGeom = new THREE.BoxBufferGeometry(this.modelSizes.arms.x, this.modelSizes.arms.y, this.modelSizes.arms.z);
        this.model.arm1 = new THREE.Mesh(armsGeom, new THREE.MeshLambertMaterial({ color: arm1Color }));
        this.model.arm2 = new THREE.Mesh(armsGeom, new THREE.MeshLambertMaterial({ color: arm2Color }));
        let legsGeom = new THREE.BoxBufferGeometry(this.modelSizes.legs.x, this.modelSizes.legs.y, this.modelSizes.legs.z);
        this.model.leg1 = new THREE.Mesh(legsGeom, new THREE.MeshLambertMaterial({ color: leg1Color }));
        this.model.leg2 = new THREE.Mesh(legsGeom, new THREE.MeshLambertMaterial({ color: leg2Color }));

        for (let part in this.model) { this.model[part].castShadow = true; }

        this.setPartPositions();

        //  Add all meshes to the WorldObject mesh collection
        for (let part in this.model) { this.worldObject.addToMeshGroup(this.model[part]); }
    }

    setPartPositions() {
        this.model.leg1.position.set(this.position.x + ((-1) * (this.modelSizes.legs.x / 2)), this.position.y + (this.modelSizes.legs.y / 2), this.position.z + 0);
        this.model.leg2.position.set(this.position.x + ((1)  * (this.modelSizes.legs.x / 2)), this.position.y + (this.modelSizes.legs.y / 2), this.position.z + 0);
        this.model.body.position.set(this.position.x + (0), this.position.y + (this.modelSizes.legs.y + (this.modelSizes.body.y / 2)), this.position.z + 0);
        this.model.arm1.position.set(this.position.x + ((-this.modelSizes.body.x / 2) + (-this.modelSizes.arms.x / 2)), this.position.y + (this.modelSizes.legs.y + (this.modelSizes.arms.y / 2) + (this.modelSizes.body.y - this.modelSizes.arms.y)), this.position.z + 0);
        this.model.arm2.position.set(this.position.x + ((this.modelSizes.body.x / 2) + (this.modelSizes.arms.x / 2)), this.position.y + (this.modelSizes.legs.y + (this.modelSizes.arms.y / 2) + (this.modelSizes.body.y - this.modelSizes.arms.y)), this.position.z + 0);
        this.model.head.position.set(this.position.x + (0), this.position.y + (this.modelSizes.legs.y + this.modelSizes.body.y + (this.modelSizes.head.y / 2)), this.position.z + 0);
    }

    getCenterPoint() {
        let height = this.position.y + (this.modelSizes.legs.y + this.modelSizes.body.y + this.modelSizes.head.y);
        let ground = GroundBlock.getTopMiddleDelta();
        return new THREE.Vector3(ground.x, ground.y + (height / 2), ground.z)
    }

    commandToMove(indexXZ, target) {
        this.positionTarget = target;
        if (columnRowsEqual(indexXZ, this.indexXZ)) { this.reachDestination(); }
        else { this.walkPath = navigateWalk(this.indexXZ, indexXZ); }
    }

    async layDown(bedPosition) {
        console.log("Sleeping...");
    }

    drinkWater() {
        console.log("Drinking water...");
    }

    update(timeDelta) {
        this.walk(timeDelta);
    }

    walk(timeDelta) { 
        if (this.walkPath !== null) {
            if (this.walkPath.length === 0) { this.walkPath = null; return }
            this.indexXZ = this.walkPath[0];

            let nextPosition = GroundBlock.getTopMiddleDelta().add(GroundBlock.getBlockPosition(this.walkPath[0]));
            let deltaPosition = new THREE.Vector3(nextPosition.x - this.position.x, nextPosition.y - this.position.y, nextPosition.z - this.position.z);
            let lengthSq = deltaPosition.lengthSq();
            deltaPosition.normalize();
            deltaPosition.multiplyScalar(this.walkSpeed * timeDelta);
            if ((lengthSq === 0) || (deltaPosition.lengthSq() > lengthSq)) { this.position = nextPosition; }
            else { this.position.add(deltaPosition); }
            this.setPartPositions();
            if (this.position === nextPosition) { 
                this.walkPath.shift();
                if (this.walkPath.length === 0) { this.reachDestination(); }
            }
        }
    }

    reachDestination() {
        let worldObject = this.positionTarget.worldObject;
        let object = (worldObject ? worldObject.baseObject : null);
        if (!object) { console.log("No object found at destination!"); return; }

        if      ((object.topper instanceof Bed) && this.actions.sleep)      { this.actions.sleep(this, this.positionTarget); }
        else if ((object.topper instanceof Crop) && this.actions.harvest)   { this.actions.harvest(this, this.positionTarget); }
        else if ((object.topper instanceof Tree) && this.actions.chop)      { this.actions.chop(this, this.positionTarget); }
        else if (this.positionTarget.worldObject.objectSubtype === "dirt")  { this.actions.plant(this, this.positionTarget); }
        else if (this.positionTarget.worldObject.objectSubtype === "water") { this.actions.drink(this, this.positionTarget); }
    }
};