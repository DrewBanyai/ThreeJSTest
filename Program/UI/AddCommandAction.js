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
		modalBox.appendChild(topBarContainer);

		let addActionButton = document.createElement("div");
		addActionButton.id = "AddActionButton";
		addActionButton.style.width = "90px";
		addActionButton.style.height = "26px";
		addActionButton.style.borderRadius = "6px";
		addActionButton.style.backgroundColor = "rgb(160, 160, 200)";
		addActionButton.style.color = "rgb(64, 64, 64);";
		addActionButton.style.border = "1px solid black";
		addActionButton.style.lineHeight = "26px";
		addActionButton.style.textAlign = "center";
		addActionButton.style.margin = "10px auto 0px auto";
		addActionButton.style.cursor = "pointer";
		addActionButton.style.userSelect = "none";
		addActionButton.innerText = "Save List";
		addActionButton.onmouseenter = () => { addActionButton.style.backgroundColor = "rgb(140, 140, 240)"; }
		addActionButton.onmouseleave = () => { addActionButton.style.backgroundColor = "rgb(160, 160, 200)"; }
		addActionButton.onmousedown = () => { addActionButton.style.backgroundColor = "rgb(140, 140, 200)"; }
		addActionButton.onmouseup = () => { addActionButton.style.backgroundColor = "rgb(140, 140, 240)"; }
		addActionButton.onclick = () => { 
            this.AddCommandActionToList();
		}
		topBarContainer.appendChild(addActionButton);

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
		closeMenuButton.onclick = () => { AddCommandAction.HideMenu(); }
		topBarContainer.appendChild(closeMenuButton);
        
        container.style.visibility = "hidden";
        
        return container;
    }
    
    AddCommandActionToList() {
        let element = document.getElementById("CreateCommandListContainer");
        if (!element) { console.log("Element 'CreateCommandListContainer' could not be found!"); return; }

        element.AddAction(CommandAction.MoveToWood);
        element.AddAction(CommandAction.ChopWood);
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