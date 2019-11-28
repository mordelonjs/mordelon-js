import ProxyPool from "./ProxyPool";
import Proxy, {ProxyConfig} from "./Proxy";
import {Filter, filterCb} from "./source/filter";
import {Sorter, sorterCb} from "./source/sorter";
import {Prune, pruneCb} from "./source/prune";
import {groupCb} from "./source/group";

export interface SourceComponent {
    filters?: Filter[],
    sorter?: Sorter,
    prune?: Prune,
    group?: string,
}

export interface SourceConfig extends SourceComponent {
    proxy: ProxyConfig,
    handleDataChange?: Function
}

export default class Source {
    private readonly proxy: Proxy;
    private _filters?: Filter[];
    private _sorter?: Sorter;
    private _prune?: Prune;
    private _group?: string;
    protected _handleDataChange?: Function;

    constructor(args: SourceConfig) {
        this._filters    = args.filters;
        this._sorter     = args.sorter;
        this._prune      = args.prune;
        this._group      = args.group;
        this.proxy       = ProxyPool.add(args.proxy);
        this._handleDataChange = args.handleDataChange;
        this.proxy.on(Proxy.LOAD_DATA_EVENT, this.changeData);
    }

    set handleDataChange(cb: Function) {
        this._handleDataChange = cb;
    }

    changeData() {
        this._handleDataChange &&
            this._handleDataChange();
    }

    applyFilters(data) {
        return this._filters ? filterCb(data, this._filters) : data;
    }

    applySorter(data) {
        return this._sorter ? sorterCb(data, this._sorter) : data;
    }

    applyPrune(data) {
        return this._prune ? pruneCb(data, this._prune) : data;
    }

    applyGroup(data) {
        return this._group ? groupCb(data, this._group) : data;
    }

    getData() {
        let bench = performance.now();
        let data = this.proxy.data;
        data = this.applyFilters(data);
        // data = this.applyGroup(data);
        data = this.applySorter(data);
        data = this.applyPrune(data);
        console.log(bench - performance.now());
        return data;
    }

    set filters(value: Filter[]) {
        this._filters = value;
    }

    set sorter(value: Sorter) {
        this._sorter = value;
    }

    set prune(value: Prune) {
        this._prune = value;
    }

    set group(value: string) {
        this._group = value;
    }
}
