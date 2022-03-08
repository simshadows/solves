/*
 * Filename: runSolver.ts
 * Author:   simshadows <contact@simshadows.com>
 * License:  GNU Affero General Public License v3 (AGPL-3.0)
 */

import {
    type ClingoResult as _ClingoResult,
    runClingo,
} from "clingo-wrapper";

export type ClingoResult = _ClingoResult;

const logicSpec = `
{ solution(color(V,C)) } :- base(vertex, V), base(colour, C).
coloured(V) :- solution(color(V,C)).
:- base(vertex, V), not coloured(V).
:- solution(color(V,C1)), solution(color(V,C2)), C1 != C2.
:- instance(edge(V1, V2)), solution(color(V1, C)), solution(color(V2, C)).
#show.
#show X : solution(X).
`;

function generateBaseDef(toParse: string, name: string): string {
    const parts = toParse.split(/\s+/);
    const codeLines = [];
    for (const part of parts) {
        codeLines.push(`base(${name}, ${part}).`);
    }
    return codeLines.join("\n");
}

function generateInstDef(toParse: string, name: string): string {
    const parts = toParse.split(/\s+/);
    const codeLines = [];
    for (const part of parts) {
        codeLines.push(`instance(${name}(${part})).`);
    }
    return codeLines.join("\n");
}

export interface SolverParameters {
    // Arbitrary text inputs.
    // runSolver() will be expected to parse them for now.
    // TODO: Implement parsing outside of the runSolver module!
    coloursText:  string;
    verticesText: string;
    edgesText:    string;
}

export interface SolverResult {
    // Clingo-specific output.
    // TODO: Make SolverResult backend-agnostic!
    resultObj: ClingoResult;
}

export async function runSolver(params: SolverParameters): Promise<SolverResult> {
    const fullQuery = [
        logicSpec,
        generateBaseDef(params.coloursText, "colour"),
        generateBaseDef(params.verticesText, "vertex"),
        generateInstDef(params.edgesText, "edge"),
    ].join("\n\n");

    return {
        resultObj: await runClingo(fullQuery),
    };
}

