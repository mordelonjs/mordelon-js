
export interface HttpRequest {
    method?: string,
    headers?: Record<string, string>,
    data?: object,
}

export class Http {

    static request(url: string, params: HttpRequest) : Promise<any> {
        let method = params.method || 'GET';
        let qs = '';
        let body;
        let headers = Object.assign({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }, params.headers || {});

        if (['GET', 'DELETE'].indexOf(method) > -1)
            qs = (params.data && url.includes("?") ? '&' : '?' ) + Http.queryString(params.data || {});
        else // POST or PUT
            body = JSON.stringify(params.data);

        url = url + qs;

        return fetch(url, { method, headers, body })
            .then(response => response.json());
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