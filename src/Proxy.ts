import EventManager from "./EventManager";
import Http from "./Http";

export interface ProxyConfig {
    id?: string,
    type: string,
    url?: string,
    method?: string,
    readonly params?: object,
    extraParams?: object,
    load?: boolean
}

export default class Proxy extends EventManager {
    static LOAD_DATA_EVENT = 'loadData';
    static LOADING_EVENT = 'loading';
    static ERROR_EVENT = 'error';

    protected id: string;
    protected url: string;
    readonly params : object;
    extraParams : object;
    protected type : string;
    protected method: string;
    protected _data: Array<object> = [];

    constructor(args: ProxyConfig) {
        super();
        this.id = Proxy.getHash(args);
        this.type = args.type;
        this.url = args.url || "";
        this.params = args.params || {};
        this.extraParams = args.extraParams || {};
        this.method = args.method || "GET";
        if (args.load) {
            let promise = this.load();
        }
    }

    set loading(loading: boolean) {
        this.fire(Proxy.LOADING_EVENT, loading);
    }

    set data(data) {
        this._data = data;
        this.fire(Proxy.LOAD_DATA_EVENT, data);
    }

    get data() {
        return this._data;
    }

    static getHash(config: ProxyConfig): string {
        return config.id || Math.random().toString(36).substring(3);
    }

    async load() {
        this.loading = true;
        await Http.get(this.url, {
                data: Object.assign(this.params || {}, this.extraParams || {}),
            })
            .then(response => {
                this.data = response;
            })
            .catch(reason => this.fire(Proxy.ERROR_EVENT, reason))
            .finally(() => this.loading = false);
    }
}