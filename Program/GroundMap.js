var groundPieces = {};

var getKeyFromXZ = (x, z) => { return `(${x}, ${z})`; }
var getKeyFromColumnRow = (columnRow) => {return getKeyFromXZ(columnRow.column, columnRow.row); }
var addGroundBlockToMap = (block) => { groundPieces[getKeyFromColumnRow(block.blockPositionIndex)] = block; }
var setGroundBlockSubType = (x, z, subtype) => { groundPieces[getKeyFromXZ(x, z)].setGroundSubtype(subtype); };
var getGroundBlock = (x, z) => { let block = groundPieces[getKeyFromXZ(x, z)]; return block ? block : null; }

var isTreePresent = (columnRow) => {
    let block = getGroundBlock(columnRow.column, columnRow.row);
    if (block === null) { console.log(`isTreePresent called on non-existent block: ${getKeyFromColumnRow(columnRow)}`); return false; }
    return (block.topper instanceof Tree);
}

var isCropPresent = (columnRow) => {
    let block = getGroundBlock(columnRow.column, columnRow.row);
    if (block === null) { console.log(`isCropPresent called on non-existent block: ${getKeyFromColumnRow(columnRow)}`); return false; }
    return (block.topper instanceof Crop);
}

var setGroundBlockTopper = (columnRow, topper, reverse = true) => {
    let block = getGroundBlock(columnRow.column, columnRow.row);
    if (block === null) { console.log(`setGroundBlockTopper called on non-existent block: ${getKeyFromColumnRow(columnRow)}`); return false; }

    block.topper = topper;
    if (topper !== null && reverse) { topper.groundBlock = block; }
}

var getGroundBlockSubType = (columnRow) => {
    let block = getGroundBlock(columnRow.column, columnRow.row);
    if (block === null) { console.log(`getGroundBlockSubType called on non-existent block ${getKeyFromColumnRow(columnRow)}`); return false; }
    if (!block.worldObject) { console.log(`getGroundBlockSubType called on a block without worldObject: ${getKeyFromColumnRow(columnRow)}`); return false; }
    return block.worldObject.objectSubtype;
}

var getGroundBlockTopper = (columnRow) => {
    let block = getGroundBlock(columnRow.column, columnRow.row);
    if (block === null) { console.log(`doesGroundBlockHaveTopper called on non-existent block ${getKeyFromColumnRow(columnRow)}`); return false; }
    return block.topper;
}

var updateGroundMap = (timeDelta) => { for (let plot in groundPieces) { groundPieces[plot].update(timeDelta); } }

var navigateWalk = (columnRowStart, columnRowEnd) => {
    //  If we're already at our destination, return a blank list of movements
    if (columnRowStart === columnRowEnd) { return []; }
    let blockKeyStart = getKeyFromColumnRow(columnRowStart);
    let blockKeyEnd = getKeyFromColumnRow(columnRowEnd);

    //  Ensure both the starting and ending block exist
    let startBlock = getGroundBlock(columnRowStart.column, columnRowStart.row);
    if (startBlock === null) { console.log(`navigateWalk called with non-existent starting block: ${blockKeyStart}`); return false; }
    let endBlock = getGroundBlock(columnRowEnd.column, columnRowEnd.row);
    if (endBlock === null) { console.log(`navigateWalk called with non-existent ending block: ${blockKeyEnd}`); return false; }

    //  Ensure we haven't got two of the same block in the groundPieces list
    if (startBlock === endBlock) { console.log(`Attempted to navigate to the same ending block as the starting block? (${blockKeyStart} => ${blockKeyEnd})`); return []; }

    let oldFrontier = {};
    let frontier = {};

    let addToFrontier = (columnRow, path) => {
        let blockKey = getKeyFromColumnRow(columnRow);
        if (oldFrontier.hasOwnProperty(blockKey)) { return; }
        if (frontier.hasOwnProperty(blockKey)) { return; }
        frontier[blockKey] = path;
    }

    let pathPlusEntry = (path, entry) => { let newPath = [...path]; newPath.push(entry); return newPath; }

    let addFrontierNeighbors = (frontierEntry) => {
        let pathSize = frontierEntry.length;
        if (pathSize <= 0) { console.log("Attempting to addFrontierNeighbors to a node with an empty list!"); return; }
        //console.log([...frontierEntry]);
        let x = frontierEntry[pathSize - 1].column;
        let z = frontierEntry[pathSize - 1].row;
        addToFrontier({ column: x - 1, row: z },      pathPlusEntry(frontierEntry, { column: x - 1, row: z }));
        addToFrontier({ column: x, row: z - 1 },      pathPlusEntry(frontierEntry, { column: x, row: z - 1 }));
        addToFrontier({ column: x + 1, row: z },      pathPlusEntry(frontierEntry, { column: x + 1, row: z }));
        addToFrontier({ column: x, row: z + 1 },      pathPlusEntry(frontierEntry, { column: x, row: z + 1 }));
        addToFrontier({ column: x - 1, row: z - 1 },  pathPlusEntry(frontierEntry, { column: x - 1, row: z - 1 }));
        addToFrontier({ column: x + 1, row: z - 1 },  pathPlusEntry(frontierEntry, { column: x + 1, row: z - 1 }));
        addToFrontier({ column: x + 1, row: z + 1 },  pathPlusEntry(frontierEntry, { column: x + 1, row: z + 1 }));
        addToFrontier({ column: x - 1, row: z + 1 },  pathPlusEntry(frontierEntry, { column: x - 1, row: z + 1 }));
    }

    let cloneDict = (dict) => { 
        let clone = {};
        for (let key in dict) { clone[key] = dict[key]; }
        return clone;
    }
    
    //  Put in a starting index frontier entry (frontier is a list of XZ positions, beginning with the start point)
    addToFrontier(columnRowStart, [ columnRowStart ]);

    let index = 0;
    while (Object.keys(frontier).length > 0) {
        ++index;
        //  Add all frontier entries to the old frontier map, make a copy of the frontier list, then clear it
        for (let key in frontier) { oldFrontier[key] = [...frontier[key]]; }
        let currentFrontier = {}
        for (let key in frontier) { currentFrontier[key] = Object.assign(frontier[key]); }
        frontier = {};

        //  For each entry on the current frontier, check if we're at the ending block, and if not, add all neighbors
        for (let key in currentFrontier) {
            if (key === blockKeyEnd) { currentFrontier[key].shift(); return currentFrontier[key]; }
            addFrontierNeighbors(currentFrontier[key]);
        }
    }
}