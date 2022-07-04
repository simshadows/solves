/*
 * Filename: utils.ts
 * Author:   simshadows <contact@simshadows.com>
 * License:  GNU Affero General Public License v3 (AGPL-3.0)
 */

import fs from "fs";

export function lstatIfExist(p: string) {
    try {
        return fs.lstatSync(p);
    } catch (err: any) {
        if (err.code !== "ENOENT") throw err;
        return null;
    }
}

export function setDifference<T>(a: Set<T>, b: Set<T>): Set<T> {
    let diff: Set<T> = new Set(a);
    for (const e of b) diff.delete(e);
    return diff;
}

