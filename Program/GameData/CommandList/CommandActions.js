var CommandAction = {};

CommandAction.MoveToWood = {
    Type: "MoveToWood",
    Description: "Move to the tree",
    action: (character, action) => {
        if (!character.command.treePath || character.command.treePath.length === 0) { console.log("NO TREE PATH EXISTS"); character.command.treePath = null; return; }
        if (character.command.treePath.length <= 1) { character.command.actionIndex++; return; }
        character.walkPath = character.command.treePath;
        character.command.treePath = null;
        character.busy = true;
        if (character.command.actionIndex === null || character.command.actionIndex === undefined) { character.command.actionIndex = 0; }
        character.command.actionIndex++;
        return;
    },
};

CommandAction.ChopWood = {
    Type: "ChopWood",
    Description: "Chop down the tree",
    action: (character, action) => {
        if (character.walkPath) { console.log("WALK PATH EXISTS"); return; }
        if (!character.command.destinationTree) { console.log("NO DESTINATION TREE EXISTS"); character.command.actionIndex++; return; }
        if (character.actions.chop) { character.actions.chop(character, character.command.destinationTree); }
        if (character.command.actionIndex === null || character.command.actionIndex === undefined) { character.command.actionIndex = 0; }
        character.command.treePath = null;
        character.command.actionIndex++;
        return;
    },
};

CommandAction.MoveToBed = {
    Type: "MoveToBed",
    Description: "Move to the bed",
    action: (character, action) => {
        if (!character.command.bedPath || character.command.bedPath.length === 0) { console.log("NO BED PATH EXISTS"); character.command.bedPath = null; return; }
        if (character.command.bedPath.length <= 1) { character.command.actionIndex++; return; }
        character.walkPath = character.command.bedPath;
        character.command.bedPath = null;
        character.busy = true;
        if (character.command.actionIndex === null || character.command.actionIndex === undefined) { character.command.actionIndex = 0; }
        character.command.actionIndex++;
        return;
    },
};

CommandAction.SleepInBed = {
    Type: "SleepInBed",
    Description: "Sleep in the bed",
    action: (character, action) => {
        if (character.walkPath) { console.log("WALK PATH EXISTS"); return; }
        if (!character.command.destinationBed) { console.log("NO DESTINATION BED EXISTS"); character.command.actionIndex++; return; }
        if (character.actions.sleep) { character.actions.sleep(character, character.command.destinationBed); }
        if (character.command.actionIndex === null || character.command.actionIndex === undefined) { character.command.actionIndex = 0; }
        character.command.bedPath = null;
        character.command.actionIndex++;
        return;
    },
};

CommandAction.MoveToDirt = {
    Type: "MoveToDirt",
    Description: "Move to the dirt",
    action: (character, action) => {
        if (!character.command.dirtPlotPath) { console.log("NO DIRT PLOT PATH EXISTS"); character.command.dirtPlotPath = null; return; }
        if (character.command.dirtPlotPath.length <= 1) { character.command.actionIndex++; return; }
        character.walkPath = character.command.dirtPlotPath;
        character.command.dirtPlotPath = null;
        character.busy = true;
        if (character.command.actionIndex === null || character.command.actionIndex === undefined) { character.command.actionIndex = 0; }
        character.command.actionIndex++;
        return;
    },
};

CommandAction.PlantCropOnDirt = {
    Type: "PlantCropOnDirt",
    Description: "Plant a crop in the dirt",
    action: (character, action) => {
        if (character.walkPath) { console.log("WALK PATH EXISTS"); return; }
        if (!character.command.destinationDirt) { console.log("NO DESTINATION DIRT EXISTS"); character.command.actionIndex++; return; }
        if (character.actions.plant) { character.actions.plant(character, character.command.destinationDirt); }
        if (character.command.actionIndex === null || character.command.actionIndex === undefined) { character.command.actionIndex = 0; }
        character.command.dirtPlotPath = null;
        character.command.actionIndex++;
        return;
    },
};

CommandAction.HarvestCrop = {
    Type: "HarvestCrop",
    Description: "Harvest a crop from the dirt",
    action: (character, action) => {
        if (character.walkPath) { console.log("WALK PATH EXISTS"); return; }
        if (!character.command.destinationDirt) { console.log("NO DESTINATION DIRT EXISTS"); character.command.actionIndex++; return; }
        if (character.actions.harvest) { character.actions.harvest(character, character.command.destinationDirt); }
        if (character.command.actionIndex === null || character.command.actionIndex === undefined) { character.command.actionIndex = 0; }
        character.command.dirtPlotPath = null;
        character.command.actionIndex++;
        return;
    },
};