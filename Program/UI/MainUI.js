class MainUI {
	constructor(data) {
		this.content = this.generateContent();
	}

	generateContent() {
		let container = document.createElement("div");
		container.id = "MainUIContainer";

		//  Create the title bar at the top of the screen
		let info = document.createElement( 'div' );
		info.id = "TopScreenTitle",
		info.style.position = 'absolute';
		info.style.top = '10px';
		info.style.width = '100%';
		info.style.textAlign = 'center';
		info.innerHTML = '<a href="https://github.com/DrewBanyai/ThreeJSTest" target="_blank" rel="noopener">Basic THREE.js test</a>';
		container.appendChild( info );
		
		//  Create the object type label at the top of the screen
		let objectType = document.createElement( 'div' );
		objectType.id = "ObjectTypeTitle",
		objectType.style.position = 'absolute';
		objectType.style.top = '30px';
		objectType.style.width = '100%';
		objectType.style.textAlign = 'center';
		objectType.innerHTML = "";
		container.appendChild( objectType );
		
		//  Create the object type label at the top of the screen
		let selectedType = document.createElement( 'div' );
		selectedType.id = "SelectedTypeTitle",
		selectedType.style.position = 'absolute';
		selectedType.style.top = '50px';
		selectedType.style.width = '100%';
		selectedType.style.textAlign = 'center';
		selectedType.innerHTML = "";
		container.appendChild( selectedType );
		
		//  Create the day time label at the top of the screen
		let dayTimeLabel = document.createElement( 'div' );
		dayTimeLabel.id = "DayTimeLabel",
		dayTimeLabel.style.position = 'absolute';
		dayTimeLabel.style.top = '60px';
		dayTimeLabel.style.left = "10px";
		dayTimeLabel.style.width = '100%';
		dayTimeLabel.innerHTML = "DAY/TIME";
		container.appendChild( dayTimeLabel );
		
		//  Create the hunger label at the top of the screen
		let hungerLabel = document.createElement( 'div' );
		hungerLabel.id = "HungerLabel",
		hungerLabel.style.position = 'absolute';
		hungerLabel.style.top = '80px';
		hungerLabel.style.left = "10px";
		hungerLabel.style.width = '100%';
		hungerLabel.innerHTML = "HUNGER";
		container.appendChild( hungerLabel );
		
		//  Create the thirst label at the top of the screen
		let thirstLabel = document.createElement( 'div' );
		thirstLabel.id = "ThirstLabel",
		thirstLabel.style.position = 'absolute';
		thirstLabel.style.top = '100px';
		thirstLabel.style.left = "10px";
		thirstLabel.style.width = '100%';
		thirstLabel.innerHTML = "THIRST";
		container.appendChild( thirstLabel );
		
		//  Create the exhaustion label at the top of the screen
		let exhaustionLabel = document.createElement( 'div' );
		exhaustionLabel.id = "ExhaustionLabel",
		exhaustionLabel.style.position = 'absolute';
		exhaustionLabel.style.top = '120px';
		exhaustionLabel.style.left = "10px";
		exhaustionLabel.style.width = '100%';
		exhaustionLabel.innerHTML = "EXHAUSTION";
		container.appendChild( exhaustionLabel );
		
		//  Create the wood label at the top of the screen
		let woodLabel = document.createElement( 'div' );
		woodLabel.id = "WoodLabel",
		woodLabel.style.position = 'absolute';
		woodLabel.style.top = '140px';
		woodLabel.style.left = "10px";
		woodLabel.style.width = '100%';
		woodLabel.innerHTML = "WOOD";
		container.appendChild( woodLabel );

		return container;
	}

	static setColor(color) { 
		let container = document.getElementById("MainUIContainer");
		if (!container) { console.log("Element 'MainUIContainer' could not be found!"); return; }
		container.style.color = color;
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

	static setDayTimeValue(value) {
		let element = document.getElementById("DayTimeLabel");
		if (!element) { console.log("Element 'DayTimeLabel' could not be found!"); return; }
		element.innerText = value;
	}
};