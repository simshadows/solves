/*
 * Filename: index.ts
 * Author:   simshadows <contact@simshadows.com>
 * License:  GNU Affero General Public License v3 (AGPL-3.0)
 */

import {getCLIArgs} from "./arg-parse";
import {getSpecValues} from "./spec-parse";
import {generateSource} from "./code-generator";

const cliArgs = getCLIArgs();

const specValues = getSpecValues(cliArgs.specFilePath);
console.log(specValues);

generateSource(specValues, cliArgs)
    .then()
    .catch(err => {
        console.log(err);
    });

