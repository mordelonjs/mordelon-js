import ProxyPool from "./ProxyPool";
import EventManager from "./EventManager";
import DriverManager from "./DriverManager";
import Proxy from "./Proxy";
import Source from './Source';
import Driver from "./Drivers/Driver";

declare const global;
declare const window;

const Mordelon = {
    ProxyPool: ProxyPool,
    EventManager: EventManager,
    Source: Source,
    Proxy: Proxy,
    DriverManager: DriverManager,
    Driver: Driver,
};

global.Mordelon = Mordelon;
window.Mordelon = Mordelon;
module.exports = Mordelon;
export default Mordelon;