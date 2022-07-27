/*
 * Filename: arg-parse.ts
 * Author:   simshadows <contact@simshadows.com>
 * License:  GNU Affero General Public License v3 (AGPL-3.0)
 */

import path from "path";

import {Command} from "commander";

// The commander package seems poorly typed, so I'll need to make explicit checks.
// TODO: Drill into the typing issues later.

function ensureStr(obj: any, argName: string): string {
    if (typeof obj === "string") return obj;
    throw new Error(`'${argName}' argument is not a string.`);
}

/********************************************************************/

export interface ArgValues {
    specFilePath:         string;
    sourceOutputDirPath:  string;
    appOutputDirPath:     string;

    allowOverwriteOutput: boolean;
    startDevServer:       boolean;
}

const program = new Command();
program.name("solves");

const cwd = process.cwd();

program.requiredOption(
    "-s, --spec <path>",
    "Specification file input.",
);

program.option(
    "--source-out <path>",
    "Output directory for the generated source code.",
    "../../generated-source", // TODO: How to make this relative to invocation?
);

program.option(
    "-o, --app-out <path>",
    "Output directory for the generated static web app.",
    "../../generated-web-app", // TODO: How to make this relative to invocation?
);

program.option(
    "-f, --force",
    "Allows overwriting of output directories (--source-out and --app-out).",
);

program.option(
    "--start-dev-server",
    "Instead of emitting a generated static web app (via. -o/--app-out), start the Webpack dev server. Using --start-dev-server will cause -o/--app-out to be ignored.",
);

program.parse();

const rawOptions = program.opts();

const typedOptions: ArgValues = {
    specFilePath: path.join(cwd, ensureStr(rawOptions["spec"], "spec")),
    sourceOutputDirPath: path.join(cwd, ensureStr(rawOptions["sourceOut"], "source-out")),
    appOutputDirPath: path.join(cwd, ensureStr(rawOptions["appOut"], "app-out")),

    allowOverwriteOutput: (rawOptions["force"] === true),
    startDevServer: (rawOptions["startDevServer"] === true),
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

