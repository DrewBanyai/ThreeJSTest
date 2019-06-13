class Character {
    constructor(data) {
        this.name = data.name;
        this.worldObject = new WorldObject({ type: "Character", subtype: "Model", baseObject: this });
		this.indexXZ = data.indexXZ;
        this.model = null;
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
        this.generateContent();
    }

    generateContent() {
		this.position = GroundBlock.getBlockPosition(this.indexXZ);
		this.position.y += GroundBlock.getTopMiddleDelta().y;
        
        this.model = {};
        generateModel_BasicCharacter(this.model);
        this.setPartPositions();

        //  Add all meshes to the WorldObject mesh collection
        for (let part in this.model.parts) { this.worldObject.addToMeshGroup(this.model.parts[part]); }
    }

    SetCommandList(listID) { this.command = { CommandID: listID }; }

    setPartPositions() {
        this.model.parts.leg1.position.set(this.position.x + ((-1) * (this.model.sizes.legs.x / 2)), this.position.y + (this.model.sizes.legs.y / 2), this.position.z + 0);
        this.model.parts.leg2.position.set(this.position.x + ((1)  * (this.model.sizes.legs.x / 2)), this.position.y + (this.model.sizes.legs.y / 2), this.position.z + 0);
        this.model.parts.body.position.set(this.position.x + (0), this.position.y + (this.model.sizes.legs.y + (this.model.sizes.body.y / 2)), this.position.z + 0);
        this.model.parts.arm1.position.set(this.position.x + ((-this.model.sizes.body.x / 2) + (-this.model.sizes.arms.x / 2)), this.position.y + (this.model.sizes.legs.y + (this.model.sizes.arms.y / 2) + (this.model.sizes.body.y - this.model.sizes.arms.y)), this.position.z + 0);
        this.model.parts.arm2.position.set(this.position.x + ((this.model.sizes.body.x / 2) + (this.model.sizes.arms.x / 2)), this.position.y + (this.model.sizes.legs.y + (this.model.sizes.arms.y / 2) + (this.model.sizes.body.y - this.model.sizes.arms.y)), this.position.z + 0);
        this.model.parts.head.position.set(this.position.x + (0), this.position.y + (this.model.sizes.legs.y + this.model.sizes.body.y + (this.model.sizes.head.y / 2)), this.position.z + 0);
    }

    getCenterPoint() {
        let height = this.position.y + (this.model.sizes.legs.y + this.model.sizes.body.y + this.model.sizes.head.y);
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

        this.updateStats(timeDelta);
    }

    updateStats(timeDelta) {
        if ((this.statTimers.hunger += timeDelta) > 5) { this.stats.hunger += 1; this.statTimers.hunger -= 5; }
        if ((this.statTimers.thirst += timeDelta) > 4) { this.stats.thirst += 1; this.statTimers.thirst -= 4; }
        if ((this.statTimers.exhaustion += timeDelta) > 3) { this.stats.exhaustion += 1; this.statTimers.exhaustion -= 3; }
        if (this.stats.hunger > 100) { this.stats.hunger = 100; }
        if (this.stats.thirst > 100) { this.stats.thirst = 100; }
        if (this.stats.exhaustion > 100) { this.stats.exhaustion = 100; }
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