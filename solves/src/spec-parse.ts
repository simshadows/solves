/*
 * Filename: spec-parse.ts
 * Author:   simshadows <contact@simshadows.com>
 * License:  GNU Affero General Public License v3 (AGPL-3.0)
 */

import fs from "fs";

export interface SpecValues {
    
}

export function getSpecValues(specPath: string): SpecValues {
    const fileData = JSON.parse(fs.readFileSync(specPath).toString());
    console.log(fileData);
    return {};
}

