
export interface Prune {
    start?: number,
    limit: number,
}

export const pruneCb = (array: object[], prune: Prune) => {
    return array.slice(prune.start, prune.limit);
};