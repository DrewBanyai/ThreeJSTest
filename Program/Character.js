class Character {
    constructor(data) {
        this.name = data.name;
        this.worldObject = new WorldObject({ type: "Character", subtype: "Model", baseObject: this });
		this.indexXZ = data.indexXZ;
        this.modelSizes = { 
            head: { x: 0.090, y: 0.090, z: 0.090 }, 
            body: { x: 0.120, y: 0.150, z: 0.050 }, 
            arms: { x: 0.050, y: 0.120, z: 0.050 }, 
            legs: { x: 0.050, y: 0.130, z: 0.050 }
        };
        this.model = { 
            head: null, 
            body: null, 
            arm1: null, 
            arm2: null, 
            leg1: null, 
            leg2: null
        };
        this.position = new THREE.Vector3();
        this.walkPath = null;
        this.positionTarget = null;
        this.walkSpeed = 0.72;
        this.command = null;
        this.busy = false;
        this.stats = { 
            hunger: 0, 
            thirst: 0, 
            exhaustion: 0, 
            wood: 0
        };
        this.statTimers = { 
            hunger: 0, 
            thirst: 0, 
            exhaustion: 0
        };
        this.actions = { 
            chop: null, 
            plant: null, 
            harvest: null, 
            sleep: null, 
            drink: null
        };
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

    SetCommandList(listID) { 
        this.command = { CommandID: listID };
        console.log(this);
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
        else { 
            let destinationCheck = (key) => { return (key ===  getKeyFromColumnRow(indexXZ)); };
            this.walkPath = findPath(this.indexXZ, destinationCheck);
            this.busy = true;
            if (this.command) { this.SetCommandList(this.command.CommandID); }
        }
    }

    async layDown(bedPosition) {
        this.busy = true;
        this.walkPath = null;
        console.log("Sleeping...");
        scene.remove(this.worldObject.meshObjectGroup);

        await (new Promise(resolve => setTimeout(resolve, 1500)));

        scene.add(this.worldObject.meshObjectGroup);
        this.busy = false;
    }

    drinkWater() {
        console.log("Drinking water...");
    }

    update(timeDelta) {
        if (this.busy) { console.log(this.busy); }
        if (this.walkPath) { this.walk(timeDelta); }
        else if (this.command !== null && this.busy === false) {
            let commandList = CommandList[this.command.CommandID];
            if (this.command.actionIndex && (this.command.actionIndex >= commandList.actions.length)) { this.SetCommandList(this.command.CommandID); }
            this.positionTarget = null;

            //  First, check all conditions
            let conditionsTrue = true;
            commandList.conditions.forEach((condition) => { conditionsTrue = conditionsTrue && (condition.check(this, condition)); });
            if (conditionsTrue === false) { return; }

            //  Next, go through all actions
            this.command.actionIndex = this.command.actionIndex || 0;
            let action = commandList.actions[this.command.actionIndex];
            if (action.action) { action.action(this, action); return; }
            else { console.log("Something went wrong..."); }
        }
    }

    walk(timeDelta) { 
        if (this.walkPath.length === 0) { this.walkPath = null; return; }

        //  If the next block is an unwalkable block, stop where we are and commit the action as if we reached the block
        let block = getGroundBlock(this.walkPath[0].x, this.walkPath[0].z);
        let nextBlockUnwalkable = (groundTypesUnwalkable.includes(block.worldObject.objectSubtype));
        nextBlockUnwalkable |= (block.topper && blockToppersUnwalkable.includes(block.topper.worldObject.objectType))
        if (nextBlockUnwalkable) { 
            this.walkPath.shift();
            this.reachDestination();
            return;
        }

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
            if (this.walkPath.length === 0) { this.reachDestination(); return; }
        }
    }

    reachDestination() {
        this.busy = false;
        if (this.positionTarget !== null) {
            let worldObject = this.positionTarget.worldObject;
            let object = (worldObject ? worldObject.baseObject : null);
            if (!object) { console.log("No object found at destination!"); return; }
    
            if      ((object.topper instanceof Bed) && this.actions.sleep)      { this.actions.sleep(this, this.positionTarget); }
            else if ((object.topper instanceof Crop) && this.actions.harvest)   { this.actions.harvest(this, this.positionTarget); }
            else if ((object.topper instanceof Tree) && this.actions.chop)      { this.actions.chop(this, this.positionTarget); }
            else if (this.positionTarget.worldObject.objectSubtype === "dirt")  { this.actions.plant(this, this.positionTarget); }
            else if (this.positionTarget.worldObject.objectSubtype === "water") { this.actions.drink(this, this.positionTarget); }
        }
    }
};