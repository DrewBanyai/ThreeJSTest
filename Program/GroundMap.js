var groundPieces = [];

var addGroundBlockToMap = (block) => { groundPieces.push(block); }
var setGroundBlockSubTypeFromIndex = (index, subtype) => { groundPieces[index].setGroundSubtype(subtype); };
var setGroundBlockSubTypeFromXZ = (x, z, subtype) => { setGroundBlockSubTypeFromIndex(WorldController.getPositionIndexFromRowColumn(x, z), subtype); };
var getGroundBlockFromIndex = (index) => { return (groundPieces.hasOwnProperty(index)) ? groundPieces[index] : null; }

var isTreePresent = (index) => {
    let block = getGroundBlockFromIndex(index);
    if (block === null) { console.log(`isTreePresent called on non-existent block: ${index}`); return false; }
    return (block.topper instanceof Tree);
}

var isCropPresent = (index) => {
    let block = getGroundBlockFromIndex(index);
    if (block === null) { console.log(`isCropPresent called on non-existent block: ${index}`); return false; }
    return (block.topper instanceof Crop);
}

var setGroundBlockTopper = (index, topper, reverse = true) => {
    let block = getGroundBlockFromIndex(index);
    if (block === null) { console.log(`setGroundBlockTopper called on non-existent block: ${index}`); return false; }

    block.topper = topper;
    if (topper !== null && reverse) { topper.groundBlock = block; }
}

var getGroundBlockSubType = (index) => { 
    let block = getGroundBlockFromIndex(index);
    if (block === null) { console.log(`getGroundBlockSubType called on non-existent block ${index}`); return false; }
    if (!block.worldObject) { console.log(`getGroundBlockSubType called on a block without worldObject: ${index}`); return false; }
    return block.worldObject.objectSubtype;
}

var getGroundBlockTopper = (index) => {
    let block = getGroundBlockFromIndex(index);
    if (block === null) { console.log(`doesGroundBlockHaveTopper called on non-existent block ${index}`); return false; }
    return block.topper;
}

var updateGroundMap = (timeDelta) => { for (let plot in groundPieces) { groundPieces[plot].update(timeDelta); } }