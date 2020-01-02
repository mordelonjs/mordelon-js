import {
    ProxyPool,
    EventManager,
    DriverManager,
    Proxy,
    Driver,
    Source
} from "./internal";

const Mordelon = {
    ProxyPool: ProxyPool,
    EventManager: EventManager,
    Source: Source,
    Proxy: Proxy,
    DriverManager: DriverManager,
    Driver: Driver,
};

declare global {
    namespace NodeJS {
        interface Global {
            Mordelon: {}
        }
    }
}

global.Mordelon = Mordelon;

export default Mordelon;