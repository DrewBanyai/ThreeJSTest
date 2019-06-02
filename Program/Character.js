class Character {
    constructor() {
        this.worldObject = new WorldObject({ type: "Character", subtype: "Model", baseObject: this });
        this.head = null;
        this.body = null;
        this.arm1 = null;
        this.arm2 = null;
        this.leg1 = null;
        this.leg2 = null;
        this.position = new THREE.Vector3(0, 0, 0);
        this.targetPosition = null;
        this.positionTarget = null;
        this.walkSpeed = 0.36;
        this.chopTreeFunc = null;
        this.plantCropFunc = null;
        this.harvestFunc = null;
        this.drinkWaterFunc = null;
        this.content = this.generateContent();
    }

    generateContent() {
        let headColor = "rgb(200, 100, 100)";
        let bodyColor = "rgb(100, 200, 100)";
        let arm1Color = "rgb(100, 100, 200)";
        let arm2Color = "rgb(100, 60, 200)";
        let leg1Color = "rgb(100, 100, 100)";
        let leg2Color = "rgb(100, 60, 100)";

        this.headSize = { x: .090, y: .090, z: .090 };
        this.bodySize = { x: .120, y: .150, z: .050 };
        this.armsSize = { x: .050, y: .120, z: .050 };
        this.legsSize = { x: .050, y: .130, z: .050 };
        
        let headGeom = new THREE.BoxBufferGeometry(this.headSize.x, this.headSize.y, this.headSize.z);
        this.head = new THREE.Mesh(headGeom, new THREE.MeshLambertMaterial({ color: headColor }));
        let bodyGeom = new THREE.BoxBufferGeometry(this.bodySize.x, this.bodySize.y, this.bodySize.z);
        this.body = new THREE.Mesh(bodyGeom, new THREE.MeshLambertMaterial({ color: bodyColor }));
        let armsGeom = new THREE.BoxBufferGeometry(this.armsSize.x, this.armsSize.y, this.armsSize.z);
        this.arm1 = new THREE.Mesh(armsGeom, new THREE.MeshLambertMaterial({ color: arm1Color }));
        this.arm2 = new THREE.Mesh(armsGeom, new THREE.MeshLambertMaterial({ color: arm2Color }));
        let legsGeom = new THREE.BoxBufferGeometry(this.legsSize.x, this.legsSize.y, this.legsSize.z);
        this.leg1 = new THREE.Mesh(legsGeom, new THREE.MeshLambertMaterial({ color: leg1Color }));
        this.leg2 = new THREE.Mesh(legsGeom, new THREE.MeshLambertMaterial({ color: leg2Color }));

        this.head.castShadow = true;
        this.body.castShadow = true;
        this.arm1.castShadow = true;
        this.arm2.castShadow = true;
        this.leg1.castShadow = true;
        this.leg2.castShadow = true;

        this.setPartPositions();

        //  Add all meshes to the WorldObject mesh collection
        this.worldObject.addToMeshGroup(this.leg1);
        this.worldObject.addToMeshGroup(this.leg2);
        this.worldObject.addToMeshGroup(this.body);
        this.worldObject.addToMeshGroup(this.arm1);
        this.worldObject.addToMeshGroup(this.arm2);
        this.worldObject.addToMeshGroup(this.head);
    }

    setPartPositions() {
        this.leg1.position.set(this.position.x + ((-1) * (this.legsSize.x / 2)), this.position.y + (this.legsSize.y / 2), this.position.z + 0);
        this.leg2.position.set(this.position.x + ((1)  * (this.legsSize.x / 2)), this.position.y + (this.legsSize.y / 2), this.position.z + 0);
        this.body.position.set(this.position.x + (0), this.position.y + (this.legsSize.y + (this.bodySize.y / 2)), this.position.z + 0);
        this.arm1.position.set(this.position.x + ((-this.bodySize.x / 2) + (-this.armsSize.x / 2)), this.position.y + (this.legsSize.y + (this.armsSize.y / 2) + (this.bodySize.y - this.armsSize.y)), this.position.z + 0);
        this.arm2.position.set(this.position.x + ((this.bodySize.x / 2) + (this.armsSize.x / 2)), this.position.y + (this.legsSize.y + (this.armsSize.y / 2) + (this.bodySize.y - this.armsSize.y)), this.position.z + 0);
        this.head.position.set(this.position.x + (0), this.position.y + (this.legsSize.y + this.bodySize.y + (this.headSize.y / 2)), this.position.z + 0);
    }

    getCenterPoint() {
        let height = this.position.y + (this.legsSize.y + this.bodySize.y + this.headSize.y);
        let ground = GroundBlock.getTopMiddleDelta();
        return new THREE.Vector3(ground.x, ground.y + (height / 2), ground.z)
    }

    commandToMove(position, target) {
        if (this.targetPosition === null) { this.targetPosition = new THREE.Vector3(); }
        this.targetPosition.set(position.x, position.y, position.z);
        this.positionTarget = target;
    }

    async layDown(bedPosition) {
        console.log("Sleeping...");
    }

    drinkWater() {
        console.log("Drinking water...");
    }

    update(timeDelta) {
        if (this.targetPosition !== null) {
            let deltaPosition = new THREE.Vector3(this.targetPosition.x - this.position.x, this.targetPosition.y - this.position.y, this.targetPosition.z - this.position.z);
            let lengthSq = deltaPosition.lengthSq();
            deltaPosition.normalize();
            deltaPosition.multiplyScalar(this.walkSpeed * timeDelta);
            if ((lengthSq === 0) || (deltaPosition.lengthSq() > lengthSq)) { 
                this.position = this.targetPosition;
                switch (this.positionTarget.worldObject.objectSubtype) {
                    case "Tree":        if (this.chopTreeFunc)  { this.chopTreeFunc(this, this.positionTarget); }   break;
                    case "Dirt":        if (this.plantCropFunc) { this.plantCropFunc(this, this.positionTarget); }  break;
                    case "Crop":        if (this.harvestFunc)   { this.harvestFunc(this, this.positionTarget); }    break;
                    case "Bed":         if (this.sleepFunc)     { this.sleepFunc(this, this.positionTarget); }      break;
                    case "Water":       if (this.waterFunc)     { this.waterFunc(this, this.positionTarget); }      break;
                }
                this.targetPosition = null;
            }
            else { this.position.add(deltaPosition); }
            this.setPartPositions();
        }
    }
};