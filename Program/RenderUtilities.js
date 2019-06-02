
function customizeShadow(mesh, opacity){ //opacity, target mesh
    var material_shadow = new THREE.ShadowMaterial({opacity: opacity});
    var mesh_shadow = new THREE.Mesh(mesh.geometry, material_shadow);
    mesh_shadow.position.set(mesh.position.x, mesh.position.y, mesh.position.z);
    mesh_shadow.receiveShadow = true;
    return mesh_shadow;
}