import Proxy, {ProxyConfig} from "./Proxy";

export default class ProxyPool {
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

    static add(proxyConfig: ProxyConfig) : Proxy {
        let code = Proxy.getHash(proxyConfig);
        const pool = this.getInstance().getPool();
        if (!pool.has(code)) {
            proxyConfig.id = code;
            pool.set(code, new Proxy(proxyConfig));
        }
        return <Proxy>pool.get(code);
    }

    static get(code: string) : Proxy {
        const pool = this.getInstance().getPool();
        return <Proxy>pool.get(code);
    }
}
