import Driver from "./Drivers/Driver";
import UrlDriver from "./Drivers/UrlDriver";
import LazyDriver from "./Drivers/LazyDriver";
import DriverMap from "./Utils/DriverMap";

export default class DriverManager {
    private static instance: DriverManager;
    // @ts-ignore
    protected drivers: Map<string, Driver> = new DriverMap();
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
        let drivers = this.getInstance().drivers;
        if (drivers.has(name)) {
            return <Driver>drivers.get(name);
        } else {
            // set driver
            drivers.set(name, new LazyDriver(name, drivers));
            // return lazy driver
            return <Driver>drivers.get(name);
        }
    }
}