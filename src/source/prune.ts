
export interface Prune {
    start?: number,
    limit: number,
}

export function pruneCb (array: object[], prune: Prune) {
    return array && prune && array.slice(prune.start, prune.limit + (prune.start || 0));
}