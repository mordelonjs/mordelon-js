import {
    Proxy,
    Driver,
    Http
} from "../internal";

export class UrlDriver extends Driver {
    async load(proxy: Proxy): Promise<Object[]> {
        let params = {
            method: proxy.method,
            data: Object.assign({}, proxy.params, proxy.extraParams),
        };
        return await Http.request(proxy.url, params);
    }
}