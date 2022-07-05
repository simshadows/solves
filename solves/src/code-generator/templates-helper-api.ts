/*
 * Filename: templates-helper-api.ts
 * Author:   simshadows <contact@simshadows.com>
 * License:  GNU Affero General Public License v3 (AGPL-3.0)
 */

const helperAPI: {[key: string]: any} = {
    upperCaseFirst: (s: string) => {
        // Some type checks since this actually runs in an EJS environment
        if (typeof s !== "string") {
            throw new Error(`upperCaseFirst() expected a string. Instead got type ${typeof s}.`);
        }

        return s.slice(0,1).toUpperCase() + s.slice(1)
    },
};

export default helperAPI;

