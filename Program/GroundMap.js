var groundPieces = {};
var diagonalWalkingEnabled = false;

var getKeyFromXZ = (x, z) => { return `(${x}, ${z})`; }
var getKeyFromColumnRow = (indexXZ) => {return getKeyFromXZ(indexXZ.x, indexXZ.z); }
var addGroundBlockToMap = (block) => { groundPieces[getKeyFromColumnRow(block.indexXZ)] = block; }
var setGroundBlockSubType = (x, z, subtype) => { groundPieces[getKeyFromXZ(x, z)].setGroundSubtype(subtype); };
var getGroundBlock = (x, z) => { return getGroundBlockFromKey(getKeyFromXZ(x, z)); }
var getGroundBlockFromKey = (key) => { let block = groundPieces[key]; return block ? block : null; }
var getRandomBlockPosition = () => { return groundPieces[Object.keys(groundPieces)[parseInt(Math.random() * Object.keys(groundPieces).length)]].indexXZ; }

var isTreePresent = (indexXZ) => {
    let block = getGroundBlock(indexXZ.x, indexXZ.z);
    if (block === null) { console.log(`isTreePresent called on non-existent block: ${getKeyFromColumnRow(indexXZ)}`); return false; }
    return (block.topper instanceof Tree);
}

var isCropPresent = (indexXZ) => {
    let block = getGroundBlock(indexXZ.x, indexXZ.z);
    if (block === null) { console.log(`isCropPresent called on non-existent block: ${getKeyFromColumnRow(indexXZ)}`); return false; }
    return (block.topper instanceof Crop);
}

var setGroundBlockTopper = (indexXZ, topper, reverse = true) => {
    let block = getGroundBlock(indexXZ.x, indexXZ.z);
    if (block === null) { console.log(`setGroundBlockTopper called on non-existent block: ${getKeyFromColumnRow(indexXZ)}`); return false; }

    block.topper = topper;
    if (topper !== null && reverse) { topper.groundBlock = block; }
}

var getGroundBlockSubType = (indexXZ) => {
    let block = getGroundBlock(indexXZ.x, indexXZ.z);
    if (block === null) { console.log(`getGroundBlockSubType called on non-existent block ${getKeyFromColumnRow(indexXZ)}`); return false; }
    if (!block.worldObject) { console.log(`getGroundBlockSubType called on a block without worldObject: ${getKeyFromColumnRow(indexXZ)}`); return false; }
    return block.worldObject.objectSubtype;
}

var getGroundBlockTopper = (indexXZ) => {
    let block = getGroundBlock(indexXZ.x, indexXZ.z);
    if (block === null) { console.log(`doesGroundBlockHaveTopper called on non-existent block ${getKeyFromColumnRow(indexXZ)}`); return false; }
    return block.topper;
}

var updateGroundMap = (timeDelta) => { for (let plot in groundPieces) { groundPieces[plot].update(timeDelta); } }

const groundTypesUnwalkable = [ "water" ];
const blockToppersUnwalkable = [ "bed", "tree" ];

var findPath = (indexXZStart, check, maxDistance = 500) => {
    //  If we're already at our destination, return a blank list of movements
    let blockKeyStart = getKeyFromColumnRow(indexXZStart);
    if (check(blockKeyStart)) { console.log("We are already at our destination"); return []; }

    //  Ensure both the starting and ending block exist
    let startBlock = getGroundBlock(indexXZStart.x, indexXZStart.z);
    if (startBlock === null) { console.log(`findPath called with non-existent starting block: ${blockKeyStart}`); return false; }

    let oldFrontier = {};
    let frontier = {};

    let addToFrontier = (indexXZ, path) => {
        let blockKey = getKeyFromColumnRow(indexXZ);
        let block = getGroundBlock(indexXZ.x, indexXZ.z);
        if (!block) { return; }
        
        let firstOrLast = check(blockKey) || columnRowsEqual(indexXZ, indexXZStart);
        if (groundTypesUnwalkable.includes(block.worldObject.objectSubtype) && !firstOrLast) { return; }
        if (block.topper && blockToppersUnwalkable.includes(block.topper.worldObject.objectType) && !firstOrLast) { return; }
        if (oldFrontier.hasOwnProperty(blockKey)) { return; }
        if (frontier.hasOwnProperty(blockKey)) { return; }
        frontier[blockKey] = path;
    }

    let pathPlusEntry = (path, entry) => { let newPath = [...path]; newPath.push(entry); return newPath; }

    let addFrontierNeighbors = (frontierEntry) => {
        let pathSize = frontierEntry.length;
        if (pathSize <= 0) { console.log("Attempting to addFrontierNeighbors to a node with an empty list!"); return; }
        let x = frontierEntry[pathSize - 1].x;
        let z = frontierEntry[pathSize - 1].z;
        addToFrontier({ x: x - 1,   z: z },         pathPlusEntry(frontierEntry, { x: x - 1,     z: z }));
        addToFrontier({ x: x, z:    z - 1 },        pathPlusEntry(frontierEntry, { x: x,         z: z - 1 }));
        addToFrontier({ x: x + 1,   z: z },         pathPlusEntry(frontierEntry, { x: x + 1,     z: z }));
        addToFrontier({ x: x, z:    z + 1 },        pathPlusEntry(frontierEntry, { x: x,         z: z + 1 }));

        //  Diagonals (cutting corners around objects looks bad, so I'm disabling these for now)
        if (diagonalWalkingEnabled) {
            addToFrontier({ x: x - 1,   z: z - 1 },     pathPlusEntry(frontierEntry, { x: x - 1,     z: z - 1 }));
            addToFrontier({ x: x + 1,   z: z - 1 },     pathPlusEntry(frontierEntry, { x: x + 1,     z: z - 1 }));
            addToFrontier({ x: x + 1,   z: z + 1 },     pathPlusEntry(frontierEntry, { x: x + 1,     z: z + 1 }));
            addToFrontier({ x: x - 1,   z: z + 1 },     pathPlusEntry(frontierEntry, { x: x - 1,     z: z + 1 }));
        }
    }
    
    //  Put in a starting index frontier entry (frontier is a list of XZ positions, beginning with the start point)
    addToFrontier(indexXZStart, [ indexXZStart ]);

    let index = 0;
    while (Object.keys(frontier).length > 0) {
        ++index;
        //  Add all frontier entries to the old frontier map, make a copy of the frontier list, then clear it
        for (let key in frontier) { oldFrontier[key] = true; }
        let currentFrontier = {}
        for (let key in frontier) { currentFrontier[key] = Object.assign(frontier[key]); }
        frontier = {};

        //  For each entry on the current frontier, check if we're at the ending block, and if not, add all neighbors
        for (let key in currentFrontier) {
            if (check(key)) { currentFrontier[key].shift(); return currentFrontier[key]; }
            if (currentFrontier[key].length <= maxDistance) { addFrontierNeighbors(currentFrontier[key]); }
        }
    }
}