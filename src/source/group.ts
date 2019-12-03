export function groupCb (array: object[], groupField: string) : object[] {
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
}
