import EventManager from "./EventManager";
import DriverManager from "./DriverManager";
import Driver from "./Drivers/Driver";

export interface ProxyConfig {
    id?: string,
    type?: string,
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
    readonly url: string;
    readonly params: object = {};
    extraParams: object = {};
    readonly type: string = "url";
    readonly method: string = 'GET';
    protected _data: object[] = [];
    protected driver: Driver;

    constructor(args: ProxyConfig) {
        super();
        this.id = Proxy.getHash(args);
        this.type = args.type || "url";
        this.url = args.url || "";
        this.params = args.params || {};
        this.extraParams = args.extraParams || {};
        this.method = args.method || "GET";
        this.driver = DriverManager.registry(this.type);
        if (args.load) {
            this.load();
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

    public setDriver(driver: Driver) {
        this.driver = driver;
    }

    async load() {
        this.loading = true;
        await this.driver.load(this)
            .then(response => this.data = response)
            .catch(reason => this.fire(Proxy.ERROR_EVENT, reason))
            .finally(() => this.loading = false);
    }
}