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

export function filterCb (array: object[], filters: Filter[]) {
    return array.filter((item) => {
        let remove = false;
        filters.forEach(filter => {
            let value = filter.value;
            if (value == undefined ||
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
}
