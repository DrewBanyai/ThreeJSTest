let CommandCondition = {};

CommandCondition.WoodNearby = {
    conditionType: "WoodNearby",
    Description: "If there is a grown tree within 60 spaces...",
    searchRadius: 60,
    check: (character, condition) => { 
        if (character.command.treePath) { return true; }
        let grownTreeCheck = (key) => { 
            let block = getGroundBlockFromKey(key);
            let tree = block.topper;
            if ((tree instanceof Tree) && (tree.currentState === Tree.stateEnum.GROWN)) {
                if (tree.targeter === character) { character.command.destinationTree = block; return true; }
                if (tree.targeter === null) { 
                    let myDestTree = character.command.destinationTree;
                    if ((myDestTree != null) && (myDestTree != block) && (myDestTree.topper instanceof Tree)) { myDestTree.topper.targeter = null; }
                    tree.targeter = character;
                    character.command.destinationTree = block;
                    return true;
                }
            }
            return false; 
        };

        character.command.treePath = findPath(character.indexXZ, grownTreeCheck, condition.searchRadius);
        if (!character.command.treePath || character.command.treePath.length == 0) { return false; }
        return true;
    },
};

CommandCondition.WaterNearby = {
    conditionType: "WaterNearby",
    Description: "If there is water within 10 spaces...",
    searchRadius: 10,
    check: (character, condition) => {
        if (character.command.waterPath) { return true; }
        let waterExistsCheck = (key) => { return (getGroundBlockFromKey(key).worldObject.objectSubtype === "water"); };
        character.command.waterPath = findPath(character.indexXZ, waterExistsCheck, condition.searchRadius);
        if (!character.command.waterPath || character.command.waterPath.length == 0) { return false; }
        return true;
    },
};

CommandCondition.DirtPlotNearby = {
    conditionType: "DirtPlotNearby",
    Description: "If there is a blank dirt plot within 20 spaces...",
    searchRadius: 20,
    check: (character, condition) => {
        if (character.command.dirtPlotPath) { return true; }
        let dirtPlotExistsCheck = (key) => { if ((getGroundBlockFromKey(key).worldObject.objectSubtype === "dirt") && (!isCropPresentAtKey(key))) { character.command.destinationDirt = getGroundBlockFromKey(key); return true; } return false; };
        character.command.dirtPlotPath = findPath(character.indexXZ, dirtPlotExistsCheck, condition.searchRadius);
        if (!character.command.dirtPlotPath || character.command.dirtPlotPath.length == 0) { return false; }
        return true;
    },
};

CommandCondition.GrownCropNearby = {
    conditionType: "GrownCropNearby",
    Description: "If there is a grown crop within 20 spaces...",
    searchRadius: 20,
    check: (character, condition) => {
        if (character.command.dirtPlotPath) { return true; }
        let dirtPlotExistsCheck = (key) => { if ((getGroundBlockFromKey(key).worldObject.objectSubtype === "dirt") && isCropGrownAtKey(key)) { character.command.destinationDirt = getGroundBlockFromKey(key); return true; } return false; };
        character.command.dirtPlotPath = findPath(character.indexXZ, dirtPlotExistsCheck, condition.searchRadius);
        if (!character.command.dirtPlotPath || character.command.dirtPlotPath.length == 0) { return false; }
        return true;
    },
};

CommandCondition.BedNearby = {
    conditionType: "BedNearby",
    Description: "If there is a bed within 40 spaces...",
    searchRadius: 40,
    check: (character, condition) => {
        if (character.command.bedPath) { return true; }
        let bedExistsCheck = (key) => { if (getGroundBlockFromKey(key).topper instanceof Bed) { character.command.destinationBed = getGroundBlockFromKey(key); return true; } return false; };
        character.command.bedPath = findPath(character.indexXZ, bedExistsCheck, condition.searchRadius);
        if (!character.command.bedPath || character.command.bedPath.length == 0) { return false; }
        return true;
    },
};

CommandCondition.Hungry = {
    conditionType: "Hungry",
    Description: "If the player is at least 20% hungry...",
    hungerLevel: 20,
    check: (character, condition) => {
        return (character.stats.hunger >= condition.hungerLevel);
    }
};

CommandCondition.Thirsty = {
    conditionType: "Thirtsy",
    Description: "If the player is at least 20% thirsty...",
    thirstLevel: 20,
    check: (character, condition) => {
        return (character.stats.thirst >= condition.thirstLevel);
    }
};

CommandCondition.Exhausted = {
    conditionType: "Exhausted",
    Description: "If the player is at least 20% exhausted...",
    exhaustionLevel: 20,
    check: (character, condition) => {
        return (character.stats.exhaustion >= condition.exhaustionLevel);
    }
};