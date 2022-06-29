/*
 * Filename: base-template.ts
 * Author:   simshadows <contact@simshadows.com>
 * License:  GNU Affero General Public License v3 (AGPL-3.0)
 */

import fs from "fs";
import path from "path";

import ejs from "ejs";

import * as utils from "./utils";


const EJS_FILE_EXTENSION = ".ejs";

export interface Substitutions {
    slug: string;
}

/*
 * Copies the entire directory 'src' recursively to 'dst'.
 * 
 * TODO: Make it so if any file is a template, it is processed.
 */
export function copyDirAndApplyTemplate(
    src: string,
    dst: string,
    substitutions: Substitutions,
) {
    if (!utils.lstatIfExist(src)?.isDirectory()) {
        throw new Error("Source isn't a directory.");
    }
    if (fs.existsSync(dst)) {
        throw new Error("Destination already exists.");
    }
    fs.mkdirSync(dst);

    for (const direntObj of fs.readdirSync(src, {withFileTypes: true})) {
        const newSRC = path.join(src, direntObj.name);
        const newDST = path.join(dst, direntObj.name);
        if (direntObj.isDirectory()) {
            copyDirAndApplyTemplate(newSRC, newDST, substitutions);
        } else if (direntObj.name.endsWith(EJS_FILE_EXTENSION)) {
            const fileData = fs.readFileSync(newSRC).toString();
            const modifiedDST = newDST.slice(0, -EJS_FILE_EXTENSION.length);
            fs.writeFileSync(modifiedDST, ejs.render(fileData, substitutions));
        } else {
            fs.copyFileSync(newSRC, newDST);
        }
    }
}

