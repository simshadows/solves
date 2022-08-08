/*
 * Filename: spec-parse.ts
 * Author:   simshadows <contact@simshadows.com>
 * License:  GNU Affero General Public License v3 (AGPL-3.0)
 */

import fs from "fs";

import yaml from "js-yaml";

import {
    setIntersection,
    objectValueMap,
} from "./utils";

// TODO: Not entirely sure why I'm getting type issues. We're using this as a crutch for now.
function ensureStr(obj: any, argName: string): string {
    if (typeof obj === "string") return obj;
    throw new Error(`'${argName}' spec key is not a string.`);
}
function ensureInt(obj: any, argName: string): number {
    if (typeof obj !== "number")
        throw new Error(`'${argName}' spec key is not a number.`);
    if (!Number.isSafeInteger(obj))
        throw new Error(`'${argName}' spec key is not a safe integer.`);
    return obj;
}
//function ensureNum(obj: any, argName: string): number {
//    if (typeof obj === "number") return obj;
//    throw new Error(`'${argName}' spec key is not a number.`);
//}

function inputTransform(obj: any): InputPartialSpec {
    // TODO: Simplify this later.
    const title: string = ensureStr(obj.title, "input[].title");
    const parameters: number = ensureInt(obj.params, "input[].params");
    const initialValues: string[] = obj.initialValues
        .map((s: any) => ensureStr(s, "input[].initialValues[]"));
    return {
        title,
        parameters,
        initialValues,
    };
}

function inputIntegerTransform(obj: any): InputIntegerPartialSpec {
    // TODO: Simplify this later.
    const title: string = ensureStr(obj.title, "input-integer[].title");
    const min: number = ensureInt(obj.min, "input-integer[].min");
    const max: number = ensureInt(obj.max, "input-integer[].max");
    const initial: number = ensureInt(obj.initial, "input-integer[].initial");
    if (initial < min || initial > max) {
        throw new Error(`Initial value ${initial} falls outside range [${min},${max}].`);
    }
    return {
        title,
        min,
        max,
        initial,
    };
}

/********************************************************************/

interface OutputFieldSpec {
    label: string;
}

interface InputPartialSpec {
    title:         string;
    parameters:    number;
    initialValues: string[];
}
interface InputIntegerPartialSpec {
    title:   string;
    min:     number;
    max:     number;
    initial: number;
}

interface OutputPartialSpec {
    title:  string;
    fields: OutputFieldSpec[];
}

export interface SpecValues {
    name:            string;
    encoding:        string;
    constraintsCode: string;
    
    inputBase:        {[key: string]: InputPartialSpec};
    inputInteger:     {[key: string]: InputIntegerPartialSpec};
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

    const seenKeys: Set<string> = new Set();
    function checkDuplicates(obj: Object): void {
        const keys: Set<string> = new Set(Object.keys(obj));
        const dups: Set<string> = setIntersection(seenKeys, keys);
        if (dups.size > 0) {
            throw new Error(`Duplicate keys found: \n${dups}`);
        }
        for (const k of keys) seenKeys.add(k);
    }

    const inputBase: any = fileData["input-base"];
    if (typeof inputBase !== "object") {
        throw new Error("Must provide an object for input bases.");
    }
    checkDuplicates(inputBase);

    const inputInteger: any = fileData["input-integer"];
    if (typeof inputInteger !== "object") {
        throw new Error("Must provide an object for input integers.");
    }
    checkDuplicates(inputInteger);

    const inputConstrained: any = fileData["input-constrained"];
    if (typeof inputConstrained !== "object") {
        throw new Error("Must provide an object for constrained input.");
    }
    checkDuplicates(inputConstrained);

    const output: any = fileData.output;
    if (typeof output !== "object") {
        throw new Error("Must provide an object for outputs.");
    }
    checkDuplicates(output);

    return {
        name:            ensureStr(fileData?.name, "name"),
        encoding:        ensureStr(fileData?.encoding, "encoding"),
        constraintsCode: ensureStr(fileData?.constraints, "constraints"),

        inputBase:        objectValueMap(inputBase, inputTransform),
        inputInteger:     objectValueMap(inputInteger, inputIntegerTransform),
        inputConstrained: objectValueMap(inputConstrained, inputTransform),

        output: objectValueMap(output, (obj: any) => {
            const title: string = ensureStr(obj.title, "output[].title");
            const fieldLabels: any = obj.fieldLabels;
            if (!Array.isArray(fieldLabels)) {
                throw new Error(`Output ${obj.title} must provide a fields specification array.`);
            }

            const fields: OutputFieldSpec[] = fieldLabels.map(
                x => ({label: ensureStr(x, `output[].fields[].label`)})
            );

            const outputObj = {title, fields};
            return outputObj;
        }),
    };
}

