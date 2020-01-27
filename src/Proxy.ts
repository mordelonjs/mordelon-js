import {isEqual} from "./Utils/isEqual";
import {
    EventManager,
    DriverManager
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

    protected readonly _id: string;
    protected readonly _type: string = "url";
    protected _options: object = {};
    protected _data: object[] = [];
    protected _error: any;
    protected _loading: boolean = false;
    protected _promise?: Promise<any>;

    constructor(args: ProxyConfig) {
        super();
        this._id = Proxy.getHash(args);
        this._type = args.type || this._type;
        this._options = args;
        // registry driver type
        DriverManager.registry(this.type);
        // load on init
        if (args.load)
            this.load();
    }

    get id() {
        return this._id;
    }

    get type() {
        return this._type;
    }

    set error(reason) {
        if (!isEqual(this._error, reason)) {
            this._error = reason;
            this.fire(Proxy.ERROR_EVENT, reason);
        }
    }

    set loading(loading: boolean) {
        if (!isEqual(this._loading, loading)) {
            this._loading = loading;
            this.fire(Proxy.LOADING_EVENT, loading);
        }
    }

    set data(data) {
        if (data instanceof Object) {
            // force data to be array
            // doing for change JSON OBJECT(can Array[associated]) to Array,
            this._data = [];
            Array.from(Object.keys(data)).forEach(key => {
                this._data[key] = data[key];
            });
        } else {
            this._data = data;
        }
        this.fire(Proxy.LOAD_DATA_EVENT, data);
    }

    get data() {
        return this._data;
    }

    set options(options) {
        if (!isEqual(this._options, options)) {
            this._options = options;
            this.load();
        }
    }

    get options() {
        return this._options;
    }

    static getHash(config: ProxyConfig): string {
        return config.id || Math.random().toString(36).substring(3);
    }

    async load() {
        const driver = DriverManager.get(this.type);
        if (this._promise) { driver.cancel(this._promise); delete this._promise; }
        this.loading = true;
        this._promise = driver.load(this.options);
        this._promise
            .then(response => this.data = response)
            .catch(reason => this.error = reason)
            .finally(() => { this.loading = false; delete this._promise });
    }

    on(event: string, cb: Function): void {
        super.on(event, cb);
        if (event == Proxy.ERROR_EVENT && this._error) {
            cb(this._error);
        } else if(event == Proxy.LOADING_EVENT && this._loading) {
            cb(this._loading);
        } else if(event == Proxy.LOAD_DATA_EVENT && this._data && this._data.length > 0) {
            cb(this._data);
        }
    }
}