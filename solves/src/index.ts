/*
 * Filename: index.ts
 * Author:   simshadows <contact@simshadows.com>
 * License:  GNU Affero General Public License v3 (AGPL-3.0)
 */

import {execute} from "@yarnpkg/shell";

import {copyDirAndApplyTemplate} from "./base-template";
import {getCLIArgs} from "./arg-parse";

const BASE_TEMPLATE_PATH = "./base-template";

const cliArgs = getCLIArgs();

console.log("Attempting to copy...");

copyDirAndApplyTemplate(BASE_TEMPLATE_PATH, cliArgs.sourceOutputDirPath, {
    slug: "foo",
});
// TODO: Sanitize to prevent command injection
execute(`cd ${cliArgs.sourceOutputDirPath} && yarn set version stable && yarn install`);

console.log("done!")

