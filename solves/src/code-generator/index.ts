/*
 * Filename: index.ts
 * Author:   simshadows <contact@simshadows.com>
 * License:  GNU Affero General Public License v3 (AGPL-3.0)
 */

//import fs from "fs";
//import child_process from "child_process";

import {execute} from "@yarnpkg/shell";

import {type ArgValues} from "../arg-parse";
import {type SpecValues} from "../spec-parse";
import {copyDirAndApplyTemplate} from "./base-template";

const BASE_TEMPLATE_PATH = "./base-template";

export async function generateSource(specValues: SpecValues, cliArgs: ArgValues) {
    if (cliArgs.allowOverwriteOutput) {
        // Weird bug in yarn that causes this to fail.
        // See <https://github.com/yarnpkg/berry/issues/1818>
        //fs.rmSync(String(cliArgs.sourceOutputDirPath), {force: true, recursive: true});
        // We'll just use a shell command for now
        await execute(`rm -rf ${cliArgs.sourceOutputDirPath}`);
        // TODO: Fix this
    }

    copyDirAndApplyTemplate(BASE_TEMPLATE_PATH, cliArgs.sourceOutputDirPath, {
        ...specValues,
    });
    // TODO: Sanitize to prevent command injection

    await execute(
        `cd ${cliArgs.sourceOutputDirPath}`
        + " && yarn set version stable && yarn install"
    );

    if (cliArgs.startDevServer) {
        await execute(
            `cd ${cliArgs.sourceOutputDirPath}`
            + " && yarn start"
        );
    } else {
        if (cliArgs.allowOverwriteOutput) {
            //fs.rmSync(String(cliArgs.appOutputDirPath), {force: true, recursive: true});
            await execute(`rm -rf ${cliArgs.appOutputDirPath}`);
            // TODO: Fix this
        }
        await execute(
            `cd ${cliArgs.sourceOutputDirPath}`
            + ` && yarn build --output-path ${cliArgs.appOutputDirPath}`
        );
    }
}

