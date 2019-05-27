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
                let groundBlock = new GroundBlock({ groundType: "Grass", blockPositionIndex: { row: i, column: j } });

                //  Add this ground piece to the scene and also to the list of ground pieces
                groundBlock.worldObject.meshCollection.forEach((mesh) => this.scene.add(mesh));
                this.groundPieces.push(groundBlock);
            }
        }

        //  Add the dirt plots
        this.groundPieces[TestWorld.getWorldSize().x + 1].setGroundSubtype("Dirt");
        this.groundPieces[TestWorld.getWorldSize().x + 2].setGroundSubtype("Dirt");
        this.groundPieces[TestWorld.getWorldSize().x + 3].setGroundSubtype("Dirt");
        this.groundPieces[TestWorld.getWorldSize().x + 4].setGroundSubtype("Dirt");

        //  Add a few trees
        this.plantTree(145);
    }

    isGroundSubtype(positionIndex, type) {
        if (positionIndex < 0) { return false; }
        if (positionIndex >= (TestWorld.getWorldSize().x * TestWorld.getWorldSize().y)) { return false; }
        if (this.groundPieces[positionIndex].getGroundSubtype() === type) { return true; }
        return false;
    }

    plantTree(indexOverride) {
        let positionIndex = indexOverride ? indexOverride : parseInt(Math.random() * (TestWorld.getWorldSize().x * TestWorld.getWorldSize().z));
        while (!this.isGroundSubtype(positionIndex, "Grass")) { positionIndex = Math.random() * (TestWorld.getWorldSize().x * TestWorld.getWorldSize().z); }

        let tree = new Tree({ height: "100", blockPositionIndex: { row: parseInt(positionIndex / TestWorld.getWorldSize().x), column: positionIndex % TestWorld.getWorldSize().x }})
        tree.worldObject.meshCollection.forEach((mesh) => this.scene.add(mesh));
        this.groundPieces[positionIndex].setGroundSubtype("Tree");

        this.trees["tree" + positionIndex.toString()] = tree;
        tree.groundBlock = this.groundPieces[positionIndex];
    }

    destroyTree(positionIndex) {
        if (!this.isGroundSubtype(positionIndex, "Tree")) { console.log(`Attempted to remove non-existent tree at index ${positionIndex}`); return; }

        let tree = this.trees["tree" + positionIndex.toString()];
        tree.worldObject.meshCollection.forEach((mesh) => this.scene.remove(mesh));
        tree = null;

        this.groundPieces[positionIndex].setGroundSubtype("Grass");
    }

    plantCrop(positionIndex) {
        if (!this.isGroundSubtype(positionIndex, "Dirt")) { console.log("Attempted to plant a crop on the wrong type of GroundPlot"); return; }
        
        let crop = new Crop({ cropType: "Beans", blockPositionIndex: { row: parseInt(positionIndex / TestWorld.getWorldSize().x), column: positionIndex % TestWorld.getWorldSize().x }});
        crop.worldObject.meshCollection.forEach((mesh) => this.scene.add(mesh));
        this.groundPieces[positionIndex].setGroundSubtype("Crop");

        this.crops["crop" + positionIndex.toString()] = crop;
        crop.groundBlock = this.groundPieces[positionIndex];
        this.scene.add(crop.meshGroup);
    }

    harvestCrop(positionIndex) {

    }

    static getWorldSize() { return { x: 20, z: 20 }; }
    static getPositionIndexFromBlocks(blocks) {  return (blocks.row * TestWorld.getWorldSize().x) + blocks.column; }
    static getBlocksFromPositionIndex(positionIndex) { return { row: parseInt(positionIndex / TestWorld.getWorldSize().x), column: positionIndex % TestWorld.getWorldSize().x } };

    createCharacter() {
        let character = new Character();
        this.characters.push(character);
        character.worldObject.meshCollection.forEach((mesh) => this.scene.add(mesh));

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
    }

    update(timeDelta) {
        this.characters.forEach((character) => character.update(timeDelta));
        for (let crop in this.crops) { this.crops[crop].update(timeDelta); }
    }

    getScene() { return this.scene; }
    getAmbientLight() { return this.ambientLight; }
    getLight() { return this.light; }
};