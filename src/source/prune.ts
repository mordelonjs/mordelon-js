
export interface Prune {
    start?: number,
    limit: number,
}

export function pruneCb (array: object[], prune: Prune) {
    return array.slice(prune.start, prune.limit + (prune.start || 0));
}