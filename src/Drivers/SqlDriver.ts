import Driver from "./Driver";
import Proxy from "../Proxy";

export class SqlDriver extends Driver {
    load = async (proxy: Proxy) => {
        console.log("SQL DRIVER LOAD");
        return [];
    };
}