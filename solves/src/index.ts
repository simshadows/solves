/*
 * Filename: index.ts
 * Author:   simshadows <contact@simshadows.com>
 * License:  GNU Affero General Public License v3 (AGPL-3.0)
 */

import {copyDirAndApplyTemplate} from "./base-template";
import {getCLIArgs} from "./arg-parse";

const cliArgs = getCLIArgs();
cliArgs;

console.log("Attempting to copy...");

copyDirAndApplyTemplate("./base-template", "../dist", {
    slug: "foo",
});

console.log("done!!")

