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
        this.createMapFromData(TestMapData);
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

    createMapFromData(mapData) {
        //  Load the ground block items in from data
        mapData.groundBlocks.forEach((groundData) => {
            let groundBlock = new GroundBlock(groundData);

            //  Add this ground piece to the scene and also to the list of ground pieces
            scene.add(groundBlock.worldObject.getMeshObjectGroup());
            addGroundBlockToMap(groundBlock);
        });

        //  Load the world items in from data
        mapData.objects.forEach((objectData) => {
            switch (objectData.objecttype) {
                case "tree":    this.plantTree(objectData.indexXZ);     break;
                case "bed":     this.createBed(objectData.indexXZ);     break;
            }
        });
    }

    createBed(indexXZ) {
        let bed = new Bed({ indexXZ: indexXZ });
        scene.add(bed.worldObject.getMeshObjectGroup());
        let columnRow2 = { x: indexXZ.x, z: indexXZ.z + 1 };
        setGroundBlockTopper(indexXZ, bed);
        setGroundBlockTopper(columnRow2, bed, false);
    }

    areAnyCharactersAtXZ(indexXZ) {
        let characterExists = false;
        this.characters.forEach((character) => { if (columnRowsEqual(character.indexXZ, indexXZ)) { characterExists = true; } });
        return characterExists;
    }

    plantTree(columnRowOverride) {
        let indexXZ = columnRowOverride ? columnRowOverride : getRandomBlockPosition();
        let treePositionValid = (indexXZ) => { return ((getGroundBlockSubType(indexXZ) === "grass") && (!getGroundBlockTopper(indexXZ)) && (!this.areAnyCharactersAtXZ(indexXZ))); };
        while (!treePositionValid(indexXZ)) { indexXZ = getRandomBlockPosition(); }

        let tree = new Tree({ height: "0.18", indexXZ: indexXZ })
        scene.add(tree.worldObject.getMeshObjectGroup());

        setGroundBlockTopper(indexXZ, tree);
    }

    destroyTree(indexXZ) {
        if (!isTreePresent(indexXZ)) { console.log(`Attempted to remove non-existent tree at index ${getKeyFromColumnRow(indexXZ)}`); return false; }

        let tree = getGroundBlockTopper(indexXZ);
        if (tree.currentState != Tree.stateEnum.GROWN) { console.log("You can't chop down this tree until it is fully grown!"); return false; }

        scene.remove(tree.worldObject.getMeshObjectGroup());
        setGroundBlockTopper(indexXZ, null);

        return true;
    }

    plantCrop(indexXZ) {
        if (!(getGroundBlockSubType(indexXZ) === "dirt")) { console.log("Attempted to plant a crop on the wrong type of GroundPlot"); return; }
        
        let crop = new Crop({ cropType: "beans", indexXZ: indexXZ });
        scene.add(crop.worldObject.getMeshObjectGroup());

        setGroundBlockTopper(indexXZ, crop);
    }

    harvestCrop(indexXZ) {
        if (!isCropPresent(indexXZ)) { console.log(`Attempted to harvest non-existent crop at index ${getKeyFromColumnRow(indexXZ)}`); return; }

        let crop = getGroundBlockTopper(indexXZ);
        if (crop.currentState != Crop.stateEnum.GROWN) { console.log("You can't harvest this crop until it is fully grown!"); return; }

        scene.remove(crop.worldObject.getMeshObjectGroup());
        setGroundBlockTopper(indexXZ, null);
        
        this.characterStats.hunger = (this.characterStats.hunger > 5) ? this.characterStats.hunger - 5 : 0;

    }

    createCharacter() {
        let character = new Character({ indexXZ: { x: 5, z: 5 } });
        this.characters.push(character);
        scene.add(character.worldObject.getMeshObjectGroup());

        character.actions.chop = (char, target) => {
            if (this.destroyTree(target.indexXZ)) {
                this.plantTree();
                this.characterStats.wood += 5;
            }
        }

        character.actions.plant = (char, target) => {
            if (target.topper instanceof Crop) { console.log("Attempting to plant a crop where one already exists"); return; }
            this.plantCrop(target.indexXZ);
        }

        character.actions.harvest = (char, target) => {
            if (!(target.topper instanceof Crop)) { console.log("Attempting to harvest a crop where one does not exist"); return; }
            let blockKey = getKeyFromColumnRow(target.indexXZ);
            this.harvestCrop(target.indexXZ);
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