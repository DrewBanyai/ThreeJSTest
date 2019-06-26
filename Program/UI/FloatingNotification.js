class FloatingNotification {
    constructor(data) {
        this.parent = null;
        this.content = this.generateContent(data);
    }

    generateContent(data) {
        if (!data)              { console.log("No data was passed in to FloatingNotification"); return null; }
        if (!data.success)      { console.log("No success value was passed in to the data in FloatingNotification"); return null; }
        if (!data.message)      { console.log("No message value was passed in to the data in FloatingNotification"); return null; }
        if (!data.parent)       { console.log("No container value was passed in to the data in FloatingNotification"); return null; }

        this.parent = data.parent;

        let container = document.createElement("div");
        container.style.display = "block";
        container.style.position = "absolute";
        container.style.backgroundColor = "white";
        container.style.bottom = "0px";
        container.style.left = "40px";
        container.style.width = "350px";
        container.style.height = "70px";
        container.style.borderRadius = "6px";
        container.style.boxShadow = "0px 2px 8px 0px rgba(0, 0, 0, 0.07)";
        container.style.transform = "translateY(40px)";
        container.style.transition = "opacity 0.5s linear, transform 0.5s linear";
        container.style.opacity = "1";

        let topStrip = document.createElement("div");
        topStrip.style.width = "350px";
        topStrip.style.height = "10px";
        topStrip.style.position = "aboslute";
        topStrip.style.top = "0px";
        topStrip.style.left = "0px";
        topStrip.style.borderRadius = "6px 6px 0px 0px";
        topStrip.style.backgroundColor = data.success ? "rgb(57, 181, 74)" : "rgb(201, 37, 37)";
        container.appendChild(topStrip);

        let notification = document.createElement("div");
        notification.innerText = data.message;
        notification.style.fontSize = "16px";
        notification.style.color = data.success ? "rgb(57, 181, 74)" : "rgb(201, 37, 37)";
        notification.style.position = "aboslute";
        notification.style.top = "27px";
        notification.style.left = "46px";
        container.appendChild(notification);

        return container;
    }

    static generateNotification(success, message, parent) {
        let notification = new FloatingNotification({ success: success, message: message, parent: parent });
        NotificationsArray.push(notification);
        if (NotificationsArray.length === 1) { this.handleNotifications(); }
    }

    static async handleNotifications() {
        while (NotificationsArray.length > 0) {

            await this.handleNotificationsPromise();
            NotificationsArray.shift();
        }
    }

    static async handleNotificationsPromise() { 
        return new Promise((resolve) => {
            let notification = NotificationsArray[0];
            this.startAnimate(notification);
            notification.parent.append(notification.content);
            setTimeout(() => { return resolve(); }, 3000)
        });
    }

    static startAnimate(notification) {
        setTimeout(() => {
            notification.content.style.transform = "translateY(-40px)";
        }, 0);

        setTimeout(() => {
            notification.content.style.opacity = "0";
            setTimeout(() => {
                notification.parent.removeChild(notification.content);
            }, 1000);
        }, 2000);
    }
}

let NotificationsArray = [];