export interface Sorter {
    field: string,
    direction: string,
}

export function sorterCb (array: object[], sorter: Sorter) {
    let direction = sorter.direction;
    return array && sorter && array.sort((a, b) => {
        let aField = a[sorter.field];
        let bField = b[sorter.field];
        if (aField === bField) return 0;
        return direction === "DESC" ? (aField < bField ? 1 : -1) : (aField > bField ? 1 : -1);
    })
}