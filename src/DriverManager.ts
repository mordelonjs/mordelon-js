import { DriverMap } from "./Utils/DriverMap";
import {
    Driver,
    UrlDriver,
    LazyDriver
} from "./internal";

export interface DriverMap extends Map<string, Driver> {
    watch: Function,
    unwatch: Function,
    observer: []
}

export class DriverManager {

    protected drivers: DriverMap = new DriverMap();
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
            // watch lazy driver
            drivers.watch(name, (driver: Driver) => {
                // process new driver
                lazydriver.process(driver);
                // unwatch lazy driver
                drivers.unwatch(name);
            });
            // return lazy driver
            return lazydriver;
        }
    }

    static get(name: string): Driver {
        let drivers = this.getInstance().drivers;
        return <Driver>drivers.get(name);
    }
}