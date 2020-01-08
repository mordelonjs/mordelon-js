import {
    EventManager,
    DriverManager,
    Driver
} from "./internal";

export interface ProxyConfig {
    id?: string,
    type: string,
    load?: boolean
}

export class Proxy extends EventManager {
    static LOAD_DATA_EVENT = 'loadData';
    static LOADING_EVENT = 'loading';
    static ERROR_EVENT = 'error';

    readonly id: string;
    readonly type: string = "url";
    readonly options: object = {};
    protected _data: object[] = [];
    protected driver: Driver;

    constructor(args: ProxyConfig) {
        super();
        this.id = Proxy.getHash(args);
        this.type = args.type || this.type;
        this.options = args;
        this.driver = DriverManager.registry(this.type);
        if (args.load) {
            this.load();
        }
    }

    set error(reason) {
        this.fire(Proxy.ERROR_EVENT, reason)
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

    public setDriver(driver: Driver) {
        this.driver = driver;
    }

    static getHash(config: ProxyConfig): string {
        return config.id || Math.random().toString(36).substring(3);
    }

    async load() {
        this.loading = true;
        await this.driver.load(this.options)
            .then(response => this.data = response)
            .catch(reason => this.error = reason)
            .finally(() => this.loading = false);
    }
}