import {
    Proxy,
    ProxyConfig
} from "./internal";

export class ProxyPool {
    private static instance: ProxyPool;
    protected pool: Map<string, Proxy> = new Map();
    private constructor() {}

    static getInstance(): ProxyPool {
        if (!this.instance) {
            this.instance = new ProxyPool();
        }
        return this.instance;
    }

    static destroy() {
        this.instance.pool = new Map();
        delete this.instance;
    }

    private getPool() {
        return this.pool;
    }

    static loadAll() {
        this.getInstance().getPool().forEach((proxy) => {
            proxy.load();
        });
    }

    static load(code: string, options?: object) {
        const pool = this.getInstance().getPool();
        let proxy = pool.get(code);
        if (proxy) {
            if (options) {
                proxy.options = options;
            } else {
                proxy.load();
            }
        }
    }

    static remove(code: string) : boolean {
        const pool = this.getInstance().getPool();
        return pool.delete(code);
    }

    static get(param: string|ProxyConfig) : Proxy {
        let code;
        const pool = this.getInstance().getPool();
        if (typeof param == "object") {
            code = Proxy.getHash(param);
            if (!pool.has(code)) {
                param.id = code;
                pool.set(code, new Proxy(param));
            }
        } else {
            code = param;
        }
        return <Proxy>pool.get(code);
    }
}
