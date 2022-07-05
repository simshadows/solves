/*
 * Filename: base-template.ts
 * Author:   simshadows <contact@simshadows.com>
 * License:  GNU Affero General Public License v3 (AGPL-3.0)
 */

import fs from "fs";
import path from "path";

import ejs from "ejs";

import {type SpecValues} from "../spec-parse"; 
import templatesHelperAPI from "./templates-helper-api"
import * as utils from "../utils";


const EJS_FILE_EXTENSION = ".ejs";
const HELPERS_EXTENSION = ".ejshelpers";
const PACKAGES_DIR_NAME = "packages";
const CLINGO_WRAPPER_PATH = "../clingo-wrapper";

const reExtension = /.[a-zA-Z0-9]+$/;

type HelperTemplateFn = (subs: {[key: string]: string}) => string;
type HelperTemplates = Map<string, {[key: string]: HelperTemplateFn}>;

export interface Substitutions extends SpecValues {
    // Nothing for now
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
    const retypedSubstitutions: {[key: string]: any} = Object.fromEntries(
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
    substitutions: {[key: string]: any},
) {
    if (!utils.lstatIfExist(src)?.isDirectory()) {
        throw new Error("Source isn't a directory.");
    }
    if (fs.existsSync(dst)) {
        throw new Error("Destination already exists.");
    }
    fs.mkdirSync(dst);

    // We first process helper templates
    const direntObjs = fs.readdirSync(src, {withFileTypes: true});
    const helperTemplates: HelperTemplates = new Map();
    for (const direntObj of direntObjs) {
        const newSRC = path.join(src, direntObj.name);
        if (direntObj.name.endsWith(HELPERS_EXTENSION)) {
            helperTemplates.set(path.basename(newSRC), readHelpersDir(newSRC));
        }
    }

    for (const direntObj of direntObjs) {
        const newSRC = path.join(src, direntObj.name);
        const newDST = path.join(dst, direntObj.name);
        if (helperTemplates.has(path.basename(newSRC))) continue;

        if (direntObj.isDirectory()) {
            _copyDirAndApplyTemplate(newSRC, newDST, substitutions);
        } else if (direntObj.name.endsWith(EJS_FILE_EXTENSION)) {
            const fileData = fs.readFileSync(newSRC).toString();
            const modifiedDST = newDST.slice(0, -EJS_FILE_EXTENSION.length);
            const nameWithoutExt = path
                .basename(newSRC)
                .slice(0, -EJS_FILE_EXTENSION.length);

            const modifiedSubstitutions = {...substitutions, ...templatesHelperAPI};
            const ht = helperTemplates.get(nameWithoutExt + HELPERS_EXTENSION);
            if (ht !== undefined) modifiedSubstitutions["ht"] = ht;
            console.log(modifiedSubstitutions);
            try {
                fs.writeFileSync(modifiedDST, ejs.render(fileData, modifiedSubstitutions));
            } catch (err) {
                console.error(`Error when rendering template '${newSRC}'.`);
                throw err;
            }
        } else {
            fs.copyFileSync(newSRC, newDST);
        }
    }
}


function readHelpersDir(basePath: string): {[key: string]: HelperTemplateFn} {
    const ret: {[key: string]: HelperTemplateFn} = {};
    for (const direntObj of fs.readdirSync(basePath, {withFileTypes: true})) {
        const filePath = path.join(basePath, direntObj.name);
        const fileData = fs.readFileSync(filePath).toString();
        const key = direntObj.name
            .slice(0, -EJS_FILE_EXTENSION.length)
            .replace(reExtension, ""); // We ignore the extra extension!
        ret[key] = subs => ejs.render(fileData, {...subs, ...templatesHelperAPI});
    }
    return ret;
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

