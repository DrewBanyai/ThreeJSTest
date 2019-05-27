class GroundBlock {
    constructor(data) {
        this.worldObject = new WorldObject({ type: "GroundBlock", subtype: (data.groundType ? data.groundType : "Grass"), baseObject: this });
        this.blockPositionIndex = data.blockPositionIndex;
        this.grass = null;
        this.crop = null;
        this.updateFunc = null;
        this.content = this.generateContent();
    }

    generateContent() {
        //  Create a basic block geometry and then generate a mesh with it
        let geometry = new THREE.BoxBufferGeometry(GroundBlock.getPlotSize().x, GroundBlock.getPlotSize().y, GroundBlock.getPlotSize().z);
        let groundMesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: GroundBlock.getGroundBlockColor(this.worldObject.objectSubtype) }));

        let position = (this.blockPositionIndex ? GroundBlock.getBlockPosition(this.blockPositionIndex) : (new THREE.Vector3()));
        groundMesh.position.set(position.x, position.y, position.z);

        groundMesh.castShadow = false;
        groundMesh.receiveShadow = true;

        if (this.worldObject.objectSubtype === "Grass") { this.addGrass(); }

        this.worldObject.addToMeshCollection(groundMesh);

        return groundMesh;
    }

    getGroundSubtype() { return this.worldObject.objectSubtype; }

    setGroundSubtype(subtype) {
        //  Get rid of any special additions from the old subtype (this.worldObject.objectSubtype)
        if (this.worldObject.objectSubtype === "Grass") { this.removeGrass(); }

        this.worldObject.objectSubtype = subtype;
        this.content.material.color.set(GroundBlock.getGroundBlockColor(this.worldObject.objectSubtype));

        //  Add any special additions from the new subtype (this.worldObject.objectSubtype)
        if (subtype === "Grass") { this.addGrass(); }
    }

    addGrass() {
        return;
        if (this.grass !== null) { return; }
        this.grass = new THREE.Group();

        let grassBladeColor = "rgb(40, 160, 0)";
        let grassBladeSize = { x: 2, y: 10, z: 2 };
        let grassBladeGeom = new THREE.BoxBufferGeometry(grassBladeSize.x, grassBladeSize.y, grassBladeSize.z);
        for (let i = 0; i < 200; ++i) {
            let blade = new THREE.Mesh(grassBladeGeom, new THREE.MeshLambertMaterial({ color: grassBladeColor }));
            
            let position = (this.blockPositionIndex ? GroundBlock.getBlockPosition(this.blockPositionIndex) : (new THREE.Vector3()));
            blade.position.x = position.x - (GroundBlock.getPlotSize().x / 2) + (Math.random() * GroundBlock.getPlotSize().x);
            blade.position.y = position.y + 50 + (grassBladeSize.y / 2);
            blade.position.z = position.z - (GroundBlock.getPlotSize().z / 2) + (Math.random() * GroundBlock.getPlotSize().z);

            this.grass.add(blade);
        }

        this.worldObject.addToMeshCollection(this.grass);
    }

    removeGrass() {
        if (this.grass === null) { return; }
        this.worldObject.removeFromMeshCollection(this.grass);
        this.grass = null;
    }

    static getPlotSize() { return { x: 100, y: 100, z: 100 }; }
    static getTopMiddleDelta() { return new THREE.Vector3(0, 50, 0); }

    static getGroundBlockColor(subtype) {
        switch (subtype) {
            case "Grass":       return "rgb(40, 200, 40)";
            case "Tree":        return "rgb(30, 170, 30)";
            case "Dirt":        return "rgb(89, 60, 31)";
            case "Crop":        return "rgb(100, 70, 40)";
            default:            return "rgb(255, 0, 255)";
        }
    }

    static generateGrassTexture() {
        var canvas = document.createElement( 'canvas' );
        canvas.width = 512;
        canvas.height = 512;

        var context = canvas.getContext( '2d' );

        for ( var i = 0; i < 20000; i ++ ) {
            context.fillStyle = 'hsl(0,0%,' + ( Math.random() * 50 + 50 ) + '%)';
            context.beginPath();
            context.arc( Math.random() * canvas.width, Math.random() * canvas.height, Math.random() + 0.15, 0, Math.PI * 2, true );
            context.fill();
        }

        context.globalAlpha = 0.075;
        context.globalCompositeOperation = 'lighter';

        return canvas;
    }

    static getBlockPosition(blockPositionIndex) {
        let position = new THREE.Vector3();
        position.x = (-GroundBlock.getPlotSize().x * 5) + (blockPositionIndex.row * GroundBlock.getPlotSize().x);
        position.y = (-GroundBlock.getPlotSize().y / 2); //  Boxes expand from their center point by default, so these will reach 0 on the y axis.
        position.z = (-GroundBlock.getPlotSize().z * 5) + (blockPositionIndex.column * GroundBlock.getPlotSize().z);
        return position;
    }
};