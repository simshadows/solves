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

function generateBaseDef(constants: string[], name: string): string {
    const codeLines = [];
    for (const part of constants) {
        codeLines.push(`base(${name}, ${part}).`);
    }
    return codeLines.join("\n");
}

function generateInstDef(constants: string[], name: string): string {
    const codeLines = [];
    for (const part of constants) {
        codeLines.push(`instance(${name}(${part})).`);
    }
    return codeLines.join("\n");
}

export interface SolverParameters {
    // TODO: Make edges more suitably structured. (Use tuples?)
    colours:  string[];
    vertices: string[];
    edges:    string[];
}

export interface SolverResult {
    // Clingo-specific output.
    // TODO: Make SolverResult backend-agnostic!
    resultObj: ClingoResult;
}

export async function runSolver(params: SolverParameters): Promise<SolverResult> {
    const fullQuery = [
        logicSpec,
        generateBaseDef(params.colours, "colour"),
        generateBaseDef(params.vertices, "vertex"),
        generateInstDef(params.edges, "edge"),
    ].join("\n\n");

    return {
        resultObj: await runClingo(fullQuery),
    };
}

