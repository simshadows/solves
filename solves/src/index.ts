/*
 * Filename: index.ts
 * Author:   simshadows <contact@simshadows.com>
 * License:  GNU Affero General Public License v3 (AGPL-3.0)
 */

import fs from "fs";
import path from "path";

console.log("Attempting to copy...");

function lstatIfExist(p: string) {
    try {
        return fs.lstatSync(p);
    } catch (err: any) {
        if (err.code !== "ENOENT") throw err;
        return null;
    }
}

/*
 * Copies the entire directory 'src' recursively to 'dst'.
 * 
 * TODO: Make it so if any file is a template, it is processed.
 */
function copyDirAndApplyTemplate(src: string, dst: string) {
    if (!lstatIfExist(src)?.isDirectory()) {
        throw "Source isn't a directory.";
    }
    if (fs.existsSync(dst)) {
        throw "Destination already exists.";
    }
    fs.mkdirSync(dst);

    for (const direntObj of fs.readdirSync(src, {withFileTypes: true})) {
        const newSRC = path.join(src, direntObj.name);
        const newDST = path.join(dst, direntObj.name);
        if (direntObj.isDirectory()) {
            copyDirAndApplyTemplate(newSRC, newDST);
        } else {
            fs.copyFileSync(newSRC, newDST);
        }
    }
}

copyDirAndApplyTemplate("./base-template", "../dist");

console.log("done!")

