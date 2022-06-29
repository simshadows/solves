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

