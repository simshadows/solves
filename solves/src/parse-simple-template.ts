/*
 * Filename: parse-simple-template.ts
 * Author:   simshadows <contact@simshadows.com>
 * License:  GNU Affero General Public License v3 (AGPL-3.0)
 */

const substitutionRE = /%[a-z0-9]+%/g;

interface SubstitutionInfo {
    name:       string;
    startIndex: number;
    length:     number;
}

function readMatches(template: string): SubstitutionInfo[] {
    const matches = [...template.matchAll(substitutionRE)];
    const substitutions = matches.map((match) => {
        if (match.length !== 1) {
            throw new Error("Expected exactly one group.");
        }
        if (typeof match[0] !== "string") {
            throw new Error("Expected a string.");
        }
        // TODO: Why can match.index be undefined?
        if (typeof match.index !== "number") {
            throw new Error("Expected a number.");
        }

        const substitution = {
            name:       match[0].slice(1, -1),
            startIndex: match.index,
            length:     match[0].length,
        }

        if (substitution.name.length === 0) {
            throw new Error("Name must be non-empty.");
        }

        return substitution;
    });
    return substitutions;
}


export interface PartialTemplate {
    action: "copy" | "substitute";
    value: string;
    /*
     * If action === "copy", then value is simply a verbatim copy.
     * If action === "substitute", then value is the key that must be substituted
     * with the key's corresponding string.
     */
}

/*
 * Builds a list of objects representing a template decomposed into parts.
 */
export function parseSimpleTemplate(template: string): PartialTemplate[] {
    const substitutions = readMatches(template);
    substitutions.sort(x => -x.startIndex);

    let t = template;
    let partials: PartialTemplate[] = [];
    for (const subInfo of substitutions) {
        const endIndex = subInfo.startIndex + subInfo.length;

        if (endIndex > t.length) {
            throw new Error("endIndex should never exceed string length.");
        } else if (endIndex !== t.length) {
            partials.unshift({
                action: "copy",
                value: t.slice(endIndex),
            });
        }

        partials.unshift({
            action: "substitute",
            value: subInfo.name,
        });

        t = t.slice(0, subInfo.startIndex);

    }
    
    if (t.length > 0) {
        partials.unshift({
            action: "copy",
            value: t,
        });
    }

    return partials;
}

