/*
 * Filename: template-api.ts
 * Author:   simshadows <contact@simshadows.com>
 * License:  GNU Affero General Public License v3 (AGPL-3.0)
 */

import {type SpecValues} from "../spec-parse"; 

//export interface Substitutions extends SpecValues {
//    // Nothing for now
//}

const independentAPI: {[key: string]: any} = {
    upperCaseFirst: (s: string) => {
        // Some type checks since this actually runs in an EJS environment
        if (typeof s !== "string") {
            throw new Error(`upperCaseFirst() expected a string. Instead got type ${typeof s}.`);
        }

        return s.slice(0,1).toUpperCase() + s.slice(1)
    },
}

function getTemplateAPI(specValues: SpecValues): {[key: string]: any} {
    const ret: {[key: string]: any} = {
        ...specValues,
        ...independentAPI,

        allInputs: {
            ...specValues.inputBase,
            //...specValues.inputInteger,
            ...specValues.inputConstrained,
        },
        allTextInputs: {
            ...specValues.inputBase,
            ...specValues.inputConstrained,
        },
        allNumericInputs: {
            ...specValues.inputInteger,
        },
    };
    return ret;
}


export default getTemplateAPI;

