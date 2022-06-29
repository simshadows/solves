/*
 * Filename: arg-parse.ts
 * Author:   simshadows <contact@simshadows.com>
 * License:  GNU Affero General Public License v3 (AGPL-3.0)
 */

import {Command} from "commander";

// The commander package seems poorly typed, so I'll need to make explicit checks.
// TODO: Drill into the typing issues later.

function ensureStr(obj: any, argName: string): string {
    if (typeof obj === "string") return obj;
    throw new Error(`'${argName}' argument is not a string.`);
}

/********************************************************************/

export interface ArgValues {
    specFilePath:        string;
    sourceOutputDirPath: string;
    appOutputDirPath:    string;
}

const program = new Command();
program.name("solves");

program
    .requiredOption(
        "-s, --spec <path>",
        "Specification file input.",
    );

program
    .option(
        "--source-out <path>",
        "Output directory for the generated source code.",
        "../../generated-source", // TODO: How to make this relative to invocation?
    );

program
    .option(
        "-o, --app-out <path>",
        "Output directory for the generated static web app.",
        "../../generated-project", // TODO: How to make this relative to invocation?
    );

program.parse();

const rawOptions = program.opts();

const typedOptions: ArgValues = {
    specFilePath: ensureStr(rawOptions["spec"], "spec"),
    sourceOutputDirPath: ensureStr(rawOptions["sourceOut"], "source-out"),
    appOutputDirPath: ensureStr(rawOptions["appOut"], "app-out"),
};

// Some really crude validation for this prototype, for safety
if (typedOptions.sourceOutputDirPath === "") throw "can't be empty";
if (typedOptions.appOutputDirPath === "") throw "can't be empty";

export function getCLIArgs(): Readonly<ArgValues> {
    return typedOptions;
}

console.info("Arguments:");
console.info(typedOptions);
console.info();

