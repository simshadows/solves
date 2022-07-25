/*
 * Filename: spec-parse.ts
 * Author:   simshadows <contact@simshadows.com>
 * License:  GNU Affero General Public License v3 (AGPL-3.0)
 */

import fs from "fs";

import yaml from "js-yaml";

import {
    objectValueMap,
} from "./utils";

// TODO: Not entirely sure why I'm getting type issues. We're using this as a crutch for now.
function ensureStr(obj: any, argName: string): string {
    if (typeof obj === "string") return obj;
    throw new Error(`'${argName}' spec key is not a string.`);
}
function ensureNum(obj: any, argName: string): number {
    if (typeof obj === "number") return obj;
    throw new Error(`'${argName}' spec key is not a number.`);
}

/*
 * Ensures that the field IDs match what's actually found in the template.
 * Throws human-readable exceptions if errors are found.
 */
function validateOutputPartialSpec(o: OutputPartialSpec): void {
    const fields: Set<string> = new Set(Object.keys(o.fields));
    console.assert(fields.size === Object.keys(o.fields).length);

    // TODO: Length of fields?
}

function inputTransform(obj: any) {
    // TODO: Simplify this later.
    const title: string = ensureStr(obj.title, "input[].title");
    const parameters: number = ensureNum(obj.params, "input[].params");
    const initialValues: string[] = obj.initialValues
        .map((s: any) => ensureStr(s, "input[].initialValues[]"));
    return {
        title,
        parameters,
        initialValues,
    };
}

/********************************************************************/


interface InputPartialSpec {
    title: string;
    parameters: number;
    initialValues: string[];
}

interface OutputPartialSpec {
    title: string;
    fields: {[key: string]: {
        title: string;
    }};
}

export interface SpecValues {
    name:            string;
    encoding:        string;
    constraintsCode: string;
    
    inputBase:        {[key: string]: InputPartialSpec};
    inputConstrained: {[key: string]: InputPartialSpec};
    output:           {[key: string]: OutputPartialSpec};
}

export function getSpecValues(specPath: string): SpecValues {
    // TODO: Implement manual switching between JSON and YAML?
    const fileData: any = (()=>{
        try {
            return JSON.parse(fs.readFileSync(specPath).toString());
        } catch {
            return yaml.load(fs.readFileSync(specPath, "utf-8").toString());
        }
    })();

    const inputBase: any = fileData["input-base"];
    if (typeof inputBase !== "object") {
        throw new Error("Must provide an object for input bases.");
    }

    const inputConstrained: any = fileData["input-constrained"];
    if (typeof inputConstrained !== "object") {
        throw new Error("Must provide an object for constrained input.");
    }

    const output: any = fileData.output;
    if (typeof output !== "object") {
        throw new Error("Must provide an object for outputs.");
    }

    return {
        name:            ensureStr(fileData?.name, "name"),
        encoding:        ensureStr(fileData?.encoding, "encoding"),
        constraintsCode: ensureStr(fileData?.constraints, "constraints"),

        inputBase:        objectValueMap(inputBase, inputTransform),
        inputConstrained: objectValueMap(inputConstrained, inputTransform),

        output: objectValueMap(output, (obj: any) => {
            const title: string = ensureStr(obj.title, "output[].title");
            const fields: any = obj.fields;
            if (typeof fields !== "object") {
                throw new Error(`Output ${obj.title} must provide a fields specification object.`);
            }

            const newFieldsEntries = Object.fromEntries(Object.entries(fields).map(
                ([k, v]) => {
                    const fieldKey: string = ensureStr(k, `output[].fields.${title} key`);
                    const fieldTitle: string = ensureStr(v, `output[].fields.${title} value`);
                    return [fieldKey, {title: fieldTitle}];
                }
            ));

            const outputObj = {
                title,
                fields: newFieldsEntries,
            };
            validateOutputPartialSpec(outputObj);
            return outputObj;
        }),
    };
}

