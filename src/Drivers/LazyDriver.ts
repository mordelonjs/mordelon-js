import {
    Proxy,
    Driver
} from "../internal";

export class LazyDriver extends Driver {

    private _name: string;
    private _promises: Proxy[] = [];
    private _benchmarking: number;
    private _interval = setInterval(this.checkOnLoad.bind(this), 500);
    private _showLoadWarningOnlyOnce: boolean = false;

    constructor(name) {
        super();
        this._benchmarking = performance.now();
        this._name = name;
    }

    get benchmarking(): number {
        return performance.now() - this._benchmarking;
    }

    async load(proxy: Proxy): Promise<Object[]> {
        if (!this._promises[this._name]) {
            this._promises[this._name] = [];
        }
        return new Promise((resolve, reject) => {
            this._promises[this._name].push((driver) => {
                proxy.setDriver(driver);
                driver.load(proxy).then(resolve, reject);
            });
        });
    }

    public process(driver: Driver) {
        if (driver instanceof LazyDriver) {
            return false;
        }

        if (this._promises[this._name]) {
            this._promises[this._name].forEach(callback => callback(driver));
        }

        clearInterval(this._interval);
    }

    private checkOnLoad() {
        let bench = this.benchmarking;
        if (bench >= 1000 &&
            bench < 3000 &&
            !this._showLoadWarningOnlyOnce) {
            this._showLoadWarningOnlyOnce = true;
            console.warn(`Driver "${this._name}" took more than 1 seg to load`);
        } else if (bench > 1000 && bench > 3000) {
            clearInterval(this._interval);
            console.error(`Driver "${this._name}" took more than 3 seg to load`);
        }
    }
}