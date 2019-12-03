import Driver from "./Driver";
import Proxy from "../Proxy";
import Http from "../Utils/Http";

export default class UrlDriver extends Driver {
    load = async (proxy: Proxy) => {
        let params = {
            method: proxy.method,
            data: Object.assign({}, proxy.params, proxy.extraParams),
        };
        return await Http.request(proxy.url, params);
    };
}