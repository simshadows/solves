/*
 * Filename: index.ts
 * Author:   simshadows <contact@simshadows.com>
 * License:  MIT License (MIT)
 */

import clingojs from "./compiled-files/clingo.js";

const CLINGO_OPTIONS = "--outf=2";

export type ClingoResultString = "SATISFIABLE" | "UNSATISFIABLE" | "UNKNOWN";

export interface ClingoResult {
    result: ClingoResultString;
    models: {
        found: number;
        more:  string;
    },
    solution: null | string[];
    stderr:   string;
}

function isClingResultString(s: string): s is ClingoResultString {
    switch (s) {
        case "SATISFIABLE":
        case "UNSATISFIABLE":
        case "UNKNOWN":
            return true;
        default:
            return false;
    }
}

async function _runClingo(program: string): Promise<{stdout: any, stderr: string}> {
    const clingoStdout: string[] = [];
    const clingoStderr: string[] = [];
    const clingoModule = {
        print: function(s: string) {
            clingoStdout.push(s);
        },
        printErr: function(s: string) {
            clingoStderr.push(s);
        },
    };

    const clingo = await clingojs(clingoModule);
    await clingo.ccall(
        "run",
        "number",
        ["string", "string"],
        [program, CLINGO_OPTIONS],
    );

    const clingoStderrStr = clingoStderr.join("\n");
    if (clingoStderr.length > 0) {
        console.log(`Clingo stderr: ${clingoStderrStr}`);
    }

    const result = JSON.parse(clingoStdout.join(""));
    console.log(result);
    return {
        stdout: result,
        stderr: clingoStderrStr,
    };
}

export async function runClingo(program: string): Promise<ClingoResult> {
    const rawResult = await _runClingo(program);

    const result: any = rawResult.stdout;
    const clingoStderr: any = rawResult.stderr;

    const resultStr: any = result["Result"];
    if (typeof resultStr !== "string") throw "Expected 'Result' string.";
    if (!isClingResultString(resultStr)) throw "Unexpected 'Result' string.";

    const modelsNum: any = result["Models"]?.["Number"];
    if (typeof modelsNum !== "number") throw "Expected 'Models.Number' number.";

    const modelsMore: any = result["Models"]?.["More"];
    if (typeof modelsMore !== "string") throw "Expected 'Models.More' string.";

    const solution: null | string[] = (()=>{
        const call: any = result["Call"];
        if (!Array.isArray(call)) throw "Expected 'Call' array.";
        if (call.length !== 1) {
            console.warn(`'Call' is an array of length ${call.length}.`);
        }

        const callElement = call[0];
        for (const k of Object.keys(callElement)) {
            if (k !== "Witnesses") console.warn(`Found unexpected key: ${k}`);
        }

        const witnesses: any = callElement?.["Witnesses"];
        if (!witnesses) return null; // No falsy value is a solution
        if (!Array.isArray(witnesses)) throw "Expected 'Call[0].Witnesses' array.";
        if (witnesses.length > 1) {
            console.warn(`'Call[0].Witnesses' is an array of length ${witnesses.length}.`);
        }

        const witnessesElement = witnesses[0];
        for (const k of Object.keys(witnessesElement)) {
            if (k !== "Value") console.warn(`Found unexpected key: ${k}`);
        }

        const solutionFinal: any = witnessesElement?.["Value"];
        if (!Array.isArray(solutionFinal)) throw "Expected 'Call[0].Witnesses[0].Value' array.";
        for (const obj of solutionFinal) {
            if (typeof obj !== "string") throw `Solution elements must be strings. Instead found: ${obj}`;
        }

        return solutionFinal;
    })();

    const ret: ClingoResult = {
        result: resultStr,
        models: {
            found: modelsNum,
            more:  modelsMore,
        },
        solution: solution,
        stderr:   clingoStderr,
    };
    console.log(ret);
    return ret;
}

