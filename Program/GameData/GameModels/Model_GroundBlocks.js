let generateModel_GroundBlock = (model, position) => {
    let geometry = new THREE.BoxGeometry(GroundBlock.getPlotSize().x, GroundBlock.getPlotSize().y, GroundBlock.getPlotSize().z);
    let material = new THREE.MeshLambertMaterial({ color: Colors.greenLight });
    model.block = new THREE.Mesh(geometry, material);
    model.block.frustumCulled = true;
    model.block.position.set(position.x, position.y, position.z);
    model.shadow = customizeShadow(model.block, 0.25);
};