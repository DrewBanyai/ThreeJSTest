let generateModel_GenericBed = (model, position) => {
    let bedFullHeight = 0.1;
    let plotSize = GroundBlock.getPlotSize();
    let plotYDelta = GroundBlock.getTopMiddleDelta();
    position.y += plotYDelta.y;
    let bedPostSize = { x: plotSize.x * 0.05, y: bedFullHeight * 0.38, z: plotSize.x * 0.05 };
    let bedPostGeom = new THREE.BoxBufferGeometry(bedPostSize.x, bedPostSize.y, bedPostSize.z);
    let bedFrameSize = { x: plotSize.x, y: bedFullHeight * 0.43, z: plotSize.z * 2 };
    let bedFrameGeom = new THREE.BoxBufferGeometry(bedFrameSize.x, bedFrameSize.y, bedFrameSize.z);
    let mattressSize = { x: plotSize.x * 0.9, y: bedFullHeight * 0.036, z: plotSize.z * 1.8 };
    let mattressGeom = new THREE.BoxBufferGeometry(mattressSize.x, mattressSize.y, mattressSize.z);
    let pillowSize = { x: plotSize.x * 0.9, y: bedFullHeight * 0.154, z: plotSize.z * 0.4 };
    let pillowGeom = new THREE.BoxBufferGeometry(pillowSize.x, pillowSize.y, pillowSize.z);

    let bedPostColor = "rgb(60, 60, 60)";
    let bedFrameColor = "rgb(60, 30, 10)";
    let mattressColor = "rgb(200, 200, 200)";
    let pillowColor = "rgb(200, 200, 200)";

    //  Top left bed post
    model.bedPostTL = new THREE.Mesh(bedPostGeom, new THREE.MeshLambertMaterial({ color: bedPostColor }));
    model.bedPostTL.position.set(position.x - (plotSize.x / 2) + (bedPostSize.x / 2), position.y + (bedPostSize.y / 2), position.z - (plotSize.z / 2) + (bedPostSize.z / 2));

    //  Top right bed post
    model.bedPostTR = new THREE.Mesh(bedPostGeom, new THREE.MeshLambertMaterial({ color: bedPostColor }));
    model.bedPostTR.position.set(position.x + (plotSize.x / 2) - (bedPostSize.x / 2), position.y + (bedPostSize.y / 2), position.z - (plotSize.z / 2) + (bedPostSize.z / 2));

    //  Bottom left bed post
    model.bedPostBL = new THREE.Mesh(bedPostGeom, new THREE.MeshLambertMaterial({ color: bedPostColor }));
    model.bedPostBL.position.set(position.x - (plotSize.x / 2) + (bedPostSize.x / 2), position.y + (bedPostSize.y / 2), position.z + plotSize.z + (plotSize.z / 2) - (bedPostSize.z / 2));

    //  Bottom right bed post
    model.bedPostBR = new THREE.Mesh(bedPostGeom, new THREE.MeshLambertMaterial({ color: bedPostColor }));
    model.bedPostBR.position.set(position.x + (plotSize.x / 2) - (bedPostSize.x / 2), position.y + (bedPostSize.y / 2), position.z + plotSize.z + (plotSize.z / 2) - (bedPostSize.z / 2));

    //  Main bed frame
    model.bedFrame = new THREE.Mesh(bedFrameGeom, new THREE.MeshLambertMaterial({ color: bedFrameColor }));
    model.bedFrame.position.set(position.x, position.y + bedPostSize.y + (bedFrameSize.y / 2), position.z + (plotSize.z / 2));

    //  Mattress
    model.bedMattress = new THREE.Mesh(mattressGeom, new THREE.MeshLambertMaterial({ color: mattressColor }));
    model.bedMattress.position.set(position.x, position.y + bedPostSize.y + bedFrameSize.y + (mattressSize.y / 2), position.z + (plotSize.z / 2));

    //  Pillow
    model.bedPillow = new THREE.Mesh(pillowGeom, new THREE.MeshLambertMaterial({ color: pillowColor }));
    model.bedPillow.position.set(position.x, position.y + bedPostSize.y + bedFrameSize.y + mattressSize.y + (pillowSize.y / 2), position.z - (pillowSize.z / 2));
};