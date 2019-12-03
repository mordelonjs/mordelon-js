import Driver from "./Drivers/Driver";
import UrlDriver from "./Drivers/UrlDriver";

export default class DriverManager {
    private static instance: DriverManager;
    protected drivers: Map<string, Driver> = new Map();
    private constructor() {
        this.drivers.set("url", new UrlDriver());
    }

    static getInstance(): DriverManager {
        if (!this.instance) {
            this.instance = new DriverManager();
        }
        return this.instance;
    }

    static destroy() {
        this.instance.drivers.clear();
        delete this.instance;
    }

    static register(name: string, driver: Driver) {
        this.getInstance().drivers.set(name, driver);
    }

    static registry(name: string): Driver {
        const drivers = this.getInstance().drivers;
        if (drivers.has(name)) {
            return <Driver>drivers.get(name);
        } else {
            throw new Error(`Driver "${name}" not registered!!`);
        }
    }
}