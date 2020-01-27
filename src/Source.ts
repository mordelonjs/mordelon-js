import {isEqual} from "./Utils/isEqual";
import {
    Proxy,
    ProxyPool,
    ProxyConfig,
    Filter,
    Sorter,
    Prune,
    filterCb,
    sorterCb,
    pruneCb,
    groupCb
} from "./internal";

export interface SourceComponent {
    filters?: Filter[],
    sorter?: Sorter,
    prune?: Prune,
    group?: string,
    paginate?: boolean
}

export interface SourceConfig extends SourceComponent, ProxyConfig {
    handleDataChange?: Function,
    handleError?: Function,
    handleLoading?: Function,
    children?: any
}

export interface HandleFunc {
    (data: object[], params?: any);
}

export interface Pagination {
    total: number,
    currentPage: number,
    lastPage: number,
    perPage: number,
    from: number,
    to: number,
    previous: Function,
    hasPreviousPage: Function,
    next: Function,
    hasNextPage: Function,
}

export class Source {
    protected readonly _proxyId: string;
    protected _data: object[] = [];
    private _filters?: Filter[];
    private _sorter?: Sorter;
    private _prune?: Prune;
    private _group?: string;
    readonly _paginate?: boolean;
    //handles Callback's
    protected _handleDataChange?: Function;
    protected _handleError?: Function;
    protected _handleLoading?: Function;
    protected _handleMapping?: HandleFunc;
    protected _handleFilters: HandleFunc = filterCb;
    protected _handleSorter: HandleFunc = sorterCb;
    protected _handlePrune: HandleFunc = pruneCb;
    protected _handleGroup: HandleFunc = groupCb;
    //handles Event's
    protected _handleDataEvent: Function = (data: object[]) => this.data = data;
    protected _handleLoadingEvent: Function = (loading: boolean) => this.loading = loading;
    protected _handleErrorEvent: Function = (reason: any) => this.error = reason;

    constructor(args: SourceConfig) {
        const { filters, sorter, prune, group, paginate, handleDataChange, handleError, handleLoading, children, ...options} = args;
        this._filters  = filters;
        this._sorter   = sorter;
        this._group    = group;
        this._paginate = !!paginate;
        this._prune    = paginate && !prune ? { start: 0, limit: 20 } : prune;
        this._handleDataChange = handleDataChange;
        this._handleError      = handleError;
        this._handleLoading    = handleLoading;
        const proxy = ProxyPool.get(options);
        this._proxyId = proxy.id;
        proxy.on(Proxy.LOAD_DATA_EVENT, this._handleDataEvent);
        proxy.on(Proxy.LOADING_EVENT, this._handleLoadingEvent);
        proxy.on(Proxy.ERROR_EVENT, this._handleErrorEvent);
    }

    set handleDataChange(cb: Function) {
        this._handleDataChange = cb;
    }

    set handleError(cb: Function) {
        this._handleError = cb;
    }

    set handleLoading(cb: Function) {
        this._handleLoading = cb;
    }

    set handleMapping(cb: HandleFunc) {
        this._handleMapping = cb;
        this.updateData();
    }

    set handleFilters(cb: HandleFunc) {
        this._handleFilters = cb;
        this.updateData();
    }

    set handleSorter(cb: HandleFunc) {
        this._handleSorter = cb;
        this.updateData();
    }

    set handlePrune(cb: HandleFunc) {
        this._handlePrune = cb;
    }

    set handleGroup(cb: HandleFunc) {
        this._handleGroup = cb;
    }

    protected applyMapping(data: object[]): object[] { // for adding data
        return this._handleMapping ? this._handleMapping(data) : data;
    }

    protected applyFilters(data: object[]): object[] {
        return this._filters && this._handleFilters ? this._handleFilters(data, this._filters) : data;
    }

    protected applySorter(data: object[]): object[] {
        return this._sorter && this._handleSorter ? this._handleSorter(data, this._sorter) : data;
    }

    protected applyPrune(data: object[]): object[] {
        return this._prune && this._handlePrune ? this._handlePrune(data, this._prune) : data;
    }

    protected applyGroup(data: object[]) {
        return this._group && this._handleGroup ? this._handleGroup(data, this._group) : data;
    }

    protected updateData(): void {
        const proxy = ProxyPool.get(this.proxyId);
        let dataMapping  = this.applyMapping(proxy.data);
        let dataFiltered = this.applyFilters(dataMapping);
        let dataSortered = this.applySorter(dataFiltered);
        // let dataGrouped  = this.applyGroup(dataSortered);
        this._data = dataSortered;
    }

    protected changeData(): void {
        this._handleDataChange &&
        this._handleDataChange(this.wrapper);
    }

    protected resetPagination(): void {
        Object.assign(this._prune, { start: 0 });
    }

    set loading(value: boolean) {
        this._handleLoading &&
        this._handleLoading(value);
    }

    set error(value: any) {
        this._handleError &&
        this._handleError(value);
    }

    set data(data: object[]) {
        this.updateData();
        this.changeData();
    }

    get data(): object[] {
        return this.wrapper.data;
    }

    get wrapper(): { data: object[] } {
        let wrapper = {
            data: this.applyPrune(this._data)
        };

        if (this._paginate === true && this._prune) {
            Object.assign(wrapper, this.pagination());
        }

        return wrapper;
    }

    private pagination(): Pagination {
        const length = this._data.length;
        const limit = this._prune && this._prune.limit || 20;
        const start = this._prune && this._prune.start || 0;

        return {
            total: length,
            currentPage: Math.floor(start / limit ) + 1,
            lastPage: Math.floor( length / limit ),
            perPage: limit,
            from: start,
            to: limit + start,
            previous: () => { Object.assign(this._prune, { start: Math.max(start - limit, 0)}); this.changeData() },
            hasPreviousPage: () => { return start > 0 },
            next: () => { Object.assign(this._prune, { start: Math.min(start + limit, Math.floor(length / limit) * limit ) }); this.changeData() },
            hasNextPage: () => { return (limit + start) < length },
        }
    }

    set filters(value: Filter[]) {
        if (!isEqual(this._filters, value)) {
            this._filters = value;
            this.resetPagination();
            this.data = [];
        }
    }

    set sorter(value: Sorter) {
        if (!isEqual(this._sorter, value)) {
            this._sorter = value;
            this.resetPagination();
            this.data = [];
        }
    }

    set prune(value: Prune) {
        if (!isEqual(this._prune, value)) {
            this._prune = value;
        }
    }

    set group(value: string) {
        if (!isEqual(this._group, value)) {
            this._group = value;
        }
    }

    get proxyId(): string {
        return this._proxyId;
    }

    public remove(): void {
        const proxy = ProxyPool.get(this.proxyId);
        proxy.off(Proxy.LOAD_DATA_EVENT, this._handleDataEvent);
        proxy.off(Proxy.LOADING_EVENT, this._handleLoadingEvent);
        proxy.off(Proxy.ERROR_EVENT, this._handleErrorEvent);
    }
}