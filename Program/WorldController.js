class WorldController {
    constructor() {
        this.lighting = { ambient: null, shadow: null, backlight: null};

        this.characters = []; //  A list of character WorldObject entities
        this.dayTime = 15;
        this.generateContent();
    }

    generateContent() {
        this.createSceneColorAndLighting();
        this.createMapFromData(TestMapData);
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

        //  Load all characters in from data
        mapData.characters.forEach((character) => {
            this.createCharacter(character.indexXZ, character.indexXZ.x.toString());
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

    plantCrop(char, indexXZ) {
        if (!(getGroundBlockSubType(indexXZ) === "dirt")) { console.log("Attempted to plant a crop on the wrong type of GroundPlot"); return; }

        let crop = new Crop({ cropType: "beans", indexXZ: indexXZ });
        scene.add(crop.worldObject.getMeshObjectGroup());

        setGroundBlockTopper(indexXZ, crop);
    }

    harvestCrop(char, indexXZ) {
        if (!isCropPresent(indexXZ)) { console.log(`Attempted to harvest non-existent crop at index ${getKeyFromColumnRow(indexXZ)}`); return; }

        let crop = getGroundBlockTopper(indexXZ);
        if (crop.currentState != Crop.stateEnum.GROWN) { console.log("You can't harvest this crop until it is fully grown!"); return; }

        scene.remove(crop.worldObject.getMeshObjectGroup());
        setGroundBlockTopper(indexXZ, null);
        
        char.stats.hunger = (char.stats.hunger > 5) ? char.stats.hunger - 5 : 0;

    }

    createCharacter(indexXZ, name) {
        let character = new Character({ indexXZ: indexXZ, name: name });
        this.characters.push(character);
        scene.add(character.worldObject.getMeshObjectGroup());

        character.actions.chop = (char, target) => {
            if (this.destroyTree(target.indexXZ)) {
                this.plantTree();
                char.stats.wood += 5;
            }
        }

        character.actions.plant = (char, target) => {
            if (target.topper instanceof Crop) { console.log("Attempting to plant a crop where one already exists"); return; }
            this.plantCrop(char, target.indexXZ);
        }

        character.actions.harvest = (char, target) => {
            if (!(target.topper instanceof Crop)) { console.log("Attempting to harvest a crop where one does not exist"); return; }
            let blockKey = getKeyFromColumnRow(target.indexXZ);
            this.harvestCrop(char, target.indexXZ);
        }

        character.actions.sleep = async (char, target) => {
            if (!(target.topper instanceof Bed)) { console.log("Attempting to lay in a bed where one does not exist"); return; }
            await char.layDown();
            DayNightCurrentState.currentTimer = DayNightCycle.morning;
            char.stats.exhaustion = (char.stats.exhaustion > 5) ? char.stats.exhaustion - 5 : 0;
        }

        character.actions.drink = async (char, target) => {
            char.drinkWater();
            char.stats.thirst = (char.stats.thirst > 5) ? char.stats.thirst - 5 : 0;
        }
    }

    update(timeDelta) {
        this.characters.forEach((character) => character.update(timeDelta));
        updateGroundMap(timeDelta);
        this.updateDayTime(timeDelta);
        CharacterMenu.Update();
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