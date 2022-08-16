import React from "react";

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
    solutionData: string[][];
}

export function DisplayTable(props: Props) {
    if (props.solutionData.length === 0) {
        return <div className="output-table-wrapper">
            There is a solution, but it has no values.
        </div>;
    }

    return <div className="output-table-wrapper">
        <table className="result-satisfiable">
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
        </table>
    </div>;
}

