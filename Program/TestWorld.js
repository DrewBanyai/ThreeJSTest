class TestWorld {
    constructor(data) {
        this.BackgroundColor = data.backgroundColor;
        this.AmbientLightColor = data.ambientLightColor;
        this.scene = null;
        this.ambientLight = null;
        this.light = null;
        this.groundPieces = []; //  A list of ground plot WorldObject entities
        this.trees = {}; //  A dictionary of tree WorldObject entities
        this.crops = {}; //  A dictionary of crop WorldObject entities
        this.characters = []; //  A list of character WorldObject entities
        this.content = this.generateContent();
    }

    generateContent() {
        this.createInitialScene();
        this.createBasicGroundPlot();
        this.createCharacter();
    }

    createInitialScene() {
        //  Create a basic scene with a background color and an ambient light value
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(this.BackgroundColor);
        this.ambientLight = new THREE.AmbientLight(this.AmbientLightColor)
        this.scene.add(this.ambientLight);
    }

    createBasicGroundPlot() {
        for (let i = 0; i < TestWorld.getWorldSize().x; ++i) {
            for (let j = 0; j < TestWorld.getWorldSize().z; ++j) {
                let groundBlock = new GroundBlock({ groundType: "Grass", blockPositionIndex: { column: i, row: j } });

                //  Add this ground piece to the scene and also to the list of ground pieces
                this.scene.add(groundBlock.worldObject.getMeshObjectGroup());
                this.groundPieces.push(groundBlock);
            }
        }

        //  Add the dirt plots
        this.groundPieces[TestWorld.getPositionIndexFromBlocks({ column: 1, row: 1})].setGroundSubtype("Dirt");
        this.groundPieces[TestWorld.getPositionIndexFromBlocks({ column: 1, row: 2})].setGroundSubtype("Dirt");
        this.groundPieces[TestWorld.getPositionIndexFromBlocks({ column: 1, row: 3})].setGroundSubtype("Dirt");
        this.groundPieces[TestWorld.getPositionIndexFromBlocks({ column: 1, row: 4})].setGroundSubtype("Dirt");

        //  Add a few trees
        this.plantTree(TestWorld.getPositionIndexFromRowColumn(7, 4));

        let bed = new Bed({ blockPositionIndex: { column: 7, row: 7 } });
        this.scene.add(bed.worldObject.getMeshObjectGroup());
        let bedPositionIndex1 = TestWorld.getPositionIndexFromBlocks({ column: 7, row: 7});
        let bedPositionIndex2 = TestWorld.getPositionIndexFromBlocks({ column: 7, row: 8});
        this.groundPieces[bedPositionIndex1].setGroundSubtype("Bed");
        this.groundPieces[bedPositionIndex2].setGroundSubtype("Bed");
        bed.groundBlock = this.groundPieces[bedPositionIndex1];
    }

    isGroundSubtype(positionIndex, type) {
        if (positionIndex < 0) { return false; }
        if (positionIndex >= (TestWorld.getWorldSize().x * TestWorld.getWorldSize().y)) { return false; }
        if (this.groundPieces[positionIndex].getGroundSubtype() === type) { return true; }
        return false;
    }

    plantTree(indexOverride) {
        let positionIndex = indexOverride ? indexOverride : TestWorld.getRandomWorldPosition();
        while (!this.isGroundSubtype(positionIndex, "Grass")) { positionIndex = TestWorld.getRandomWorldPosition(); }

        let tree = new Tree({ height: "100", blockPositionIndex: TestWorld.getRowColumnFromPositionIndex(positionIndex) })
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
        
        let crop = new Crop({ cropType: "Beans", blockPositionIndex: TestWorld.getRowColumnFromPositionIndex(positionIndex) });
        this.scene.add(crop.worldObject.getMeshObjectGroup());
        this.groundPieces[positionIndex].setGroundSubtype("Crop");

        this.crops["crop" + positionIndex.toString()] = crop;
        crop.groundBlock = this.groundPieces[positionIndex];
        this.groundPieces[positionIndex].crop = crop;
    }

    harvestCrop(positionIndex) {
        if (!this.isGroundSubtype(positionIndex, "Crop")) { console.log(`Attempted to harvest non-existent crop at index ${positionIndex}`); return; }

        let crop = this.crops["crop" + positionIndex.toString()];
        if (crop.currentState != Crop.stateEnum.GROWN) { console.log("You can't harvest this crop until it is fully grown!"); return; }

        crop.removeCrop();
        delete this.crops["crop" + positionIndex.toString()];
        crop = null;

        this.groundPieces[positionIndex].setGroundSubtype("Dirt");
        this.groundPieces[positionIndex].crop = null;
    }

    static getRandomWorldPosition() { return parseInt(Math.random() * (TestWorld.getWorldSize().x * TestWorld.getWorldSize().z)); }
    static getWorldSize() { return { x: 10, z: 10 }; }
    static getPositionIndexFromRowColumn(column, row) { return column * TestWorld.getWorldSize().x + row; }
    static getRowColumnFromPositionIndex(positionIndex) { return { row: parseInt(positionIndex / TestWorld.getWorldSize().x), column: positionIndex % TestWorld.getWorldSize().x }; }
    static getPositionIndexFromBlocks(blocks) {  return (blocks.row * TestWorld.getWorldSize().x) + blocks.column; }
    static getBlocksFromPositionIndex(positionIndex) { return { row: parseInt(positionIndex / TestWorld.getWorldSize().x), column: positionIndex % TestWorld.getWorldSize().x } };

    createCharacter() {
        let character = new Character();
        this.characters.push(character);
        this.scene.add(character.worldObject.getMeshObjectGroup());

        character.chopTreeFunc = (char, target) => {
            let positionIndex = TestWorld.getPositionIndexFromBlocks(target.blockPositionIndex);
            this.destroyTree(positionIndex);
            this.plantTree();
        }

        character.plantCropFunc = (char, target) => {
            if (target.crop !== null) { return; }
            let positionIndex = TestWorld.getPositionIndexFromBlocks(target.blockPositionIndex);
            this.plantCrop(positionIndex);
        }

        character.harvestFunc = (char, target) => {
            if (target.crop === null) { return; }
            let positionIndex = TestWorld.getPositionIndexFromBlocks(target.blockPositionIndex);
            this.harvestCrop(positionIndex);
        }
    }

    update(timeDelta) {
        this.characters.forEach((character) => character.update(timeDelta));
        for (let crop in this.crops) { this.crops[crop].update(timeDelta); }
    }

    getScene() { return this.scene; }
    getAmbientLight() { return this.ambientLight; }
    getLight() { return this.light; }
};