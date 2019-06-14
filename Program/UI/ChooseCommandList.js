class ChooseCommandList {
    constructor() {
        this.character = null;
        this.commandList = null;
        this.content = this.generateContent();
        this.Update();
    }

    generateContent() {
		let container = document.createElement("div");
		container.id = "ChooseCommandListContainer";
		container.style.position = "absolute";
		container.style.width = "100%";
		container.style.height = "100%";

		let modalBox = document.createElement("div");
		modalBox.id = "ChooseCommandList";
		modalBox.style.width = "460px";
		modalBox.style.height = "400px";
		modalBox.style.background = "darkgray";
		modalBox.style.border = "1px solid black";
		modalBox.style.borderRadius = "6px";
		modalBox.style.position = "relative";
		modalBox.style.top = "200px";
        modalBox.style.margin = "auto";
        modalBox.style.textAlign = "center";
        container.appendChild(modalBox);

		let titleAndExitContainer = document.createElement("div");
		titleAndExitContainer.id = "TitleAndExitContainer";
		titleAndExitContainer.style.width = "100%";
		titleAndExitContainer.style.display = "inline-flex";
		modalBox.appendChild(titleAndExitContainer);

		let chooseCommandListLabel = new TextLabel("ChooseCommandListLabel", {
            width: "100%",
            margin: "5px auto 5px auto",
			text: "Choose Command List:",
		});
		titleAndExitContainer.appendChild(chooseCommandListLabel.content);

		let closeMenuButton = document.createElement("div");
		closeMenuButton.id = "CloseCommandListButton";
		closeMenuButton.style.width = "16px";
		closeMenuButton.style.height = "16px";
		closeMenuButton.style.borderRadius = "6px";
		closeMenuButton.style.backgroundColor = "rgb(220, 160, 160)";
		closeMenuButton.style.color = "rgb(64, 64, 64);";
		closeMenuButton.style.border = "1px solid black";
		closeMenuButton.style.lineHeight = "16px";
		closeMenuButton.style.textAlign = "center";
		closeMenuButton.style.margin = "3px 9px 0px 0px";
		closeMenuButton.style.cursor = "pointer";
		closeMenuButton.style.userSelect = "none";
		closeMenuButton.innerText = "X";
		closeMenuButton.onmouseenter = () => { closeMenuButton.style.backgroundColor = "rgb(240, 120, 120)"; };
		closeMenuButton.onmouseleave = () => { closeMenuButton.style.backgroundColor = "rgb(220, 160, 160)"; };
		closeMenuButton.onmousedown = () => { closeMenuButton.style.backgroundColor = "rgb(220, 120, 120)"; };
		closeMenuButton.onmouseup = () => { closeMenuButton.style.backgroundColor = "rgb(240, 120, 120)"; };
		closeMenuButton.onclick = () => { ChooseCommandList.HideMenu(); };
		titleAndExitContainer.appendChild(closeMenuButton);

		let newCommandListButton = null;
		this.commandList = document.createElement("div");
		this.commandList.id = "ExistingCommandList";
		this.commandList.style.width = "440px";
		this.commandList.style.height = "350px";
		this.commandList.style.maxHeight = "350px";
		this.commandList.style.backgroundColor = "white";
		this.commandList.style.border = "1px solid black";
        this.commandList.style.borderRadius = "6px";
        this.commandList.style.margin = "10px auto 10px auto";
		this.commandList.onmouseenter = () => {
			newCommandListButton = document.createElement("div");
			newCommandListButton.id = "NewCommandListButton";
			newCommandListButton.style.width = "240px";
			newCommandListButton.style.height = "20px";
			newCommandListButton.style.margin = "4px auto 4px auto";
			newCommandListButton.style.backgroundColor = "rgb(0, 0, 0)";
			newCommandListButton.style.borderRadius = "6px";
			newCommandListButton.style.color = "white";
			newCommandListButton.style.textAlign = "center";
			newCommandListButton.style.lineHeight = "21px";
			newCommandListButton.style.cursor = "pointer";
			newCommandListButton.style.userSelect = "none";
			newCommandListButton.innerText = "Add New Command List";
			newCommandListButton.onmouseenter = () => { newCommandListButton.style.backgroundColor = "rgb(64, 64, 64)"; };
			newCommandListButton.onmouseleave = () => { newCommandListButton.style.backgroundColor = "rgb(0, 0, 0)"; };
			newCommandListButton.onmousedown = () => { newCommandListButton.style.backgroundColor = "rgb(80, 80, 80)"; };
			newCommandListButton.onmouseup = () => { newCommandListButton.style.backgroundColor = "rgb(64, 64, 64)"; };
			newCommandListButton.onclick = () => {
				ChooseCommandList.HideMenu();
				CreateCommandList.ShowMenu();
			};
			this.commandList.appendChild(newCommandListButton);
		};
		this.commandList.onmouseleave = () => {
            let element = document.getElementById("ChooseCommandListContainer");
			if (newCommandListButton === null) { return; }
			this.commandList.removeChild(newCommandListButton);
			newCommandListButton = null;
		};
        modalBox.appendChild(this.commandList);
        
        container.SetCharacter = (character) => this.SetCharacter(character);
        container.Update = () => this.Update();
        
        container.style.display = "none";

        return container;
    }

    AddCommandListOption(clData) {
        let option = document.createElement("div");
        option.style.width = "90%";
        option.style.height = "28px";
        option.style.backgroundColor = "white";
        option.style.border = "1px solid black";
        option.style.borderRadius = "6px";
        option.style.margin = "5px auto 0px auto";

        let optionLabel = new TextLabel("CommandListOptionLabel", {
            text: clData.Name,
            lineHeight: option.style.height,
        });
        option.appendChild(optionLabel.content);

        option.command = clData;
        option.onclick = (e) => {
            this.SaveCommandListToCharacter(e.srcElement.textContent);
            ChooseCommandList.HideMenu();
        };

        this.commandList.appendChild(option);
    }

	SetCharacter(character) { this.character = character; }

    Update() {
        this.commandList.innerHTML = "";
        for (let clKey in CommandListList) { this.AddCommandListOption({ Name: clKey }); }
    }

    SaveCommandListToCharacter(clName) {
        this.character.SetCommandList(clName);
    }

	static SetCharacter(character) { 
		let element = document.getElementById("ChooseCommandListContainer");
		if (!element) { console.log("Element 'ChooseCommandListContainer' could not be found!"); return; }

		element.SetCharacter(character);
	 }

	static IsMenuActive() { 
		let element = document.getElementById("ChooseCommandListContainer");
		if (!element) { console.log("Element 'ChooseCommandListContainer' could not be found!"); return; }
		return (!element.style.display);
	}

	static ToggleMenu() {
		if (ChooseCommandList.IsMenuActive()) { ChooseCommandList.HideMenu(); }
		else { ChooseCommandList.ShowMenu(); }
	}

	static ShowMenu() {
		let element = document.getElementById("ChooseCommandListContainer");
		if (!element) { console.log("Element 'ChooseCommandListContainer' could not be found!"); return; }
		element.style.display = "";
	}

	static HideMenu() {
		let element = document.getElementById("ChooseCommandListContainer");
		if (!element) { console.log("Element 'ChooseCommandListContainer' could not be found!"); return; }
		element.style.display = "none";
    }
    
    static Update() {
		let element = document.getElementById("ChooseCommandListContainer");
		if (!element) { console.log("Element 'ChooseCommandListContainer' could not be found!"); return; }
		element.Update();
    }
}