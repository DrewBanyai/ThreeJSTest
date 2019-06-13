let generateModel_TreeGrown = (model, position) => {
    let trunkSize = { x: 0.072, y: 0.396, z: 0.072 };
    let trunkGeom = new THREE.BoxBufferGeometry(trunkSize.x, trunkSize.y, trunkSize.z);
    model.trunk = new THREE.Mesh(trunkGeom, new THREE.MeshLambertMaterial({ color: Colors.TreeTrunk }));
    model.trunk.position.set(position.x, position.y + (GroundBlock.getPlotSize().y / 2) + (trunkSize.y / 2), position.z);
    model.trunk.castShadow = true;
    model.trunk.receiveShadow = true;
    
    let treeSize = { x: 0.216, y: 0.36, z: 0.216 };
    let treeGeom = new THREE.BoxBufferGeometry(treeSize.x, treeSize.y, treeSize.z);
    model.tree = new THREE.Mesh(treeGeom, new THREE.MeshLambertMaterial({ color: Colors.TreeTop }));
    model.tree.position.set(position.x, position.y + (GroundBlock.getPlotSize().y / 2) + trunkSize.y + (treeSize.y / 2), position.z);
    model.tree.castShadow = true;
    model.tree.receiveShadow = false;

    model.shadow = customizeShadow(model.tree, 0.25); // mesh, opacity
};