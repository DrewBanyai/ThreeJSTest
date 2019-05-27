class GroundBlock {
    constructor(data) {
        this.object = new WorldObject({ type: "GroundBlock", subtype: (data.groundType ? data.groundType : "Grass"), baseObject: this });
        this.blockPositionIndex = data.blockPositionIndex;
        this.grass = new THREE.Group();
        this.content = this.generateContent();
    }

    generateContent() {
        //  Create a basic block geometry and then generate a mesh with it
        let geometry = new THREE.BoxBufferGeometry(GroundBlock.getPlotSize().x, GroundBlock.getPlotSize().y, GroundBlock.getPlotSize().z);
        let groundMesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: GroundBlock.getGroundBlockColor(this.object.objectSubtype) }));

        let position = (this.blockPositionIndex ? GroundBlock.getBlockPosition(this.blockPositionIndex) : (new THREE.Vector3()));
        groundMesh.position.set(position.x, position.y, position.z);

        groundMesh.castShadow = false;
        groundMesh.receiveShadow = true;

        groundMesh.worldObject = this.object;

        if (this.blockPositionIndex.row === 8 && this.blockPositionIndex.column === 4) { this.addGrass(); }

        this.object.addToMeshCollection(groundMesh);

        return groundMesh;
    }

    setGroundSubtype(subtype) {
        //  TODO: Get rid of any special additions from the old subtype (this.object.objectSubtype)

        this.object.objectSubtype = subtype;
        this.content.material.color.set(GroundBlock.getGroundBlockColor(this.object.objectSubtype));

        //  TODO: Add any special additions from the new subtype (this.object.objectSubtype)
        if (subtype === "Grass") { this.addGrass(); }
    }

    addGrass() {
        if (this.grass.length !== 0) { return; }

        let grassColor = new THREE.Color().setHSL( 0.3, 0.75, ( 0 / 15 ) * 0.4 + 0.1 )

        var geometry = new THREE.PlaneBufferGeometry( 100, 100 );
        var texture = new THREE.CanvasTexture( GroundBlock.generateGrassTexture() );
        var material = new THREE.MeshBasicMaterial( { color: grassColor, map: texture, depthTest: false, depthWrite: false, transparent: true } );
        var mesh = new THREE.Mesh( geometry, material );

        let position = (this.blockPositionIndex ? GroundBlock.getBlockPosition(this.blockPositionIndex) : (new THREE.Vector3()));
        mesh.position.set(position.x, position.y + 100, position.z);

        this.grass.add(mesh);

        this.object.addToMeshCollection(this.grass);
    }

    static getPlotSize() { return { x: 100, y: 100, z: 100 }; }

    static getGroundBlockColor(subtype) {
        switch (subtype) {
            case "Grass":       return "rgb(40, 200, 40)";
            case "Dirt":        return "rgb(89, 60, 31)";
            default:            return "rgb(255, 0, 255)";
        }
    }

    static generateGrassTexture() {
        let canvas = document.createElement( 'canvas' );
        canvas.width = 128;
        canvas.height = 128;
        var context = canvas.getContext( '2d' );
        for ( var i = 0; i < 4000; i ++ ) {
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