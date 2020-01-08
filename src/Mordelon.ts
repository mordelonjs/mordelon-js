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
    DriverManager: DriverManager,
    Source: Source,
    Proxy: Proxy,
    Driver: Driver,
};

declare global {
    namespace NodeJS {
        interface Global {
            Mordelon: {
                ProxyPool: any,
                EventManager: any,
                DriverManager: any,
                Source: any,
                Proxy: any,
                Driver: any
            }
        }
    }
}

global.Mordelon = Mordelon;

export default Mordelon;