class Container {
    constructor(id, style) {
        this.content = this.generateContent(id, style);
    }

    generateContent(id, style) {
		let container = document.createElement(style.containerType ? style.containerType : "div");
		container.id = id ? id : "Container";
        Object.assign(container.style, style);
        return container;
    }
}