import {
    Driver,
    Http
} from "../internal";

export interface UrlOptions {
    url: string
    method: string,
    params?: object,
    extraParams?: object,
}

export class UrlDriver extends Driver {
    async load(options: UrlOptions): Promise<Object[]> {
        let params = {
            method: options.method,
            data: Object.assign({}, options.params, options.extraParams),
        };
        return Http.request(options.url, params);
    }
}