import Proxy from "../Proxy";

export default abstract class Driver {
    async load(proxy: Proxy): Promise<Object[]> {
        return [];
    };
}