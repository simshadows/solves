/*
 * Filename: ResultDisplay.tsx
 * Author:   simshadows <contact@simshadows.com>
 * License:  GNU Affero General Public License v3 (AGPL-3.0)
 */

import React from "react";

import {type ClingoResult} from "../runSolver";

import "./ResultDisplay.css";

const solutionRE = /color\(([^,]+),([^,]+)*\)/g;

function parseSolutionStr(s: string) {
    const matches = [...s.matchAll(solutionRE)];
    if (matches.length !== 1) console.error("Expected one match.");
    const match = matches[0];
    if (match?.length !== 3) console.error("Expected three groups.");
    return {
        vertex: match?.[1] || "<INVALID>",
        colour: match?.[2] || "<INVALID>",
    };
}

function renderRow(s: string, i: number) {
    const parsed = parseSolutionStr(s);
    return <tr key={i}>
        <td>{parsed.vertex}</td>
        <td>{parsed.colour}</td>
    </tr>;
}

function renderSatisfiable(solution: string[]) {
    return <table className="result-satisfiable">
        <thead>
            <tr>
                <td>Vertex</td>
                <td>Colour</td>
            </tr>
        </thead>
        <tbody>
            {solution.map(renderRow)}
        </tbody>
    </table>;
}

/*** ***/

interface Props {
    initialized: boolean;
    clingoResult: null | ClingoResult;
}

export function ResultDisplay(props: Props) {
    if (!props.initialized) {
        console.assert(props.clingoResult === null);
        return <>Loading...</>;
    } else if (props.clingoResult === null) {
        return <>Invalid Input.</>;
    }

    switch (props.clingoResult.result) {
        case "SATISFIABLE":
            const solution = props.clingoResult.solution;
            if (solution !== null && solution.length !== 0) {
                return renderSatisfiable(solution);
            } else {
                return <>There is a solution, but it has no values.</>;
            }
        case "UNSATISFIABLE":
            return <>No solution.</>;
        default: console.error("Invalid value."); // Fallthrough
        case "UNKNOWN":
            return <>{props.clingoResult.stderr || "UNKNOWN" }</>;
    }
}

