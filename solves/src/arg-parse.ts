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
    specFilePath: string;
}

const program = new Command();
program.name("solves");

program
    .requiredOption("-s, --spec <path>");

program.parse();

const rawOptions = program.opts();

const specFilePath: string = ensureStr(rawOptions["spec"], "spec");
const typedOptions: ArgValues = {
    specFilePath,
};

export function getCLIArgs(): Readonly<ArgValues> {
    return typedOptions;
}

console.info("Arguments:");
console.info(typedOptions);
console.info();

