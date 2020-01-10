import {
    DriverManager
} from "../internal";

export abstract class Driver {

    abstract async load(options: object): Promise<Object[]>

    register(name: string) {
        DriverManager.register(name, this);
    }
}