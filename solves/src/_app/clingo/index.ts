/*
 * Filename: index.ts
 * Author:   simshadows <contact@simshadows.com>
 * License:  GNU Affero General Public License v3 (AGPL-3.0)
 *
 * Wraps the Clingo compiled files.
 */

import clingojs from "./compiled-files/clingo.js";

const query = `
base(colour, blue).
base(colour, red).
base(colour, green).

base(vertex, v1).
base(vertex, v2).
base(vertex, v3).
base(vertex, v4).

instance(edge(v1, v2)).
instance(edge(v2, v3)).
instance(edge(v3, v4)).
instance(edge(v4, v1)).
instance(edge(v1, v3)).

{ solution(color(V,C)) } :- base(vertex, V), base(colour, C).
coloured(V) :- solution(color(V,C)).
:- base(vertex, V), not coloured(V).
:- solution(color(V,C1)), solution(color(V,C2)), C1 != C2.
:- instance(edge(V1, V2)), solution(color(V1, C)), solution(color(V2, C)).
#show.
#show X : solution(X).
`;

export async function runClingo() {
    const clingoStdout: string[] = [];
    const clingoModule = {
        print: function(s: string) {
            clingoStdout.push(s);
        },
    };

    const clingo = await clingojs(clingoModule);
    await clingo.ccall(
        "run",
        "number",
        ["string", "string"],
        [query],
    );
    return clingoStdout;
}

