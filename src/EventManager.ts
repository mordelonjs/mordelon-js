export class EventManager {
    protected listeners: Function[][] = [];
    protected listenersOncer: Function[][] = [];

    on(event: string, cb: Function): void {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(cb);
    }

    off(event: string, cb: Function): void {
        if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter(callback => callback !== cb);
            if (this.listeners[event].length == 0) {
                delete this.listeners[event];
            }
        }
    }

    once(event: string, cb: Function) {
        if (!this.listenersOncer[event]) {
            this.listenersOncer[event] = [];
        }
        this.listenersOncer[event].push(cb);
    }

    fire(event: string, parameters?: any) {
        let eventDetail = Object.assign({
            event: event,
            parent: this,
            timestamp: new Date().getTime(),
            parameters: parameters
        });
        /** Update general listeners */
        if (this.listeners[event]) {
            this.listeners[event].forEach(listener => {
                try {
                    listener(parameters, eventDetail);
                } catch (e) {
                    console.error(e);
                }
            });
        }
        /** Update Multi listeners */
        if (this.listeners["*"]) {
            this.listeners["*"].forEach(listener => {
                try {
                    listener(parameters, eventDetail);
                } catch (e) {
                    console.error(e);
                }
            });
        }
        /** Clear the `once` queue */
        if (this.listenersOncer[event]) {
            const eventListeners = this.listenersOncer[event];
            this.listenersOncer[event] = [];
            eventListeners.forEach(listener => {
                try {
                    listener(parameters, eventDetail);
                } catch (e) {
                    console.error(e);
                }
            });
        }
    }
}