export interface HttpRequest {
    method?: string,
    headers?: Record<string, string>,
    data?: object,
    async?: boolean,
    user?: string,
    password?: string,
    responseType?: string,
}

export class Http {

    static request(url: string, params: HttpRequest) : Promise<any> {
        let promise, xhr, fnResolve, fnReject, fnAbort;
        let method = params.method || 'GET';
        let async = params.async != false;
        let user = params.user || '';
        let password = params.password || '';
        let qs = '';
        let body;

        if (['GET', 'DELETE'].indexOf(method) > -1)
            qs = (params.data && url.includes("?") ? '&' : '?' ) + Http.queryString(params.data || {});
        else // POST or PUT
            body = JSON.stringify(params.data);

        url = url + qs;

        promise = new Promise(function (resolve, reject) {
            xhr = new XMLHttpRequest();
            xhr.open(method, url, async, user, password);
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    resolve(xhr.response);
                } else {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                }
            };
            xhr.responseType = params.responseType || 'json';

            if (params && params.headers) {
                Object.keys(params.headers).forEach(function (key) {
                    if (params.headers) {
                        xhr.setRequestHeader(key, params.headers[key]);
                    }
                });
            }

            xhr.send(body);

            fnResolve = resolve;
            fnReject  = reject;
            fnAbort = xhr.abort;
        });

        promise.resolve = fnResolve;
        promise.reject = fnReject;
        promise.abort = fnAbort.bind(xhr);
        return promise;
    }

    static get = (url:string, params: HttpRequest) => Http.request(url, Object.assign({ method: 'GET' }, params));

    static post = (url:string, params: HttpRequest) => Http.request(url, Object.assign({ method: 'POST' }, params));

    static put = (url:string, params: HttpRequest) => Http.request(url, Object.assign({ method: 'PUT' }, params));

    static delete = (url:string, params: HttpRequest) =>  Http.request(url, Object.assign({ method: 'DELETE' }, params));

    static queryString = (params: object) => {
        let euc = encodeURIComponent;
        return Object
            .keys(params)
            .map(k => {
                if (Array.isArray(params[k])) {
                    return params[k]
                        .map(val => `${euc(k)}[]=${euc(val)}`)
                        .join('&')
                }
                return `${euc(k)}=${euc(params[k])}`
            })
            .join('&')
    }

}