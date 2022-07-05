/*
 * Filename: index.ts
 * Author:   simshadows <contact@simshadows.com>
 * License:  GNU Affero General Public License v3 (AGPL-3.0)
 */

import {execute} from "@yarnpkg/shell";

import {type ArgValues} from "../arg-parse";
import {type SpecValues} from "../spec-parse";
import {copyDirAndApplyTemplate} from "./base-template";

const BASE_TEMPLATE_PATH = "./base-template";

export function generateSource(specValues: SpecValues, cliArgs: ArgValues) {
    copyDirAndApplyTemplate(BASE_TEMPLATE_PATH, cliArgs.sourceOutputDirPath, {
        ...specValues,
    });
    // TODO: Sanitize to prevent command injection
    execute(
        `cd ${cliArgs.sourceOutputDirPath}`
        + " && yarn set version stable && yarn install"
        + ` && yarn build --output-path ${cliArgs.appOutputDirPath}`
    );
}

