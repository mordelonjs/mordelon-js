import ProxyPool from "./ProxyPool";
import EventManager from "./EventManager";
import DriverManager from "./DriverManager";
import Proxy from "./Proxy";
import Source from './Source';
import Driver from "./Drivers/Driver";

const Mordelon = {
    ProxyPool: ProxyPool,
    EventManager: EventManager,
    Source: Source,
    Proxy: Proxy,
    DriverManager: DriverManager,
    Driver: Driver,
};

export default Mordelon;

declare global {
    interface Window {
        Mordelon: any,
    }
}

window.Mordelon = Mordelon;