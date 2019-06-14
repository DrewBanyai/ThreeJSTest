class CharacterMenu {
    constructor() {
        this.content = this.generateContent();
    }

    generateContent() {
        let container = document.createElement("div");
        container.id = "CharacterMenuContainer";
        container.style.width = "120px";
        container.style.height = "96px";
        container.style.backgroundColor = "white";
        container.style.border = "1px solid black";
        container.style.borderRadius = "10px";
        container.style.position = "absolute";
        container.style.top = "90px";
		
		//  Create the hunger label at the top of the screen
		let hungerLabel = new TextLabel("HungerLabel", {
			position: "absolute",
			top: "10px",
			left: "10px",
			width: "100%",
			text: "HUNGER",
		});
		container.appendChild(hungerLabel.content);
		
		//  Create the thirst label at the top of the screen
		let thirstLabel = new TextLabel("ThirstLabel", {
			position: "absolute",
			top: "30px",
			left: "10px",
			width: "100%",
			text: "THIRST",
		});
		container.appendChild(thirstLabel.content);
		
		//  Create the exhaustion label at the top of the screen
		let exhaustionLabel = new TextLabel("ExhaustionLabel", {
			position: "absolute",
			top: "50px",
			left: "10px",
			width: "100%",
			text: "EXHAUSTION",
		});
		container.appendChild(exhaustionLabel.content);
		
		//  Create the wood label at the top of the screen
		let woodLabel = new TextLabel("WoodLabel", {
			position: "absolute",
			top: "70px",
			left: "10px",
			width: "100%",
			text: "WOOD",
		});
		container.appendChild(woodLabel.content);

        container.style.display = "none";

        container.setCharacter = (character) => this.setCharacter(character);
        container.update = () => this.update();
        
        return container;
    }

    setCharacter(character) {
        this.character = character.baseObject;
    }

    update() {
        if (this.character === null || this.content.style.display === "none") { return; }

        CharacterMenu.setHungerValue(this.character.stats.hunger);
        CharacterMenu.setThirstValue(this.character.stats.thirst);
        CharacterMenu.setExhaustionValue(this.character.stats.exhaustion);
        CharacterMenu.setWoodValue(this.character.stats.wood);
    }

    static SetCharacter(character) {
		let element = document.getElementById("CharacterMenuContainer");
		if (!element) { console.log("Element 'CharacterMenuContainer' could not be found!"); return; }
		element.setCharacter(character);
    }

    static Update() {
		let element = document.getElementById("CharacterMenuContainer");
		if (!element) { console.log("Element 'CharacterMenuContainer' could not be found!"); return; }
        element.update();
    }

	static setHungerValue(value) {
		let element = document.getElementById("HungerLabel");
		if (!element) { console.log("Element 'HungerLabel' could not be found!"); return; }
		element.innerText = `Hunger: ${value}`;
	}

	static setThirstValue(value) {
		let element = document.getElementById("ThirstLabel");
		if (!element) { console.log("Element 'ThirstLabel' could not be found!"); return; }
		element.innerText = `Thirst: ${value}`;
	}

	static setExhaustionValue(value) {
		let element = document.getElementById("ExhaustionLabel");
		if (!element) { console.log("Element 'ExhaustionLabel' could not be found!"); return; }
		element.innerText = `Exhaustion: ${value}`;
	}

	static setWoodValue(value) {
		let element = document.getElementById("WoodLabel");
		if (!element) { console.log("Element 'WoodLabel' could not be found!"); return; }
		element.innerText = `Wood: ${value}`;
	}

	static IsMenuActive() { 
		let element = document.getElementById("CharacterMenuContainer");
		if (!element) { console.log("Element 'CharacterMenuContainer' could not be found!"); return; }
		return (!element.style.display);
	}

	static ToggleMenu() {
		if (CharacterMenu.IsMenuActive()) { CharacterMenu.HideMenu(); }
		else { CharacterMenu.ShowMenu(); }
	}

	static ShowMenu() {
		let element = document.getElementById("CharacterMenuContainer");
		if (!element) { console.log("Element 'CharacterMenuContainer' could not be found!"); return; }
		element.style.display = "";
	}

	static HideMenu() {
		let element = document.getElementById("CharacterMenuContainer");
		if (!element) { console.log("Element 'CharacterMenuContainer' could not be found!"); return; }
		element.style.display = "none";
	}
}