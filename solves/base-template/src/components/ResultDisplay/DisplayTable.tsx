import React from "react";

import {type ParsedSolutionSpecialCode} from "../../runSolver";

import "./DisplayTable.css";

function renderRow(strs: string[], i: number) {
    return <tr key={i}>
        {strs.map((x: string, j: number) =>
            <td key={j}>{x}</td>
        )}
    </tr>;
}

/*** ***/

interface Props {
    fieldLabels: string[];
    solutionData: string[][] | ParsedSolutionSpecialCode | "not-initialized";
}

export function DisplayTable(props: Props) {
    switch (props.solutionData) {
        case "not-initialized":
            return <>Loading...</>;
        case "no-solution":
            return <>No solution.</>;
        case "invalid-input":
            return <>Invalid input.</>;
        case "error":
            return <>An error has occurred.</>;
        default: // Fallthrough
    }
    if (props.solutionData.length === 0) {
        return <>There is a solution, but it has no values.</>;
    }

    return <table className="result-satisfiable">
        <thead>
            <tr key={0}>
                {props.fieldLabels.map((x: string, i: number) =>
                    <th key={i}>{x}</th>
                )}
            </tr>
        </thead>
        <tbody>
            {props.solutionData.map(renderRow)}
        </tbody>
    </table>;
}

