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
const PACKAGES_DIR_NAME = "packages";
const CLINGO_WRAPPER_PATH = "../clingo-wrapper";

export interface Substitutions {
    name:        string;
    encoding:    string;
    constraints: string;
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
    const retypedSubstitutions: {[key: string]: string} = Object.fromEntries(
        Object.entries(substitutions),
    );
    _copyDirAndApplyTemplate(src, dst, retypedSubstitutions);
    copyWorkspaces(dst);
}

/*
 * The actual recursive portion of 'copyDirAndApplyTemplate'.
 */
function _copyDirAndApplyTemplate(
    src: string,
    dst: string,
    substitutions: {[key: string]: string},
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
            _copyDirAndApplyTemplate(newSRC, newDST, substitutions);
        } else if (direntObj.name.endsWith(EJS_FILE_EXTENSION)) {
            const fileData = fs.readFileSync(newSRC).toString();
            const modifiedDST = newDST.slice(0, -EJS_FILE_EXTENSION.length);
            fs.writeFileSync(modifiedDST, ejs.render(fileData, substitutions));
        } else {
            fs.copyFileSync(newSRC, newDST);
        }
    }
}

/*
 * Copies helper workspaces into the new project.
 */
function copyWorkspaces(dst: string) {
    // We just use the same function.
    // Looks dodgy, but should work as long as no files are templates.
    const packagesDir = path.join(dst, PACKAGES_DIR_NAME);
    fs.mkdirSync(packagesDir);
    _copyDirAndApplyTemplate(
        CLINGO_WRAPPER_PATH,
        path.join(packagesDir, path.basename(CLINGO_WRAPPER_PATH)),
        {}
    );
}

