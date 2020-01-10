import {
    Driver
} from "../internal";

export interface LazyOptions {
    id: string
}

export class LazyDriver extends Driver {

    private _name: string;
    private _promises: object[] = [];
    private _benchmarking: number;
    private _interval = setInterval(this.checkOnLoad.bind(this), 500);
    private _showLoadWarningOnlyOnce: boolean = false;
    private _loadWarningTime = 3000;
    private _loadErrorTime = 10000;

    constructor(name) {
        super();
        this._benchmarking = performance.now();
        this._name = name;
    }

    get benchmarking(): number {
        return performance.now() - this._benchmarking;
    }

    async load(options: LazyOptions): Promise<Object[]> {
        if (!this._promises[this._name]) {
            this._promises[this._name] = [];
        }
        return new Promise((resolve, reject) => {
            this._promises[this._name].push((driver) => {
                driver.load(options).then(resolve, reject);
            });
        });
    }

    public process(driver: Driver) {
        if (driver instanceof LazyDriver) {
            return false;
        }

        if (this._promises[this._name]) {
            this._promises[this._name].forEach(callback => callback(driver));
            delete this._promises[this._name];
        }

        clearInterval(this._interval);
    }

    private checkOnLoad() {
        let bench = this.benchmarking;
        if (bench >= this._loadWarningTime &&
            bench < this._loadErrorTime &&
            !this._showLoadWarningOnlyOnce) {
            this._showLoadWarningOnlyOnce = true;
            console.warn(`Driver "${this._name}" took more than ${this._loadWarningTime/1000} seg to load`);
        } else if (bench > this._loadWarningTime && bench > this._loadErrorTime) {
            clearInterval(this._interval);
            console.error(`Driver "${this._name}" took more than ${this._loadErrorTime/1000} seg to load`);
        }
    }
}