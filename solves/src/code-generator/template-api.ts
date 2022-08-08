/*
 * Filename: template-api.ts
 * Author:   simshadows <contact@simshadows.com>
 * License:  GNU Affero General Public License v3 (AGPL-3.0)
 */

import {type SpecValues} from "../spec-parse"; 

//export interface Substitutions extends SpecValues {
//    // Nothing for now
//}

function getTemplateAPI(specValues: SpecValues): {[key: string]: any} {
    const ret: {[key: string]: any} = {
        ...specValues,
        upperCaseFirst: (s: string) => {
            // Some type checks since this actually runs in an EJS environment
            if (typeof s !== "string") {
                throw new Error(`upperCaseFirst() expected a string. Instead got type ${typeof s}.`);
            }

            return s.slice(0,1).toUpperCase() + s.slice(1)
        },
    };
    return ret;
}


export default getTemplateAPI;

