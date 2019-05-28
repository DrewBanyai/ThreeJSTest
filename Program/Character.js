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
        this.walkSpeed = 200;
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

        this.headSize = { x: 50, y: 50, z: 50 };
        this.bodySize = { x: 60, y: 80, z: 25 };
        this.armsSize = { x: 25, y: 70, z: 25 };
        this.legsSize = { x: 25, y: 55, z: 25 };
        
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
        this.head.receiveShadow = true;
        this.body.castShadow = true;
        this.body.receiveShadow = true;
        this.arm1.castShadow = true;
        this.arm1.receiveShadow = true;
        this.arm2.castShadow = true;
        this.arm2.receiveShadow = true;
        this.leg1.castShadow = true;
        this.leg1.receiveShadow = true;
        this.leg2.castShadow = true;
        this.leg2.receiveShadow = true;

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

    commandToMove(position, target) {
        if (this.targetPosition === null) { this.targetPosition = new THREE.Vector3(); }
        this.targetPosition.set(position.x, position.y, position.z);
        console.log(this.targetPosition);
        this.positionTarget = target;
    }

    update(timeDelta) {
        if (this.targetPosition !== null) {
            let deltaPosition = new THREE.Vector3(this.targetPosition.x - this.position.x, this.targetPosition.y - this.position.y, this.targetPosition.z - this.position.z);
            let lengthSq = deltaPosition.lengthSq();
            deltaPosition.normalize();
            deltaPosition.multiplyScalar(this.walkSpeed * timeDelta);
            if ((lengthSq === 0) || (deltaPosition.lengthSq() > lengthSq)) { 
                this.position = this.targetPosition;
                if      ((this.positionTarget.worldObject.objectSubtype === "Tree") && this.chopTreeFunc !== null) { this.chopTreeFunc(this, this.positionTarget); }
                else if ((this.positionTarget.worldObject.objectSubtype === "Dirt") && this.chopTreeFunc !== null) { this.plantCropFunc(this, this.positionTarget); }
                else if ((this.positionTarget.worldObject.objectSubtype === "Crop") && this.harvestFunc !== null) { this.harvestFunc(this, this.positionTarget); }
                this.targetPosition = null;
            }
            else { this.position.add(deltaPosition); }
            this.setPartPositions();
        }
    }
};