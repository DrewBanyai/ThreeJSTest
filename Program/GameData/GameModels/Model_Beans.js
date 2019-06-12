var generateModel_BeansSeed = (position) => {
    let model = {};

    let cropSize = { x: 0.018, y: 0.009, z: 0.018 };
    let plotSize = GroundBlock.getPlotSize();
    let plotMiddleTop = GroundBlock.getTopMiddleDelta();
    plotMiddleTop.add(position);
    let seedGeom = new THREE.BoxBufferGeometry(cropSize.x, cropSize.y, cropSize.z);

    let position1 = (new THREE.Vector3(plotSize.x / 4, 0, plotSize.z / 6)).add(plotMiddleTop);
    model.plant1 = new THREE.Mesh(seedGeom, new THREE.MeshLambertMaterial({ color: Colors.Beans_Seed }));
    model.plant1.position.set(position1.x, position1.y, position1.z);

    let position2 = (new THREE.Vector3(-1 * plotSize.x / 8, 0, -1 * plotSize.z / 3)).add(plotMiddleTop);
    model.plant2 = new THREE.Mesh(seedGeom, new THREE.MeshLambertMaterial({ color: Colors.Beans_Seed }));
    model.plant2.position.set(position2.x, position2.y, position2.z);

    let position3 = (new THREE.Vector3(-1 * plotSize.x / 6, 0, plotSize.z / 4)).add(plotMiddleTop);
    model.plant3 = new THREE.Mesh(seedGeom, new THREE.MeshLambertMaterial({ color: Colors.Beans_Seed }));
    model.plant3.position.set(position3.x, position3.y, position3.z);

    return model;
};

var generateModel_BeansSprout = (position) => {
    let model = {};

    let cropSize = { x: 0.0144, y: 0.036, z: 0.0144 };
    let plotSize = GroundBlock.getPlotSize();
    let plotMiddleTop = GroundBlock.getTopMiddleDelta();
    plotMiddleTop.add(position);
    let seedGeom = new THREE.BoxBufferGeometry(cropSize.x, cropSize.y, cropSize.z);

    let position1 = (new THREE.Vector3(plotSize.x / 4, 0, plotSize.z / 6)).add(plotMiddleTop);
    model.plant1 = new THREE.Mesh(seedGeom, new THREE.MeshLambertMaterial({ color: Colors.Beans_Sprout }));
    model.plant1.position.set(position1.x, position1.y, position1.z);

    let position2 = (new THREE.Vector3(-1 * plotSize.x / 8, 0, -1 * plotSize.z / 3)).add(plotMiddleTop);
    model.plant2 = new THREE.Mesh(seedGeom, new THREE.MeshLambertMaterial({ color: Colors.Beans_Sprout }));
    model.plant2.position.set(position2.x, position2.y, position2.z);

    let position3 = (new THREE.Vector3(-1 * plotSize.x / 6, 0, plotSize.z / 4)).add(plotMiddleTop);
    model.plant3 = new THREE.Mesh(seedGeom, new THREE.MeshLambertMaterial({ color: Colors.Beans_Sprout }));
    model.plant3.position.set(position3.x, position3.y, position3.z);

    return model;
};

var generateModel_BeansYouth = (position) => {
    let model = {};

    let cropSize = { x: 0.0108, y: 0.072, z: 0.0108 };
    let plotSize = GroundBlock.getPlotSize();
    let plotMiddleTop = GroundBlock.getTopMiddleDelta();
    plotMiddleTop.add(position);
    let seedGeom = new THREE.BoxBufferGeometry(cropSize.x, cropSize.y, cropSize.z);

    let position1 = (new THREE.Vector3(plotSize.x / 4, 0, plotSize.z / 6)).add(plotMiddleTop);
    model.plant1 = new THREE.Mesh(seedGeom, new THREE.MeshLambertMaterial({ color: Colors.Beans_Youth }));
    model.plant1.position.set(position1.x, position1.y, position1.z);

    let position2 = (new THREE.Vector3(-1 * plotSize.x / 8, 0, -1 * plotSize.z / 3)).add(plotMiddleTop);
    model.plant2 = new THREE.Mesh(seedGeom, new THREE.MeshLambertMaterial({ color: Colors.Beans_Youth }));
    model.plant2.position.set(position2.x, position2.y, position2.z);

    let position3 = (new THREE.Vector3(-1 * plotSize.x / 6, 0, plotSize.z / 4)).add(plotMiddleTop);
    model.plant3 = new THREE.Mesh(seedGeom, new THREE.MeshLambertMaterial({ color: Colors.Beans_Youth }));
    model.plant3.position.set(position3.x, position3.y, position3.z);

    return model;
};

var generateModel_BeansGrown = (position) => {
    let model = {};

    let cropSize = { x: 0.0108, y: 0.144, z: 0.0108 };
    let plotSize = GroundBlock.getPlotSize();
    let plotMiddleTop = GroundBlock.getTopMiddleDelta();
    plotMiddleTop.add(position);
    let seedGeom = new THREE.BoxBufferGeometry(cropSize.x, cropSize.y, cropSize.z);

    let position1 = (new THREE.Vector3(plotSize.x / 4, 0, plotSize.z / 6)).add(plotMiddleTop);
    model.plant1 = new THREE.Mesh(seedGeom, new THREE.MeshLambertMaterial({ color: Colors.Beans_Grown }));
    model.plant1.position.set(position1.x, position1.y, position1.z);

    let position2 = (new THREE.Vector3(-1 * plotSize.x / 8, 0, -1 * plotSize.z / 3)).add(plotMiddleTop);
    model.plant2 = new THREE.Mesh(seedGeom, new THREE.MeshLambertMaterial({ color: Colors.Beans_Grown }));
    model.plant2.position.set(position2.x, position2.y, position2.z);

    let position3 = (new THREE.Vector3(-1 * plotSize.x / 6, 0, plotSize.z / 4)).add(plotMiddleTop);
    model.plant3 = new THREE.Mesh(seedGeom, new THREE.MeshLambertMaterial({ color: Colors.Beans_Grown }));
    model.plant3.position.set(position3.x, position3.y, position3.z);

    return model;
};