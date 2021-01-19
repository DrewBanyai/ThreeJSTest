class CharacterCommandListMenu {
    constructor() {
        this.character = null;
        this.commandLists = [];
        this.content = this.generateContent();
    }

    generateContent() {
        let container = new Container("CharacterCommandListMenu", {
            width: "300px",
            height: "400px",
            margin: "auto",
            backgroundColor: "white",
            color: "black",
        });

        return container.content;
    }

	SetCharacter(character) { this.character = character; }

	static SetCharacter(character) { 
		let element = document.getElementById("CharacterCommandListMenu");
		if (!element) { console.log("Element 'CharacterCommandListMenu' could not be found!"); return; }

		element.SetCharacter(character);
    }

	static IsMenuActive() { 
		let element = document.getElementById("CharacterCommandListMenu");
		if (!element) { console.log("Element 'CharacterCommandListMenu' could not be found!"); return; }
		return (!element.style.display);
	}

	static ToggleMenu() {
		if (CharacterCommandListMenu.IsMenuActive()) { CharacterCommandListMenu.HideMenu(); }
		else { CharacterCommandListMenu.ShowMenu(); }
	}

	static ShowMenu() {
		let element = document.getElementById("CharacterCommandListMenu");
		if (!element) { console.log("Element 'CharacterCommandListMenu' could not be found!"); return; }
		element.style.display = "";
	}

	static HideMenu() {
		let element = document.getElementById("CharacterCommandListMenu");
		if (!element) { console.log("Element 'CharacterCommandListMenu' could not be found!"); return; }
		element.style.display = "none";
	}
}