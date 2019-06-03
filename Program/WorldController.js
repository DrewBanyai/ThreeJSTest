class WorldController {
    constructor() {
        this.lighting = { ambient: null, shadow: null, backlight: null};

        this.characters = []; //  A list of character WorldObject entities
        this.dayTime = 15;
        this.characterStats = { hunger: 0, thirst: 0, exhaustion: 0, wood: 0 };
        this.characterStatTimers = { hunger: 0, thirst: 0, exhaustion: 0 };
        this.content = this.generateContent();
    }

    generateContent() {
        this.createSceneColorAndLighting();
        this.createTestMap();
        this.createCharacter();
    }

    createSceneColorAndLighting() {
        //  Set the background color for the scene
        scene.background = new THREE.Color(null);

        //  Set the ambient lighting for the scene
        this.lighting.ambient = new THREE.AmbientLight(null, 0.5)
        scene.add(this.lighting.ambient);

        //  Set the shadow lighting for the scene
        this.lighting.shadow = new THREE.DirectionalLight(null, 0.5);
        this.lighting.shadow.position.set(200, 200, 200);
        this.lighting.shadow.castShadow = true;
        scene.add(this.lighting.shadow);

        //  Set the backlight lighting for the scene
        this.lighting.backlight = new THREE.DirectionalLight(null, .2);
        this.lighting.backlight.position.set(-100, 200, 50);
        this.lighting.backlight.castShadow = false;
        scene.add(this.lighting.backlight);
    }

    createTestMap() {
        for (let j = 0; j < WorldController.getWorldSize().z; ++j) {
            for (let i = 0; i < WorldController.getWorldSize().x; ++i) {
                let groundBlock = new GroundBlock({ groundType: "Grass", blockPositionIndex: { column: i, row: j } });

                //  Add this ground piece to the scene and also to the list of ground pieces
                scene.add(groundBlock.worldObject.getMeshObjectGroup());
                addGroundBlockToMap(groundBlock);
            }
        }

        //  Add the dirt plots
        setGroundBlockSubTypeFromXZ(1, 1, "Dirt");
        setGroundBlockSubTypeFromXZ(1, 2, "Dirt");
        setGroundBlockSubTypeFromXZ(1, 3, "Dirt");
        setGroundBlockSubTypeFromXZ(1, 4, "Dirt");

        //  Add some water plots
        setGroundBlockSubTypeFromXZ(1, 6, "Water");
        setGroundBlockSubTypeFromXZ(1, 7, "Water");
        setGroundBlockSubTypeFromXZ(1, 8, "Water");

        //  Add a few trees
        this.plantTree(WorldController.getPositionIndexFromRowColumn(7, 4));

        //  Put in a bed to test sleeping
        this.createBed({ column: 7, row: 6 });
    }

    isGroundSubtype(positionIndex, type) {
        if (positionIndex < 0) { return false; }
        if (positionIndex >= (WorldController.getWorldSize().x * WorldController.getWorldSize().y)) { return false; }
        if (getGroundBlockSubType(positionIndex) === type) { return true; }
        return false;
    }

    createBed(columnRow) {
        let bed = new Bed({ blockPositionIndex: columnRow });
        scene.add(bed.worldObject.getMeshObjectGroup());
        let bedPositionIndex1 = WorldController.getPositionIndexFromRowColumn(columnRow.column, columnRow.row + 0);
        let bedPositionIndex2 = WorldController.getPositionIndexFromRowColumn(columnRow.column, columnRow.row + 1);
        setGroundBlockTopper(bedPositionIndex1, bed);
        setGroundBlockTopper(bedPositionIndex2, bed, false);
    }

    plantTree(indexOverride) {
        let positionIndex = indexOverride ? indexOverride : WorldController.getRandomWorldPosition();
        let treePositionValid = (positionIndex) => { return (this.isGroundSubtype(positionIndex, "Grass") && (!getGroundBlockTopper(positionIndex))); };
        while (!treePositionValid(positionIndex)) { positionIndex = WorldController.getRandomWorldPosition(); }

        let tree = new Tree({ height: "0.18", blockPositionIndex: WorldController.getRowColumnFromPositionIndex(positionIndex) })
        scene.add(tree.worldObject.getMeshObjectGroup());

        setGroundBlockTopper(positionIndex, tree);
    }

    destroyTree(positionIndex) {
        if (!isTreePresent(positionIndex)) { console.log(`Attempted to remove non-existent tree at index ${positionIndex}`); return false; }

        let tree = getGroundBlockTopper(positionIndex);
        if (tree.currentState != Tree.stateEnum.GROWN) { console.log("You can't chop down this tree until it is fully grown!"); return false; }

        scene.remove(tree.worldObject.getMeshObjectGroup());
        setGroundBlockTopper(positionIndex, null);

        return true;
    }

    plantCrop(positionIndex) {
        if (!this.isGroundSubtype(positionIndex, "Dirt")) { console.log("Attempted to plant a crop on the wrong type of GroundPlot"); return; }
        
        let crop = new Crop({ cropType: "Beans", blockPositionIndex: WorldController.getRowColumnFromPositionIndex(positionIndex) });
        scene.add(crop.worldObject.getMeshObjectGroup());

        setGroundBlockTopper(positionIndex, crop);
    }

    harvestCrop(positionIndex) {
        if (!isCropPresent(positionIndex)) { console.log(`Attempted to harvest non-existent crop at index ${positionIndex}`); return; }

        let crop = getGroundBlockTopper(positionIndex);
        if (crop.currentState != Crop.stateEnum.GROWN) { console.log("You can't harvest this crop until it is fully grown!"); return; }

        scene.remove(crop.worldObject.getMeshObjectGroup());
        setGroundBlockTopper(positionIndex, null);
        
        this.characterStats.hunger = (this.characterStats.hunger > 5) ? this.characterStats.hunger - 5 : 0;

    }

    static getRandomWorldPosition() { return parseInt(Math.random() * (WorldController.getWorldSize().x * WorldController.getWorldSize().z)); }
    static getWorldSize() { return { x: 10, z: 10 }; }
    static getPositionIndexFromRowColumn(column, row) { return row * WorldController.getWorldSize().x + column; }
    static getRowColumnFromPositionIndex(positionIndex) { return { row: parseInt(positionIndex / WorldController.getWorldSize().x), column: positionIndex % WorldController.getWorldSize().x }; }
    static getPositionIndexFromBlocks(blocks) {  return WorldController.getPositionIndexFromRowColumn(blocks.column, blocks.row); }
    
    createCharacter() {
        let character = new Character();
        this.characters.push(character);
        scene.add(character.worldObject.getMeshObjectGroup());

        character.actions.chop = (char, target) => {
            let positionIndex = WorldController.getPositionIndexFromBlocks(target.blockPositionIndex);
            if (this.destroyTree(positionIndex)) {
                this.plantTree();
                this.characterStats.wood += 5;
            }
        }

        character.actions.plant = (char, target) => {
            if (target.topper instanceof Crop) { console.log("Attempting to plant a crop where one already exists"); return; }
            let positionIndex = WorldController.getPositionIndexFromBlocks(target.blockPositionIndex);
            this.plantCrop(positionIndex);
        }

        character.actions.harvest = (char, target) => {
            if (!(target.topper instanceof Crop)) { console.log("Attempting to harvest a crop where one does not exist"); return; }
            let positionIndex = WorldController.getPositionIndexFromBlocks(target.blockPositionIndex);
            this.harvestCrop(positionIndex);
        }

        character.actions.sleep = async (char, target) => {
            if (!(target.topper instanceof Bed)) { console.log("Attempting to lay in a bed where one does not exist"); return; }
            await char.layDown();
            DayNightCurrentState.currentTimer = DayNightCycle.morning;
            this.characterStats.exhaustion = (this.characterStats.exhaustion > 5) ? this.characterStats.exhaustion - 5 : 0;
        }

        character.actions.drink = async (char, target) => {
            char.drinkWater();
            this.characterStats.thirst = (this.characterStats.thirst > 5) ? this.characterStats.thirst - 5 : 0;
        }
    }

    update(timeDelta) {
        this.characters.forEach((character) => character.update(timeDelta));
        updateGroundMap(timeDelta);
        this.updateDayTime(timeDelta);

        if ((this.characterStatTimers.hunger += timeDelta) > 5) { this.characterStats.hunger += 1; this.characterStatTimers.hunger -= 5; }
        if ((this.characterStatTimers.thirst += timeDelta) > 4) { this.characterStats.thirst += 1; this.characterStatTimers.thirst -= 4; }
        if ((this.characterStatTimers.exhaustion += timeDelta) > 3) { this.characterStats.exhaustion += 1; this.characterStatTimers.exhaustion -= 3; }
        if (this.characterStats.hunger > 100) { this.characterStats.hunger = 100; }
        if (this.characterStats.thirst > 100) { this.characterStats.thirst = 100; }
        if (this.characterStats.exhaustion > 100) { this.characterStats.exhaustion = 100; }
        MainUI.setHungerValue(this.characterStats.hunger);
        MainUI.setThirstValue(this.characterStats.thirst);
        MainUI.setExhaustionValue(this.characterStats.exhaustion);
        MainUI.setWoodValue(this.characterStats.wood);
    }

    updateDayTime(timeDelta) {
        //  Update the DayNightCycle data with the time delta
        updateDayTimeCycle(timeDelta);
        
        //  Set the lighting according to the current day/time state
        this.lighting.ambient.intensity = DayNightCurrentState.lightLevel * 0.5;
        this.lighting.shadow.intensity = DayNightCurrentState.lightLevel * 0.5;
        this.lighting.backlight.intensity = DayNightCurrentState.lightLevel * 0.3;
        
        //  Set the sky color according to the current day/time state
        scene.background.set(DayNightCycle.skyColorRGB());

        //  Show the current time of day in the UI
        let timeOfDay = DayNightCurrentState.nightTime ? "Night time" : "Day time";
        MainUI.setDayTimeValue(`${timeOfDay} - ${parseInt(DayNightCurrentState.currentTimer)}`)
    }
};