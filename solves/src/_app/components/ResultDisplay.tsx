/*
 * Filename: ResultDisplay.tsx
 * Author:   simshadows <contact@simshadows.com>
 * License:  GNU Affero General Public License v3 (AGPL-3.0)
 */

import React from "react";

import {type ClingoResult} from "clingo-wrapper";

import {NlToBr} from "./generic/NlToBr";

function renderSatisfiable(solution: null | string[]) {
    return <>
        {solution ? <NlToBr value={solution.join("\n")} /> : "(nothing)"}
    </>;
}

interface Props {
    clingoResult: null | ClingoResult;
}

export function ResultDisplay(props: Props) {
    if (props.clingoResult === null) {
        return <>
            Loading...
        </>;
    }

    switch (props.clingoResult.result) {
        case "SATISFIABLE":
            return renderSatisfiable(props.clingoResult.solution);
        case "UNSATISFIABLE":
            return <>
                No solution.
            </>;
        default: console.error("Invalid value."); // Fallthrough
        case "UNKNOWN":
            return <>
                {props.clingoResult.stderr || "UNKNOWN" }
            </>;
    }
}

