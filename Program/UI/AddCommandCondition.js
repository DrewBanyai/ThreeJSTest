class AddCommandCondition {
	constructor() {
		this.content = this.generateContent();
	}

	generateContent() {
		let container = document.createElement("div");
		container.id = "AddCommandConditionContainer";
		container.style.position = "absolute";
		container.style.width = "100%",
		container.style.height = "100%";

		let modalBox = document.createElement("div");
		modalBox.id = "AddCommandCondition";
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
		modalBox.appendChild(topBarContainer);

		let addConditionButton = document.createElement("div");
		addConditionButton.id = "AddConditionButton";
		addConditionButton.style.width = "90px";
		addConditionButton.style.height = "26px";
		addConditionButton.style.borderRadius = "6px";
		addConditionButton.style.backgroundColor = "rgb(160, 160, 200)";
		addConditionButton.style.color = "rgb(64, 64, 64);";
		addConditionButton.style.border = "1px solid black";
		addConditionButton.style.lineHeight = "26px";
		addConditionButton.style.textAlign = "center";
		addConditionButton.style.margin = "10px auto 0px auto";
		addConditionButton.style.cursor = "pointer";
		addConditionButton.style.userSelect = "none";
		addConditionButton.innerText = "Save List";
		addConditionButton.onmouseenter = () => { addConditionButton.style.backgroundColor = "rgb(140, 140, 240)"; }
		addConditionButton.onmouseleave = () => { addConditionButton.style.backgroundColor = "rgb(160, 160, 200)"; }
		addConditionButton.onmousedown = () => { addConditionButton.style.backgroundColor = "rgb(140, 140, 200)"; }
		addConditionButton.onmouseup = () => { addConditionButton.style.backgroundColor = "rgb(140, 140, 240)"; }
		addConditionButton.onclick = () => { 
            this.AddCommandConditionToList();
		}
		topBarContainer.appendChild(addConditionButton);

		let closeMenuButton = document.createElement("div");
		closeMenuButton.id = "CloseMenuButton";
		closeMenuButton.style.width = "30px";
		closeMenuButton.style.height = "26px";
		closeMenuButton.style.borderRadius = "6px";
		closeMenuButton.style.backgroundColor = "rgb(220, 160, 160)";
		closeMenuButton.style.color = "rgb(64, 64, 64);";
		closeMenuButton.style.border = "1px solid black";
		closeMenuButton.style.lineHeight = "26px";
		closeMenuButton.style.textAlign = "center";
		closeMenuButton.style.margin = "10px 5px 0px 0px";
		closeMenuButton.style.cursor = "pointer";
		closeMenuButton.style.userSelect = "none";
		closeMenuButton.innerText = "X";
		closeMenuButton.onmouseenter = () => { closeMenuButton.style.backgroundColor = "rgb(240, 120, 120)"; }
		closeMenuButton.onmouseleave = () => { closeMenuButton.style.backgroundColor = "rgb(220, 160, 160)"; }
		closeMenuButton.onmousedown = () => { closeMenuButton.style.backgroundColor = "rgb(220, 120, 120)"; }
		closeMenuButton.onmouseup = () => { closeMenuButton.style.backgroundColor = "rgb(240, 120, 120)"; }
		closeMenuButton.onclick = () => { AddCommandCondition.HideMenu(); }
		topBarContainer.appendChild(closeMenuButton);
        
        container.style.visibility = "hidden";
        
        return container;
    }
    
    AddCommandConditionToList() {
        let element = document.getElementById("CreateCommandListContainer");
        if (!element) { console.log("Element 'CreateCommandListContainer' could not be found!"); return; }

        element.AddCondition(CommandCondition.WoodNearby);
    }

	static IsMenuActive() { 
		let element = document.getElementById("AddCommandConditionContainer");
		if (!element) { console.log("Element 'AddCommandConditionContainer' could not be found!"); return; }
		return (element.style.visibility === "visible");
	}

	static ToggleMenu() {
		if (AddCommandCondition.IsMenuActive()) { AddCommandCondition.HideMenu(); }
		else { AddCommandCondition.ShowMenu(); }
	}

	static ShowMenu() {
		let element = document.getElementById("AddCommandConditionContainer");
		if (!element) { console.log("Element 'AddCommandConditionContainer' could not be found!"); return; }
		element.style.visibility = "visible";
	}

	static HideMenu() {
		let element = document.getElementById("AddCommandConditionContainer");
		if (!element) { console.log("Element 'AddCommandConditionContainer' could not be found!"); return; }
		element.style.visibility = "hidden";
	}
};