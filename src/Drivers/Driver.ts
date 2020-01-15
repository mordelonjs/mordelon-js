import {
    DriverManager
} from "../internal";

export abstract class Driver {

    constructor() {
        if (this.constructor === Driver) {
            throw new TypeError('Illegal constructor');
        }
    }

    abstract async load(options: object): Promise<Object[]>

    register(name: string) {
        DriverManager.register(name, this);
    }
}