/*
 * Filename: spec-parse.ts
 * Author:   simshadows <contact@simshadows.com>
 * License:  GNU Affero General Public License v3 (AGPL-3.0)
 */

import fs from "fs";

import {
    type PartialTemplate,
    parseSimpleTemplate,
} from "./parse-simple-template";
import {setDifference} from "./utils";

// TODO: Not entirely sure why I'm getting type issues. We're using this as a crutch for now.
function ensureStr(obj: any, argName: string): string {
    if (typeof obj === "string") return obj;
    throw new Error(`'${argName}' spec key is not a string.`);
}

/*
 * Ensures that the field IDs match what's actually found in the template.
 * Throws human-readable exceptions if errors are found.
 */
function validateOutputPartialSpec(o: OutputPartialSpec): void {
    const fields: Set<string> = new Set(Object.keys(o.fields));
    console.assert(fields.size === Object.keys(o.fields).length);

    const seen: Set<string> = new Set();
    for (const partialTemplate of o.template) {
        if (partialTemplate.action !== "substitute") continue;
        const name = partialTemplate.value;

        if (!fields.has(name)) {
            throw new Error(`The output titled '${o.title}' has a substitution key '${name}' that doesn't correspond to a field ID.`);
        }
        if (seen.has(name)) {
            throw new Error(`The output titled '${o.title}' has a duplicate substitution key '${name}'`);
        }
        seen.add(name);
    }

    const unusedFields: Set<string> = setDifference(fields, seen);
    if (unusedFields.size > 0) {
        const s = [...unusedFields].map(x => "'" + x + "'").join(", ")
        throw new Error(`The output titled '${o.title}' has unused fields: ${s}`);
    }
}

/********************************************************************/


interface InputPartialSpec {
    title: string;
    template: PartialTemplate[];
    substitutionsCount: number;
}

interface OutputPartialSpec {
    title: string;
    fields: {[key: string]: {
        title: string;
    }};
    template: PartialTemplate[];
}

export interface SpecValues {
    name:        string;
    constraints: string;
    encoding:    string;
    
    input:  InputPartialSpec[];
    output: OutputPartialSpec[];
}

export function getSpecValues(specPath: string): SpecValues {
    const fileData: any = JSON.parse(fs.readFileSync(specPath).toString());

    const input: any = fileData.input;
    if (!(input instanceof Array)) {
        throw new Error("Must provide an array of inputs.");
    }

    const output: any = fileData.output;
    if (!(output instanceof Array)) {
        throw new Error("Must provide an array of output.");
    }

    return {
        name: ensureStr(fileData?.name, "name"),
        constraints: ensureStr(fileData?.constraints, "constraints"),
        encoding: ensureStr(fileData?.encoding, "encoding"),

        input: input.map((obj: any) => {
            const title: string = ensureStr(obj.title, "input[].title");
            const template: string = ensureStr(obj.template, "input[].template");
            const substitutionsCount: number = (template.match(/%/g) || []).length;
            if (substitutionsCount === 0) {
                throw new Error(`Input ${obj.title} must provide a template that includes substitution markers.`);
            }
            return {
                title,
                template: parseSimpleTemplate(template),
                substitutionsCount
            };
        }),

        output: output.map((obj: any) => {
            const title: string = ensureStr(obj.title, "output[].title");
            const fields: any = obj.fields;
            if (typeof fields !== "object") {
                throw new Error(`Output ${obj.title} must provide a fields specification object.`);
            }
            const template: string = ensureStr(obj.template, "output[].template");

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
                template: parseSimpleTemplate(template),
            };
            validateOutputPartialSpec(outputObj);
            return outputObj;
        }),
    };
}

