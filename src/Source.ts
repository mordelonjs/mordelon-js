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
    paginate?: boolean
}

export interface SourceConfig extends SourceComponent {
    proxy: ProxyConfig,
    handleDataChange?: Function
}

export default class Source {
    private readonly proxy: Proxy;
    private _data: object[] = [];
    private _filters?: Filter[];
    private _sorter?: Sorter;
    private _prune?: Prune;
    private _group?: string;
    private _paginate?: boolean;
    protected _handleDataChange?: Function;

    constructor(args: SourceConfig) {
        this._filters    = args.filters;
        this._sorter     = args.sorter;
        this._prune      = args.prune;
        this._group      = args.group;
        this._paginate   = args.paginate;
        this.proxy       = ProxyPool.add(args.proxy);
        this._handleDataChange = args.handleDataChange;
        this.proxy.on(Proxy.LOAD_DATA_EVENT, (data) => this.data = data);
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

    updateData(data) {
        let dataFiltered = this.applyFilters(data);
        let dataSortered = this.applySorter(dataFiltered);
        this._data = dataSortered;
    }

    set data(data) {
        this.updateData(data);
        this.changeData();
    }

    get data() {
        let x = { data: this.applyPrune(this._data) };
        if (this._paginate === true) {
            Object.assign(x, this.pagination());
        }
        return x;
    }

    private pagination() {
        return this._prune ? {
            total: this._data.length,
            currentPage: Math.ceil((this._prune.start || 0) / this._prune.limit ) + 1,
            lastPage: Math.ceil( this._data.length / this._prune.limit ),
            perPage: this._prune.limit,
            from: (this._prune.start || 0),
            to: this._prune.limit + (this._prune.start || 0),
        } : {};
    }

    set filters(value: Filter[]) {
        this._filters = value;
        this.updateData(this.proxy.data);
    }

    set sorter(value: Sorter) {
        this._sorter = value;
        this.updateData(this.proxy.data);
    }

    set prune(value: Prune) {
        this._prune = value;
    }

    set group(value: string) {
        this._group = value;
    }
}
