import {
    DriverManager
} from "../internal";

export abstract class Driver {

    constructor() {
        if (this.constructor === Driver) {
            throw new TypeError('Illegal constructor');
        }
    }

    abstract load(options: object): Promise<any>

    cancel(promise: Promise<any>): boolean {
        throw new Error('Method "Cancel" is unimplemented!!')
    }

    register(name: string) {
        DriverManager.register(name, this);
    }
}