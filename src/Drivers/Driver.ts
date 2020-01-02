import {
    Proxy,
    DriverManager
} from "../internal";

export abstract class Driver {
    async load(proxy: Proxy): Promise<Object[]> {
        return [];
    }

    register(name: string) {
        DriverManager.register(name, this);
    }
}