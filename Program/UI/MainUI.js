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

		this.CreateCommandListMenus(container);

		return container;
	}

	CreateCommandListMenus(container) {
		//  Command List Menu Container
		let commandListMenuContainer = document.createElement("div");
		commandListMenuContainer.style.color = "black";
		container.appendChild(commandListMenuContainer);

		let chooseCL = new ChooseCommandList();
		commandListMenuContainer.appendChild(chooseCL.content);

		let createCL = new CreateCommandList();
		createCL.content.style.display = "none";
		commandListMenuContainer.appendChild(createCL.content);

		let addCondition = new AddCommandCondition();
		commandListMenuContainer.appendChild(addCondition.content);

		let addAction = new AddCommandAction();
		commandListMenuContainer.appendChild(addAction.content);
	}

	static setColor(color) { 
		let container = document.getElementById("MainUIContainer");
		if (!container) { console.log("Element 'MainUIContainer' could not be found!"); return; }
		container.style.color = color;
	}

	static setDayTimeValue(value) {
		let element = document.getElementById("DayTimeLabel");
		if (!element) { console.log("Element 'DayTimeLabel' could not be found!"); return; }
		element.innerText = value;
	}
};