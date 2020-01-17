import {
    Driver,
    Http
} from "../internal";

export interface UrlOptions {
    url: string
    method: string,
    params?: object,
    extraParams?: object,
    headers?: object
}

export interface CustomPromise extends Promise<Object[]> {
    abort: Function,
    reject: Function,
    resolve: Function,
}

export class UrlDriver extends Driver {

    cancel(promise: CustomPromise): boolean {
        if (promise && promise.abort) {
            promise.abort();
            return true;
        }
        return false;
    }

    load(options: UrlOptions): CustomPromise {
        let params = {
            method: options.method,
            data: Object.assign({}, options.params, options.extraParams),
        };
        return <CustomPromise>Http.request(options.url, params);
    }
}