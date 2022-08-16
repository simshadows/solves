export const reConstant = /^[a-z][a-zA-Z0-9]*$/;

// Soft error that just throws an error in the console log.
// If this error ever appears, something obviously went wrong.
export function warnIfNotString(s: string | undefined): string {
    if (typeof s !== "string") {
        console.error(`Expected a string, but instead got ${s}.`);
        return "";
    }
    return s;
}

export function arrayGroupAdjacent<K, E>(
    data:    E[],
    groupBy: (element: E) => K,
): [K, E[]][] {
    if (data.length === 0) return [];
    const firstElem = data[0]!; // DANGER: TYPE ASSERTION!
    // No way to get around this because undefined can be part of the element type.

    const ret: [K, E[]][] = [];
    let currKey: K = groupBy(firstElem);
    let currElems: E[] = [];
    for (const e of data) {
        const thisKey = groupBy(e);
        if (currKey !== thisKey) {
            if (currElems.length !== 0) {
                ret.push([currKey, currElems]);
                currElems = [];
            }
            currKey = thisKey;
        }
        currElems.push(e);
    }
    if (currElems.length !== 0) {
        ret.push([currKey, currElems]);
    }
    return ret;
}

