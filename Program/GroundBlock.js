class GroundBlock {
    constructor(data) {
        this.worldObject = new WorldObject({ type: "GroundBlock", subtype: (data.groundType ? data.groundType : "Grass"), baseObject: this });
        this.blockPositionIndex = data.blockPositionIndex;
        this.block = null;
        this.topper = null;
        this.shadow = null;
        this.content = this.generateContent();
    }

    generateContent() {
        var geometry = new THREE.BoxGeometry(GroundBlock.getPlotSize().x, GroundBlock.getPlotSize().y, GroundBlock.getPlotSize().z);
        var material = new THREE.MeshLambertMaterial({ color: Colors.greenLight });
        this.block = new THREE.Mesh(geometry, material);

        //  Create a basic block geometry and then generate a mesh with it
        let position = (this.blockPositionIndex ? GroundBlock.getBlockPosition(this.blockPositionIndex) : (new THREE.Vector3()));
        this.block.position.set(position.x, position.y, position.z);

        if (this.worldObject.objectSubtype === "Grass") { this.addGrass(); }

        this.shadow = customizeShadow(this.block, 0.25) // mess, opacity
        this.worldObject.addToMeshGroup(this.block);
        this.worldObject.addToMeshGroup(this.shadow);

        return this.block;
    }

    getGroundSubtype() { return this.worldObject.objectSubtype; }

    setGroundSubtype(subtype) {
        //  Get rid of any special additions from the old subtype (this.worldObject.objectSubtype)
        if (this.worldObject.objectSubtype === "Grass") { this.removeGrass(); }
        if (this.worldObject.objectSubtype === "Water") { 
            this.block.position.y -= ((GroundBlock.getPlotSizeWater().y - GroundBlock.getPlotSize().y) / 2);
            this.shadow.position.y -= ((GroundBlock.getPlotSizeWater().y - GroundBlock.getPlotSize().y) / 2);
        }
        this.block.scale.y = 1.0;
        this.shadow.scale.y = 1;

        this.worldObject.objectSubtype = subtype;
        this.content.material.color.set(GroundBlock.getGroundBlockColor(this.worldObject.objectSubtype));

        //  Add any special additions from the new subtype (this.worldObject.objectSubtype)
        if (subtype === "Grass") { this.addGrass(); }
        if (subtype === "Water") { 
            this.block.scale.y = (GroundBlock.getPlotSizeWater().y / GroundBlock.getPlotSize().y);
            this.shadow.scale.y = (GroundBlock.getPlotSizeWater().y / GroundBlock.getPlotSize().y);
            this.block.position.y += ((GroundBlock.getPlotSizeWater().y - GroundBlock.getPlotSize().y) / 2);
            this.shadow.position.y += ((GroundBlock.getPlotSizeWater().y - GroundBlock.getPlotSize().y) / 2);
        }
    }

    addGrass() {
        return;
        if (this.topper && this.topper.grass === true) { console.log("Attempting to place a grass patch where one already exists!"); return; }
        this.topper = new THREE.Group();
        this.topper.grass = true;

        let grassBladeSize = { x: 2, y: 10, z: 2 };
        let grassBladeGeom = new THREE.BoxBufferGeometry(grassBladeSize.x, grassBladeSize.y, grassBladeSize.z);
        for (let i = 0; i < 200; ++i) {
            let blade = new THREE.Mesh(grassBladeGeom, new THREE.MeshLambertMaterial({ color: Colors.GrassBlade }));
            
            let position = (this.blockPositionIndex ? GroundBlock.getBlockPosition(this.blockPositionIndex) : (new THREE.Vector3()));
            blade.position.x = position.x - (GroundBlock.getPlotSize().x / 2) + (Math.random() * GroundBlock.getPlotSize().x);
            blade.position.y = position.y + 50 + (grassBladeSize.y / 2);
            blade.position.z = position.z - (GroundBlock.getPlotSize().z / 2) + (Math.random() * GroundBlock.getPlotSize().z);

            this.topper.add(blade);
        }

        this.worldObject.addToMeshGroup(this.topper);
    }

    removeGrass() {
        return; //  For now, return out... we don't have grass
        if (!this.topper || this.topper.grass !== true) { console.log("Attempting to remove a grass patch where one does not exist!"); return; }
        this.worldObject.removeFromMeshGroup(this.topper);
        this.topper = null;
    }

    static getPlotSize() { return { x: 0.18, y: 0.18, z: 0.18 }; }
    static getPlotSizeWater() { return { x: 0.18, y: 0.16, z: 0.18 }; }
    static getTopMiddleDelta() { return new THREE.Vector3(0, GroundBlock.getPlotSize().y / 2, 0); }

    static getGroundBlockColor(subtype) {
        if (Colors.hasOwnProperty("GroundBlock_" + subtype)) { return Colors["GroundBlock_" + subtype]; }
        else { return Colors.unknown; }
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
        position.x = (-GroundBlock.getPlotSize().x * 5) + (blockPositionIndex.column * GroundBlock.getPlotSize().x);
        position.y = (-GroundBlock.getPlotSize().y / 2); //  Boxes expand from their center point by default, so these will reach 0 on the y axis.
        position.z = (-GroundBlock.getPlotSize().z * 5) + (blockPositionIndex.row * GroundBlock.getPlotSize().z);
        return position;
    }
};