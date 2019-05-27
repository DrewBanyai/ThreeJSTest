class CharacterInventory {
	constructor() {
		this.inventorySize = { width: "300px", height: "600px" };
		this.inventorySpace = { columns: 4, rows: 6 };
		this.content = this.generateContent();
	}

	generateContent() {
		let outerContainer = document.createElement("div");
		outerContainer.id = "CharacterInventory";
		outerContainer.style.borderRadius = "8px";
		outerContainer.style.backgroundColor = "white";
		outerContainer.style.border = "2px solid black";
		outerContainer.style.width = this.inventorySize.width;
		outerContainer.style.height = this.inventorySize.height;
		outerContainer.style.position = "absolute";
		outerContainer.style.top = "60px";
		outerContainer.style.left = "10px";
		outerContainer.style.visibility = "hidden";

		return outerContainer;
	}
};