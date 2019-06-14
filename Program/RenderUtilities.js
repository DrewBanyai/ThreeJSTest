
let customizeShadow = (mesh, opacity) =>{ //opacity, target mesh
    let material_shadow = new THREE.ShadowMaterial({opacity: opacity});
    let mesh_shadow = new THREE.Mesh(mesh.geometry, material_shadow);
    mesh_shadow.position.set(mesh.position.x, mesh.position.y, mesh.position.z);
    mesh_shadow.receiveShadow = true;
    return mesh_shadow;
};

let columnRowsEqual = (a, b) => { return ((a.x === b.x) && (a.z === b.z)); };