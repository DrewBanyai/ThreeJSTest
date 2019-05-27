class TestWorld {
    constructor(data) {
        this.BackgroundColor = data.backgroundColor;
        this.AmbientLightColor = data.ambientLightColor;
        this.scene = null;
        this.ambientLight = null;
        this.light = null;
        this.groundPieces = []; //  A list of ground plot WorldObject entities
        this.characters = [];
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
	
        //  Add a new spotlight shining over all objects in the scene, with shadow effects
        this.light = new THREE.SpotLight(0xffffff, 1.5);
        this.light.position.set(0, 500, 2000);
        this.light.angle = Math.PI / 9;
        this.light.castShadow = true;
        this.light.shadow.camera.near = 1000;
        this.light.shadow.camera.far = 4000;
        this.light.shadow.mapSize.width = 1024;
        this.light.shadow.mapSize.height = 1024;
        this.scene.add(this.light);
    }

    createBasicGroundPlot() {
        for (let i = 0; i < 10; ++i) {
            for (let j = 0; j < 10; ++j) {
                let groundBlock = new GroundBlock({ groundType: "Grass", blockPositionIndex: { row: i, column: j } });

                //  Add this ground piece to the scene and also to the list of ground pieces
                groundBlock.object.meshCollection.forEach((mesh) => this.scene.add(mesh));
                this.groundPieces.push(groundBlock);
            }
        }

        //  Add the dirt plots
        this.groundPieces[88].setGroundSubtype("Dirt");
        this.groundPieces[87].setGroundSubtype("Dirt");
        this.groundPieces[86].setGroundSubtype("Dirt");
        this.groundPieces[85].setGroundSubtype("Dirt");
        this.groundPieces[84].setGroundSubtype("Grass");
    }

    createCharacter() {
        let character = new Character();
        this.characters.push(character);
        character.object.meshCollection.forEach((mesh) => this.scene.add(mesh));
    }

    getScene() { return this.scene; }
    getAmbientLight() { return this.ambientLight; }
    getLight() { return this.light; }
};