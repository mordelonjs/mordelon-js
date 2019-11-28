import ProxyPool from "./ProxyPool";
import Proxy, {ProxyConfig} from "./Proxy";

export enum FilterOperator {
    Equal               = "=",
    Equality            = "==",
    NotEqual            = "!=",
    GreaterThan         = ">",
    GreaterThanEqualTo  = ">=",
    LessThan            = "<",
    LessThanEqualTo     = "<=",
    Contains            = "%%"
}

export interface Filter {
    field: string,
    operator?: FilterOperator,
    value: any,
}

export interface Sorter {
    field: string,
    direction: string,
}

export interface Prune {
    start?: number,
    limit: number,
}

export const filterCb = (array: object[], filters: Filter[]) => {
    return array.filter((item, index) => {
        let remove = false;
        filters.forEach(filter => {
            let value = filter.value;
            if (value == undefined ||
                value == null ||
                value == '') {
                return false;
            }
            let value2String = value.toString().toLowerCase();
            let keys = filter.field.split("|");
            let fields = keys.map(key => item[key] && item[key].toString().toLowerCase() || "");
            switch (filter.operator) {
                case FilterOperator.Equal:
                case FilterOperator.Equality:
                    if (!(fields.find(item => item == value2String))) remove = true;
                    break;
                case FilterOperator.NotEqual:
                    if (!(fields.find(item => item != value2String))) remove = true;
                    break;
                case FilterOperator.GreaterThan:
                    if (!(fields.find(item => item > value2String)))  remove = true;
                    break;
                case FilterOperator.GreaterThanEqualTo:
                    if (!(fields.find(item => item >= value2String))) remove = true;
                    break;
                case FilterOperator.LessThan:
                    if (!(fields.find(item => item < value2String)))  remove = true;
                    break;
                case FilterOperator.LessThanEqualTo:
                    if (!(fields.find(item => item <= value2String))) remove = true;
                    break;
                case FilterOperator.Contains:
                    if (!(fields.find(item => item.indexOf(value2String) > -1))) remove = true;
                    break;
                default:
                    if (!(fields.find(item => item == value2String))) remove = true;
            }
            if (remove) return false;
        });
        return !remove;
    });
};

export const sorterCb = (array: object[], sorter: Sorter) => {
    let direction = sorter.direction;
    return array.sort((a, b) => {
        let aField = a[sorter.field];
        let bField = b[sorter.field];
        if (aField === bField) return 0;
        return direction === "DESC" ? (aField < bField ? 1 : -1) : (aField > bField ? 1 : -1);
    })
};

export const pruneCb = (array: object[], prune: Prune) => {
    return array.slice(prune.start, prune.limit);
};

export const groupCb = (array: object[], groupField: string) : object[] => {
    if (groupField) {
        let groups = new Map();
        array.forEach((item) => {
            let group = item[groupField];
            if (!groups.has(group)) {
                groups.set(group, []);
            }
            groups.get(group).push(item);
        });
        return Array.from(groups.values());
    } else {
        return array;
    }
};

export interface SourceProps {
    filters?: Filter[],
    sorter?: Sorter,
    prune?: Prune,
    group?: string,
    render?: Function,
}

export interface SourceState {

}

export default class Source {

    proxyConfig: ProxyConfig = {
        type: "resource",
        url: "test/get",
        load: true
    };

    private readonly proxy: Proxy;
    private _filters?: Filter[];
    private _sorter?: Sorter;
    private _prune?: Prune;
    private _group?: string;
    private readonly forceUpdate: Function;

    constructor(props: SourceProps & { forceUpdate: Function}) {
        this._filters    = props.filters;
        this._sorter     = props.sorter;
        this._prune      = props.prune;
        this._group      = props.group;
        this.forceUpdate = props.forceUpdate;
        this.proxy = ProxyPool.add(this.proxyConfig);
        this.proxy.on(Proxy.LOAD_DATA_EVENT, this.handleDataChange.bind(this));
    }

    handleDataChange() {
        this.forceUpdate();
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
