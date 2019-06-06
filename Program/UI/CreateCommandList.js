class CreateCommandList {
	constructor() {
		this.content = this.generateContent();
	}

	generateContent() {
		let container = document.createElement("div");
		container.id = "CreateCommandListContainer";
		container.style.position = "absolute";
		container.style.width = "100%",
		container.style.height = "100%";

		let modalBox = document.createElement("div");
		modalBox.id = "CreateCommandList";
		modalBox.style.width = "600px";
		modalBox.style.height = "400px";
		modalBox.style.background = "darkgray";
		modalBox.style.border = "1px solid black";
		modalBox.style.borderRadius = "6px";
		modalBox.style.position = "relative";
		modalBox.style.top = "200px",
		modalBox.style.margin = "auto";
		container.appendChild(modalBox);

		let clNameContainer = document.createElement("div");
		clNameContainer.id = "TaskNameContainer";
		clNameContainer.style.width = "100%";
		clNameContainer.style.display = "inline-flex";
		modalBox.appendChild(clNameContainer);

		let taskNameLabel = document.createElement("div");
		taskNameLabel.style.width = "132px";
		taskNameLabel.style.height = "32px";
		taskNameLabel.style.position = "relative";
		taskNameLabel.style.marginRight = "20px";
		taskNameLabel.style.top = "16px";
		taskNameLabel.style.left = "10px";
		taskNameLabel.innerText = "COMMAND LIST NAME:";
		clNameContainer.appendChild(taskNameLabel);

		let maxTaskNameLength = 36;
		let taskNameInput = document.createElement("input");
		taskNameInput.id = "TaskNameInput";
		taskNameInput.type = "text";
		taskNameInput.style.width = "294px";
		taskNameInput.style.height = "26px";
		taskNameInput.style.position = "relative";
		taskNameInput.style.top = "10px";
		taskNameInput.style.borderRadius = "6px";
		taskNameInput.style.border = "1px solid rgb(64, 64, 64)";
		taskNameInput.style.padding = "0px 6px 0px 6px";
		taskNameInput.onkeydown = () => {  if (taskNameInput.value.length > maxTaskNameLength) { taskNameInput.value = taskNameInput.value.substr(0, maxTaskNameLength); } }
		taskNameInput.onkeyup = () => {  if (taskNameInput.value.length > maxTaskNameLength) { taskNameInput.value = taskNameInput.value.substr(0, maxTaskNameLength); } }
		clNameContainer.appendChild(taskNameInput);

		let saveCommandListButton = document.createElement("div");
		saveCommandListButton.id = "SaveCommandListButton";
		saveCommandListButton.style.width = "90px";
		saveCommandListButton.style.height = "26px";
		saveCommandListButton.style.borderRadius = "6px";
		saveCommandListButton.style.backgroundColor = "rgb(160, 160, 200)";
		saveCommandListButton.style.color = "rgb(64, 64, 64);";
		saveCommandListButton.style.border = "1px solid black";
		saveCommandListButton.style.lineHeight = "26px";
		saveCommandListButton.style.textAlign = "center";
		saveCommandListButton.style.margin = "10px auto 0px auto";
		saveCommandListButton.style.cursor = "pointer";
		saveCommandListButton.style.userSelect = "none";
		saveCommandListButton.innerText = "Save List";
		saveCommandListButton.onmouseenter = () => { saveCommandListButton.style.backgroundColor = "rgb(140, 140, 240)"; }
		saveCommandListButton.onmouseleave = () => { saveCommandListButton.style.backgroundColor = "rgb(160, 160, 200)"; }
		saveCommandListButton.onmousedown = () => { saveCommandListButton.style.backgroundColor = "rgb(140, 140, 200)"; }
		saveCommandListButton.onmouseup = () => { saveCommandListButton.style.backgroundColor = "rgb(140, 140, 240)"; }
		saveCommandListButton.onclick = () => { 
			let taskListNameInput = document.getElementById("TaskNameInput");
			if (!taskListNameInput.value || taskListNameInput.value === "") {
				console.log("You must have a task list name to save this task list.");
				return;
			}
			console.log(`Command list saved: [${taskListNameInput.value}]`);
			CreateCommandList.HideCommandListMenu();
		}
		clNameContainer.appendChild(saveCommandListButton);

		let closeCommandListButton = document.createElement("div");
		closeCommandListButton.id = "CloseCommandListButton";
		closeCommandListButton.style.width = "30px";
		closeCommandListButton.style.height = "26px";
		closeCommandListButton.style.borderRadius = "6px";
		closeCommandListButton.style.backgroundColor = "rgb(220, 160, 160)";
		closeCommandListButton.style.color = "rgb(64, 64, 64);";
		closeCommandListButton.style.border = "1px solid black";
		closeCommandListButton.style.lineHeight = "26px";
		closeCommandListButton.style.textAlign = "center";
		closeCommandListButton.style.margin = "10px 5px 0px 0px";
		closeCommandListButton.style.cursor = "pointer";
		closeCommandListButton.style.userSelect = "none";
		closeCommandListButton.innerText = "X";
		closeCommandListButton.onmouseenter = () => { closeCommandListButton.style.backgroundColor = "rgb(240, 120, 120)"; }
		closeCommandListButton.onmouseleave = () => { closeCommandListButton.style.backgroundColor = "rgb(220, 160, 160)"; }
		closeCommandListButton.onmousedown = () => { closeCommandListButton.style.backgroundColor = "rgb(220, 120, 120)"; }
		closeCommandListButton.onmouseup = () => { closeCommandListButton.style.backgroundColor = "rgb(240, 120, 120)"; }
		closeCommandListButton.onclick = () => { CreateCommandList.HideCommandListMenu(); }
		clNameContainer.appendChild(closeCommandListButton);

		//  Command list conditions container
		let clConditionsContainer = document.createElement("div");
		clConditionsContainer.id = "clConditionsContainer";
		clConditionsContainer.style.width = "100%";
		clConditionsContainer.style.margin = "10px 0px 0px 0px";
		clConditionsContainer.style.display = "inline-flex";
		modalBox.appendChild(clConditionsContainer);

		let clConditionsLabel = document.createElement("div");
		clConditionsLabel.style.width = "132px";
		clConditionsLabel.style.height = "32px";
		clConditionsLabel.style.position = "relative";
		clConditionsLabel.style.marginRight = "20px";
		clConditionsLabel.style.left = "10px";
		clConditionsLabel.innerText = "CONDITIONS:";
		clConditionsContainer.appendChild(clConditionsLabel);

		let newConditionButton = null;
		let clConditionsList = document.createElement("div");
		clConditionsList.id = "CommandListConditionsList";
		clConditionsList.style.width = "440px";
		clConditionsList.style.height = "100px";
		clConditionsList.style.maxHeight = "120px";
		clConditionsList.style.backgroundColor = "white";
		clConditionsList.style.border = "1px solid black";
		clConditionsList.style.borderRadius = "6px";
		clConditionsList.onmouseenter = () => {
			newConditionButton = document.createElement("div");
			newConditionButton.id = "NewConditionButton";
			newConditionButton.style.width = "240px";
			newConditionButton.style.height = "20px";
			newConditionButton.style.margin = "4px auto 4px auto";
			newConditionButton.style.backgroundColor = "rgb(0, 0, 0)";
			newConditionButton.style.borderRadius = "6px";
			newConditionButton.style.color = "white";
			newConditionButton.style.textAlign = "center";
			newConditionButton.style.lineHeight = "21px";
			newConditionButton.style.cursor = "pointer";
			newConditionButton.style.userSelect = "none";
			newConditionButton.innerText = "Add New Condition";
			newConditionButton.onmouseenter = () => { newConditionButton.style.backgroundColor = "rgb(64, 64, 64)"; }
			newConditionButton.onmouseleave = () => { newConditionButton.style.backgroundColor = "rgb(0, 0, 0)"; }
			newConditionButton.onmousedown = () => { newConditionButton.style.backgroundColor = "rgb(80, 80, 80)"; }
			newConditionButton.onmouseup = () => { newConditionButton.style.backgroundColor = "rgb(64, 64, 64)"; }
			newConditionButton.onclick = () => {
				console.log("Test 1");
			}
			clConditionsList.appendChild(newConditionButton);
		}
		clConditionsList.onmouseleave = () => {
			if (newConditionButton === null) { return; }
			clConditionsList.removeChild(newConditionButton);
			newConditionButton = null;
		}
		clConditionsContainer.appendChild(clConditionsList);

		//  Command list actions container
		let clActionsContainer = document.createElement("div");
		clActionsContainer.id = "clActionsContainer";
		clActionsContainer.style.width = "100%";
		clActionsContainer.style.margin = "10px 0px 0px 0px";
		clActionsContainer.style.display = "inline-flex";
		modalBox.appendChild(clActionsContainer);

		let clActionsLabel = document.createElement("div");
		clActionsLabel.style.width = "132px";
		clActionsLabel.style.height = "32px";
		clActionsLabel.style.position = "relative";
		clActionsLabel.style.marginRight = "20px";
		clActionsLabel.style.left = "10px";
		clActionsLabel.innerText = "ACTIONS:";
		clActionsContainer.appendChild(clActionsLabel);

		let newActionButton = null;
		let clActionsList = document.createElement("div");
		clActionsList.id = "CommandListActionsList";
		clActionsList.style.width = "440px";
		clActionsList.style.height = "220px";
		clActionsList.style.maxHeight = "220px";
		clActionsList.style.backgroundColor = "white";
		clActionsList.style.border = "1px solid black";
		clActionsList.style.borderRadius = "6px";
		clActionsList.onmouseenter = () => {
			newActionButton = document.createElement("div");
			newActionButton.id = "NewActionButton";
			newActionButton.style.width = "240px";
			newActionButton.style.height = "20px";
			newActionButton.style.margin = "4px auto 4px auto";
			newActionButton.style.backgroundColor = "rgb(0, 0, 0)";
			newActionButton.style.borderRadius = "6px";
			newActionButton.style.color = "white";
			newActionButton.style.textAlign = "center";
			newActionButton.style.lineHeight = "21px";
			newActionButton.style.cursor = "pointer";
			newActionButton.style.userSelect = "none";
			newActionButton.innerText = "Add New Action";
			newActionButton.onmouseenter = () => { newActionButton.style.backgroundColor = "rgb(64, 64, 64)"; }
			newActionButton.onmouseleave = () => { newActionButton.style.backgroundColor = "rgb(0, 0, 0)"; }
			newActionButton.onmousedown = () => { newActionButton.style.backgroundColor = "rgb(80, 80, 80)"; }
			newActionButton.onmouseup = () => { newActionButton.style.backgroundColor = "rgb(64, 64, 64)"; }
			newActionButton.onclick = () => {
				console.log("Test 2");
			}
			clActionsList.appendChild(newActionButton);
		}
		clActionsList.onmouseleave = () => {
			if (newActionButton === null) { return; }
			clActionsList.removeChild(newActionButton);
			newActionButton = null;
		}
		clActionsContainer.appendChild(clActionsList);



		container.style.visibility = "hidden";

		return container;
	}

	static IsCommandListMenuActive() { 
		let element = document.getElementById("CreateCommandListContainer");
		if (!element) { console.log("Element 'CreateCommandListContainer' could not be found!"); return; }
		return (element.style.visibility === "visible");
	}

	static ToggleCommandListMenu() {
		if (CreateCommandList.IsCommandListMenuActive()) { CreateCommandList.HideCommandListMenu(); }
		else { CreateCommandList.ShowCommandListMenu(); }
	}

	static ShowCommandListMenu() {
		let element = document.getElementById("CreateCommandListContainer");
		if (!element) { console.log("Element 'CreateCommandListContainer' could not be found!"); return; }
		element.style.visibility = "visible";

		let taskListNameInput = document.getElementById("TaskNameInput");
		taskListNameInput.value = "";
	}

	static HideCommandListMenu() {
		let element = document.getElementById("CreateCommandListContainer");
		if (!element) { console.log("Element 'CreateCommandListContainer' could not be found!"); return; }
		element.style.visibility = "hidden";

		let conditionsList = document.getElementById("CommandListConditionsList");
		conditionsList.innerHTML = [];

		let actionsList = document.getElementById("CommandListActionsList");
		actionsList.innerHTML = [];
	}
};