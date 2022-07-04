import {
    type ClingoResult as _ClingoResult,
    runClingo,
} from "clingo-wrapper";

import logicSpecStr from "./logicSpec.lp";
import validationSpecStr from "./validationSpec.lp";

export type ClingoResult = _ClingoResult;

const reConstant = /^[a-z][a-zA-Z0-9]*$/;

function mergeIndexLists(a: number[], b: number[]): number[] {
    const indexSet: Set<number> = new Set<number>(a.concat(b));
    return Array.from(indexSet);
}

/*** ***/

interface GeneratedClingoFacts {
    clingoFacts:      string[];
    invalidConstants: number[];
}

function generateBaseDef(constants: string[], name: string): GeneratedClingoFacts {
    console.assert(name.match(reConstant));
    const clingoFacts: string[] = [];
    const invalidConstants: number[] = [];
    for (const [i, constant] of constants.entries()) {
        if (constant.match(reConstant)) { // Syntax validation
            clingoFacts.push(`${name}(${constant}).`);
        } else {
            // Placeholder string added to preserve index correspondence
            clingoFacts.push("");
            invalidConstants.push(i);
        }
    }
    return {
        clingoFacts: clingoFacts,
        invalidConstants: invalidConstants,
    };
}

function generateInstDef(constantPairs: string[], name: string): GeneratedClingoFacts {
    console.assert(name.match(reConstant));
    const clingoFacts: string[] = [];
    const invalidPairs: number[] = [];
    for (const [i, part] of constantPairs.entries()) {
        const substrs = part.split(",").map((s) => s.trim());
        const isValidSyntax = (substrs.length === 2)
                              && (substrs[0]?.match(reConstant))
                              && (substrs[1]?.match(reConstant));
        if (isValidSyntax) {
            clingoFacts.push(`${name}(${substrs[0]}, ${substrs[1]}).`);
        } else {
            // Placeholder string added to preserve index correspondence
            clingoFacts.push("");
            invalidPairs.push(i);
        }
    }
    return {
        clingoFacts: clingoFacts,
        invalidConstants: invalidPairs,
    };
}

async function getInvalidEdgeFacts(
    requiredFacts: string,
    edgeFacts: string[],
): Promise<number[]> {

    const invalidIndices: number[] = [];
    for (const [i, edgeFact] of edgeFacts.entries()) {
        const fullQuery = [
            requiredFacts,
            edgeFact,
            validationSpecStr,
        ].join("\n\n");
        const result = await runClingo(fullQuery);
        if (result.result !== "SATISFIABLE") {
            invalidIndices.push(i);
        }
    }
    return invalidIndices;
}

/*** ***/

export interface SolverParameters {
    // TODO: Make edges more suitably structured. (Use tuples?)
    colours:  string[];
    vertices: string[];
    edges:    string[];
}

export interface SolverResult {
    // Clingo-specific output.
    // TODO: Make SolverResult backend-agnostic!
    resultObj: null | ClingoResult;
    invalidInputs: {
        // These are lists of integers, where each integer is an index of
        // an invalid string within the corresponding input list.
        colours:  number[];
        vertices: number[];
        edges:    number[];
    };
}

export async function runSolver(params: SolverParameters): Promise<SolverResult> {
    console.log("Running 'runSolver()'.");
    const coloursFacts = generateBaseDef(params.colours, "colour");
    const verticesFacts = generateBaseDef(params.vertices, "vertex");
    const edgesFacts = generateInstDef(params.edges, "edge");

    const coloursAndVerticesFacts = [
        coloursFacts.clingoFacts.join("\n"),
        verticesFacts.clingoFacts.join("\n"),
    ].join("\n\n");

    const invalidEdgeFactIndices: number[] = await getInvalidEdgeFacts(
        coloursAndVerticesFacts,
        edgesFacts.clingoFacts,
    );

    const totalInvalidEdgeFacts: number[] = mergeIndexLists(
        edgesFacts.invalidConstants,
        invalidEdgeFactIndices,
    );

    const resultObj: null | ClingoResult = await (async()=>{
        const inputsValid = (coloursFacts.invalidConstants.length == 0)
                            && (verticesFacts.invalidConstants.length == 0)
                            && (edgesFacts.invalidConstants.length == 0)
                            && (invalidEdgeFactIndices.length === 0);

        if (inputsValid) {
            const fullQuery = [
                coloursAndVerticesFacts,
                edgesFacts.clingoFacts.join("\n"),
                logicSpecStr,
            ].join("\n\n");
            return runClingo(fullQuery);
        } else {
            return null;
        }
    })();

    return {
        resultObj: resultObj,
        invalidInputs: {
            colours:  coloursFacts.invalidConstants,
            vertices: verticesFacts.invalidConstants,
            edges:    totalInvalidEdgeFacts,
        },
    };
}

