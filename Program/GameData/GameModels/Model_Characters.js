let generateModel_BasicCharacter = (model) => {
    model.colors = {
        head: "rgb(200, 100, 100)",
        body: "rgb(100, 200, 100)",
        arm1: "rgb(100, 100, 200)",
        arm2: "rgb(100, 60, 200)",
        leg1: "rgb(100, 100, 100)",
        leg2: "rgb(100, 60, 100)",
    };

    model.sizes = { 
        head: { x: 0.090, y: 0.090, z: 0.090 }, 
        body: { x: 0.120, y: 0.150, z: 0.050 }, 
        arms: { x: 0.050, y: 0.120, z: 0.050 }, 
        legs: { x: 0.050, y: 0.130, z: 0.050 }
    };

    model.parts = {};

    let headGeom = new THREE.BoxBufferGeometry(model.sizes.head.x, model.sizes.head.y, model.sizes.head.z);
    model.parts.head = new THREE.Mesh(headGeom, new THREE.MeshLambertMaterial({ color: model.colors.head }));
    let bodyGeom = new THREE.BoxBufferGeometry(model.sizes.body.x, model.sizes.body.y, model.sizes.body.z);
    model.parts.body = new THREE.Mesh(bodyGeom, new THREE.MeshLambertMaterial({ color: model.colors.body }));
    let armsGeom = new THREE.BoxBufferGeometry(model.sizes.arms.x, model.sizes.arms.y, model.sizes.arms.z);
    model.parts.arm1 = new THREE.Mesh(armsGeom, new THREE.MeshLambertMaterial({ color: model.colors.arm1 }));
    model.parts.arm2 = new THREE.Mesh(armsGeom, new THREE.MeshLambertMaterial({ color: model.colors.arm2 }));
    let legsGeom = new THREE.BoxBufferGeometry(model.sizes.legs.x, model.sizes.legs.y, model.sizes.legs.z);
    model.parts.leg1 = new THREE.Mesh(legsGeom, new THREE.MeshLambertMaterial({ color: model.colors.leg1 }));
    model.parts.leg2 = new THREE.Mesh(legsGeom, new THREE.MeshLambertMaterial({ color: model.colors.leg2 }));

    for (let part in this.model) { this.model[part].castShadow = true; }
};