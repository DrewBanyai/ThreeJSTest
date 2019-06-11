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

    },
};

CommandAction.SleepInBed = {
    Type: "SleepInBed",
    Description: "Sleep in the bed",
    action: (character, action) => {

    },
};