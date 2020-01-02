import { DriverMap } from "./Utils/DriverMap";
import {
    Driver,
    UrlDriver,
    LazyDriver
} from "./internal";

export class DriverManager {
    // @ts-ignore
    protected drivers: Map<string, Driver> = new DriverMap();
    private static instance: DriverManager;

    constructor() {
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
            // create lazy driver
            let lazydriver = new LazyDriver(name);
            // register lazy driver
            lazydriver.register(name);
            // @ts-ignore
            drivers.watch(name, (driver: Driver) => {
                // process new driver
                lazydriver.process(driver);
                // @ts-ignore
                drivers.unwatch(name);
            });
            // return lazy driver
            return lazydriver;
        }
    }
}