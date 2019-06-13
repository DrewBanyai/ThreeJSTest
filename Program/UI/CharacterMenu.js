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
		let hungerLabel = document.createElement( 'div' );
		hungerLabel.id = "HungerLabel",
		hungerLabel.style.position = 'absolute';
		hungerLabel.style.top = '10px';
		hungerLabel.style.left = "10px";
		hungerLabel.style.width = '100%';
		hungerLabel.innerHTML = "HUNGER";
		container.appendChild( hungerLabel );
		
		//  Create the thirst label at the top of the screen
		let thirstLabel = document.createElement( 'div' );
		thirstLabel.id = "ThirstLabel",
		thirstLabel.style.position = 'absolute';
		thirstLabel.style.top = '30px';
		thirstLabel.style.left = "10px";
		thirstLabel.style.width = '100%';
		thirstLabel.innerHTML = "THIRST";
		container.appendChild( thirstLabel );
		
		//  Create the exhaustion label at the top of the screen
		let exhaustionLabel = document.createElement( 'div' );
		exhaustionLabel.id = "ExhaustionLabel",
		exhaustionLabel.style.position = 'absolute';
		exhaustionLabel.style.top = '50px';
		exhaustionLabel.style.left = "10px";
		exhaustionLabel.style.width = '100%';
		exhaustionLabel.innerHTML = "EXHAUSTION";
		container.appendChild( exhaustionLabel );
		
		//  Create the wood label at the top of the screen
		let woodLabel = document.createElement( 'div' );
		woodLabel.id = "WoodLabel",
		woodLabel.style.position = 'absolute';
		woodLabel.style.top = '70px';
		woodLabel.style.left = "10px";
		woodLabel.style.width = '100%';
		woodLabel.innerHTML = "WOOD";
		container.appendChild( woodLabel );

        container.style.visibility = "hidden";

        container.setCharacter = (character) => this.setCharacter(character);
        container.update = () => this.update();
        
        return container;
    }

    setCharacter(character) {
        this.character = character.baseObject;
    }

    update() {
        if (this.character === null || this.content.style.visibility === "hidden") { return; }

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
		return (element.style.visibility === "visible");
	}

	static ToggleMenu() {
		if (CharacterMenu.IsMenuActive()) { CharacterMenu.HideMenu(); }
		else { CharacterMenu.ShowMenu(); }
	}

	static ShowMenu() {
		let element = document.getElementById("CharacterMenuContainer");
		if (!element) { console.log("Element 'CharacterMenuContainer' could not be found!"); return; }
		element.style.visibility = "visible";
	}

	static HideMenu() {
		let element = document.getElementById("CharacterMenuContainer");
		if (!element) { console.log("Element 'CharacterMenuContainer' could not be found!"); return; }
		element.style.visibility = "hidden";
	}
};