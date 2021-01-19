class TextLabel {
    constructor(id, style) {
        this.content = this.generateContent(id, style);
    }

    generateContent(id, style) {
		let label = document.createElement("div");
		label.id = id ? id : "TextLabel";
		label.innerHTML = style.text ? style.text : "TextLabel";
        Object.assign(label.style, style);
        return label;
    }
}