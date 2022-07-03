/*
 * Filename: spec-parse.ts
 * Author:   simshadows <contact@simshadows.com>
 * License:  GNU Affero General Public License v3 (AGPL-3.0)
 */

import fs from "fs";

// TODO: Not entirely sure why I'm getting type issues. We're using this as a crutch for now.
function ensureStr(obj: any, argName: string): string {
    if (typeof obj === "string") return obj;
    throw new Error(`'${argName}' spec key is not a string.`);
}

/********************************************************************/

interface OutputFieldSpec {
    title: string;
}

export interface SpecValues {
    name:        string;
    constraints: string;
    encoding:    string;
    
    input: {
        title:              string;
        template:           string;
        substitutionsCount: number;
    }[];

    output: {
        title: string;
        fields: {[key: string]: OutputFieldSpec};
        template: string;
    }[];
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
            return {title, template, substitutionsCount};
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
            return {
                title,
                fields: newFieldsEntries,
                template,
            };
        }),
    };
}

