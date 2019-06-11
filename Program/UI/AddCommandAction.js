class AddCommandAction {
	constructor() {
		this.content = this.generateContent();
	}

	generateContent() {
		let container = document.createElement("div");
		container.id = "AddCommandActionContainer";
		container.style.position = "absolute";
		container.style.width = "100%",
		container.style.height = "100%";

		let modalBox = document.createElement("div");
		modalBox.id = "AddCommandAction";
		modalBox.style.width = "400px";
		modalBox.style.height = "300px";
		modalBox.style.background = "darkgray";
		modalBox.style.border = "1px solid black";
		modalBox.style.borderRadius = "6px";
		modalBox.style.position = "relative";
        modalBox.style.top = "250px";
		modalBox.style.margin = "auto";
        container.appendChild(modalBox);

		let topBarContainer = document.createElement("div");
		topBarContainer.id = "TopBarContainer";
		topBarContainer.style.width = "100%";
		topBarContainer.style.display = "inline-flex";
		topBarContainer.style.margin = "0px 0px 4px 0px";
		modalBox.appendChild(topBarContainer);

		let closeMenuButton = document.createElement("div");
		closeMenuButton.id = "CloseMenuButton";
		closeMenuButton.style.width = "20px";
		closeMenuButton.style.height = "20px";
		closeMenuButton.style.borderRadius = "6px";
		closeMenuButton.style.backgroundColor = "rgb(240, 120, 120)";
		closeMenuButton.style.color = "rgb(64, 64, 64);";
		closeMenuButton.style.border = "1px solid black";
		closeMenuButton.style.lineHeight = "20px";
		closeMenuButton.style.textAlign = "center";
		closeMenuButton.style.margin = "5px 5px 0px auto";
		closeMenuButton.style.cursor = "pointer";
		closeMenuButton.style.userSelect = "none";
		closeMenuButton.innerText = "X";
		closeMenuButton.onmouseenter = () => { closeMenuButton.style.backgroundColor = "rgb(240, 120, 120)"; }
		closeMenuButton.onmouseleave = () => { closeMenuButton.style.backgroundColor = "rgb(220, 160, 160)"; }
		closeMenuButton.onmousedown = () => { closeMenuButton.style.backgroundColor = "rgb(220, 120, 120)"; }
		closeMenuButton.onmouseup = () => { closeMenuButton.style.backgroundColor = "rgb(240, 120, 120)"; }
		closeMenuButton.onclick = () => { AddCommandAction.HideMenu(); }
		topBarContainer.appendChild(closeMenuButton);

		let optionsList = document.createElement("div");
		optionsList.id = "OptionsList";
		optionsList.style.width = "90%";
		optionsList.style.height = "260px";
		optionsList.style.textAlign = "center";
		optionsList.style.margin = "auto";
		modalBox.appendChild(optionsList);

		let addOption = (icon, action) => {
			let option = document.createElement("div");
			option.style.width = "100%";
			option.style.height = "32px";
			option.style.backgroundColor = "white";
			option.style.border = "1px solid black";
			option.style.borderRadius = "6px";
			option.style.margin = "0px auto 3px auto";

			let optionLabel = document.createElement("span");
			optionLabel.innerText = action.Description;
			optionLabel.style.lineHeight = option.style.height;
			option.appendChild(optionLabel);

			option.command = action;
			option.onclick = () => { 
				this.AddCommandActionToList(action);
				AddCommandAction.HideMenu();
			 };

			 optionsList.appendChild(option);
		};

		addOption(null, CommandAction.MoveToWood);
		addOption(null, CommandAction.ChopWood);
		addOption(null, CommandAction.MoveToBed);
		addOption(null, CommandAction.SleepInBed);
		addOption(null, CommandAction.MoveToDirt);
		addOption(null, CommandAction.PlantCropOnDirt);
		addOption(null, CommandAction.HarvestCrop);
        
        container.style.visibility = "hidden";
        
        return container;
    }
    
    AddCommandActionToList(option) {
        let element = document.getElementById("CreateCommandListContainer");
        if (!element) { console.log("Element 'CreateCommandListContainer' could not be found!"); return; }

        element.AddAction(option);
    }

	static IsMenuActive() { 
		let element = document.getElementById("AddCommandActionContainer");
		if (!element) { console.log("Element 'AddCommandActionContainer' could not be found!"); return; }
		return (element.style.visibility === "visible");
	}

	static ToggleMenu() {
		if (AddCommandAction.IsMenuActive()) { AddCommandAction.HideMenu(); }
		else { AddCommandAction.ShowMenu(); }
	}

	static ShowMenu() {
		let element = document.getElementById("AddCommandActionContainer");
		if (!element) { console.log("Element 'AddCommandActionContainer' could not be found!"); return; }
		element.style.visibility = "visible";
	}

	static HideMenu() {
		let element = document.getElementById("AddCommandActionContainer");
		if (!element) { console.log("Element 'AddCommandActionContainer' could not be found!"); return; }
		element.style.visibility = "hidden";
	}
};