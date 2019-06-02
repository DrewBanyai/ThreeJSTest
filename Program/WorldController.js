class WorldController {
    constructor(scene) {
        this.scene = scene;
        this.lighting = { ambient: null, shadow: null, backlight: null};

        this.groundPieces = []; //  A list of ground plot WorldObject entities
        this.trees = {}; //  A dictionary of tree WorldObject entities
        this.crops = {}; //  A dictionary of crop WorldObject entities
        this.characters = []; //  A list of character WorldObject entities
        this.dayTime = 15;
        this.characterStats = { hunger: 0, thirst: 0, exhaustion: 0, wood: 0 };
        this.characterStatTimers = { hunger: 0, thirst: 0, exhaustion: 0 };
        this.content = this.generateContent();
    }

    generateContent() {
        this.createSceneColorAndLighting();
        this.createBasicGroundPlot();
        this.createCharacter();
    }

    createSceneColorAndLighting() {
        //  Set the background color for the scene
        this.scene.background = new THREE.Color(null);

        //  Set the ambient lighting for the scene
        this.lighting.ambient = new THREE.AmbientLight(null, 0.5)
        this.scene.add(this.lighting.ambient);

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

    createBasicGroundPlot() {
        for (let j = 0; j < WorldController.getWorldSize().z; ++j) {
            for (let i = 0; i < WorldController.getWorldSize().x; ++i) {
                let groundBlock = new GroundBlock({ groundType: "Grass", blockPositionIndex: { column: i, row: j } });

                //  Add this ground piece to the scene and also to the list of ground pieces
                this.scene.add(groundBlock.worldObject.getMeshObjectGroup());
                this.groundPieces.push(groundBlock);
            }
        }

        //  Add the dirt plots
        this.groundPieces[WorldController.getPositionIndexFromRowColumn(1, 1)].setGroundSubtype("Dirt");
        this.groundPieces[WorldController.getPositionIndexFromRowColumn(1, 2)].setGroundSubtype("Dirt");
        this.groundPieces[WorldController.getPositionIndexFromRowColumn(1, 3)].setGroundSubtype("Dirt");
        this.groundPieces[WorldController.getPositionIndexFromRowColumn(1, 4)].setGroundSubtype("Dirt");

        //  Add some water plots
        this.groundPieces[WorldController.getPositionIndexFromRowColumn(1, 6)].setGroundSubtype("Water");
        this.groundPieces[WorldController.getPositionIndexFromRowColumn(1, 7)].setGroundSubtype("Water");
        this.groundPieces[WorldController.getPositionIndexFromRowColumn(1, 8)].setGroundSubtype("Water");

        //  Add a few trees
        this.plantTree(WorldController.getPositionIndexFromRowColumn(7, 4));

        let bed = new Bed({ blockPositionIndex: { column: 7, row: 6 } });
        this.scene.add(bed.worldObject.getMeshObjectGroup());
        let bedPositionIndex1 = WorldController.getPositionIndexFromRowColumn(bed.blockPositionIndex.column, bed.blockPositionIndex.row + 0);
        let bedPositionIndex2 = WorldController.getPositionIndexFromRowColumn(bed.blockPositionIndex.column, bed.blockPositionIndex.row + 1);
        this.groundPieces[bedPositionIndex1].setGroundSubtype("Bed");
        this.groundPieces[bedPositionIndex2].setGroundSubtype("Bed");
        bed.groundBlock = this.groundPieces[bedPositionIndex1];
        this.groundPieces[bedPositionIndex1].bed = bed;
        this.groundPieces[bedPositionIndex2].bed = bed;
        this.groundPieces[bedPositionIndex1].topper = bed;
        this.groundPieces[bedPositionIndex2].topper = bed;
    }

    isGroundSubtype(positionIndex, type) {
        if (positionIndex < 0) { return false; }
        if (positionIndex >= (WorldController.getWorldSize().x * WorldController.getWorldSize().y)) { return false; }
        if (this.groundPieces[positionIndex].getGroundSubtype() === type) { return true; }
        return false;
    }

    plantTree(indexOverride) {
        let positionIndex = indexOverride ? indexOverride : WorldController.getRandomWorldPosition();
        while (!this.isGroundSubtype(positionIndex, "Grass")) { positionIndex = WorldController.getRandomWorldPosition(); }

        let tree = new Tree({ height: "0.18", blockPositionIndex: WorldController.getRowColumnFromPositionIndex(positionIndex) })
        this.scene.add(tree.worldObject.getMeshObjectGroup());
        this.groundPieces[positionIndex].setGroundSubtype("Tree");

        this.trees["tree" + positionIndex.toString()] = tree;
        tree.groundBlock = this.groundPieces[positionIndex];
    }

    destroyTree(positionIndex) {
        if (!this.isGroundSubtype(positionIndex, "Tree")) { console.log(`Attempted to remove non-existent tree at index ${positionIndex}`); return; }

        let tree = this.trees["tree" + positionIndex.toString()];
        this.scene.remove(tree.worldObject.getMeshObjectGroup());
        delete this.trees["tree" + positionIndex.toString()];
        tree = null;

        this.groundPieces[positionIndex].setGroundSubtype("Grass");
    }

    plantCrop(positionIndex) {
        if (!this.isGroundSubtype(positionIndex, "Dirt")) { console.log("Attempted to plant a crop on the wrong type of GroundPlot"); return; }
        
        let crop = new Crop({ cropType: "Beans", blockPositionIndex: WorldController.getRowColumnFromPositionIndex(positionIndex) });
        this.scene.add(crop.worldObject.getMeshObjectGroup());
        this.groundPieces[positionIndex].setGroundSubtype("Crop");

        this.crops["crop" + positionIndex.toString()] = crop;
        crop.groundBlock = this.groundPieces[positionIndex];
        this.groundPieces[positionIndex].crop = crop;
        this.groundPieces[positionIndex].topper = crop;
    }

    harvestCrop(positionIndex) {
        if (!this.isGroundSubtype(positionIndex, "Crop")) { console.log(`Attempted to harvest non-existent crop at index ${positionIndex}`); return; }

        let crop = this.crops["crop" + positionIndex.toString()];
        if (crop.currentState != Crop.stateEnum.GROWN) { console.log("You can't harvest this crop until it is fully grown!"); return; }

        crop.removeCrop();
        delete this.crops["crop" + positionIndex.toString()];
        crop = null;
        
        this.characterStats.hunger = (this.characterStats.hunger > 5) ? this.characterStats.hunger - 5 : 0;

        this.groundPieces[positionIndex].setGroundSubtype("Dirt");
        this.groundPieces[positionIndex].crop = null;
        this.groundPieces[positionIndex].topper = null;
    }

    static getRandomWorldPosition() { return parseInt(Math.random() * (WorldController.getWorldSize().x * WorldController.getWorldSize().z)); }
    static getWorldSize() { return { x: 10, z: 10 }; }
    static getPositionIndexFromRowColumn(column, row) { return row * WorldController.getWorldSize().x + column; }
    static getRowColumnFromPositionIndex(positionIndex) { return { row: parseInt(positionIndex / WorldController.getWorldSize().x), column: positionIndex % WorldController.getWorldSize().x }; }
    static getPositionIndexFromBlocks(blocks) {  return WorldController.getPositionIndexFromRowColumn(blocks.column, blocks.row); }
    
    createCharacter() {
        let character = new Character();
        this.characters.push(character);
        this.scene.add(character.worldObject.getMeshObjectGroup());

        character.chopTreeFunc = (char, target) => {
            let positionIndex = WorldController.getPositionIndexFromBlocks(target.blockPositionIndex);
            this.destroyTree(positionIndex);
            this.plantTree();
            this.characterStats.wood += 5;
        }

        character.plantCropFunc = (char, target) => {
            if (target.topper instanceof Crop) { console.log("Attempting to plant a crop where one already exists"); return; }
            let positionIndex = WorldController.getPositionIndexFromBlocks(target.blockPositionIndex);
            this.plantCrop(positionIndex);
        }

        character.harvestFunc = (char, target) => {
            if (!(target.topper instanceof Crop)) { console.log("Attempting to harvest a crop where one does not exist"); return; }
            let positionIndex = WorldController.getPositionIndexFromBlocks(target.blockPositionIndex);
            this.harvestCrop(positionIndex);
        }

        character.sleepFunc = async (char, target) => {
            if (!(target.topper instanceof Bed)) { console.log("Attempting to lay in a bed where one does not exist"); return; }
            await char.layDown();
            this.dayTime = 6;
            this.characterStats.exhaustion = (this.characterStats.exhaustion > 5) ? this.characterStats.exhaustion - 5 : 0;
        }

        character.waterFunc = async (char, target) => {
            char.drinkWater();
            this.characterStats.thirst = (this.characterStats.thirst > 5) ? this.characterStats.thirst - 5 : 0;
        }
    }

    update(timeDelta) {
        this.characters.forEach((character) => character.update(timeDelta));
        for (let crop in this.crops) { this.crops[crop].update(timeDelta); }
        this.updateDayNightCycle(timeDelta);

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

    updateDayNightCycle(timeDelta) {
        const hourMultiplier = 1;
        this.dayTime += (timeDelta * hourMultiplier);
        const dayLightLevels = [ 99, 85, 99, 113, 127, 142, 157, 171, 185, 199, 213, 227, 241, 255, 241, 227, 213, 199, 185, 171, 157, 142, 127, 113 ];
        const skyColorLevels = [ 69, 55, 69, 83, 97, 112, 127, 141, 155, 169, 183, 197, 211, 225, 211, 197, 183, 169, 155, 141, 127, 112, 97, 83 ]
        while (this.dayTime >= dayLightLevels.length) { this.dayTime -= dayLightLevels.length; }
        let dayTimeIndex = parseInt(this.dayTime);
        let nextIndex = (dayTimeIndex < dayLightLevels.length - 1) ? (dayTimeIndex + 1) : 0;
        let lightLevel = parseInt(dayLightLevels[dayTimeIndex] + ((this.dayTime - dayTimeIndex) * (dayLightLevels[nextIndex] - dayLightLevels[dayTimeIndex])));
        
        this.lighting.ambient.intensity = (lightLevel / 255) * 0.5;
        this.lighting.shadow.intensity = (lightLevel / 255) * 0.5;
        this.lighting.backlight.intensity = (lightLevel / 255) * 0.3;
        
        let skyLevel = parseInt(skyColorLevels[dayTimeIndex] + ((this.dayTime - dayTimeIndex) * (skyColorLevels[nextIndex] - skyColorLevels[dayTimeIndex])));
        this.scene.background.set(`rgb(${skyLevel}, ${skyLevel}, ${skyLevel})`);

        let nightTime = ((this.dayTime < dayLightLevels.length / 4) || (this.dayTime >= dayLightLevels.length - (dayLightLevels.length / 4)));
        MainUI.setDayTimeValue(nightTime ? `Night time - ${parseInt(this.dayTime)}` : `Day time - ${parseInt(this.dayTime)}`)
    }
};