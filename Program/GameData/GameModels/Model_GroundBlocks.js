var generateModel_GroundBlock = (position) => {
    let model = {};

    var geometry = new THREE.BoxGeometry(GroundBlock.getPlotSize().x, GroundBlock.getPlotSize().y, GroundBlock.getPlotSize().z);
    var material = new THREE.MeshLambertMaterial({ color: Colors.greenLight });
    model.block = new THREE.Mesh(geometry, material);
    model.shadow = customizeShadow(model.block, 0.25);
    model.block.position.set(position.x, position.y, position.z);

    return model;
};