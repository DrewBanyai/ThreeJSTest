var CommandCondition = {};

CommandCondition.WoodNearby = {
    conditionType: "WoodNearby",
    Description: "If there is a tree within 30 spaces...",
    searchRadius: 30,
    check: (character, condition) => { 
        if (character.command.treePath) { return true; }
        let treeExistsCheck = (key) => { if (getGroundBlockFromKey(key).topper instanceof Tree) { character.command.destinationTree = getGroundBlockFromKey(key); return true; } return false; };
        character.command.treePath = findPath(character.indexXZ, treeExistsCheck, condition.searchRadius);
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
        let waterExistsCheck = (key) => { return (getGroundBlockFromKey(key).worldObject.objectSubtype === "water"); }
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
        let dirtPlotExistsCheck = (key) => { return (getGroundBlockFromKey(key).worldObject.objectSubtype === "dirt" && !isCropPresentAtKey(key)); }
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
        let dirtPlotExistsCheck = (key) => { return (getGroundBlockFromKey(key).worldObject.objectSubtype === "dirt" && isCropGrownAtKey(key)); }
        character.command.dirtPlotPath = findPath(character.indexXZ, dirtPlotExistsCheck, condition.searchRadius);
        if (!character.command.dirtPlotPath || character.command.dirtPlotPath.length == 0) { return false; }
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