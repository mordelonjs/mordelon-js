import Proxy from "../Proxy";

export default abstract class Driver {
    load = async (proxy: Proxy): Promise<Object[]> => {
        return [];
    };
}