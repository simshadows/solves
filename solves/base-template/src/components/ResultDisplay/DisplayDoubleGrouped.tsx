/*
 * This is a prototype module. The goal is to generate this in a better way.
 * TODO: Immutability at the type-level?
 */

import React from "react";

import {
    warnIfNotString,
    arrayGroupAdjacent,
} from "../../utils";

import "./DisplayDoubleGrouped.css";

type GroupedSolution = [string, string[][]][];

/*** ***/

interface LowPriorityDisplayProps {
    key:           string;
    groupLabel:    string;
    groupPriority: [number, number]; // position 0 is highest priority
    data:          string[][];
}

function LowPriorityDisplay(props: LowPriorityDisplayProps) {
    const [hi, lo] = (
        props.groupPriority[0] > props.groupPriority[1]
        ? [props.groupPriority[0], props.groupPriority[1]]
        : [props.groupPriority[1], props.groupPriority[0]]
    );

    const op: (x: string[]) => string[] = (x) => {
        const arr = [...x];
        arr.splice(hi, 1);
        arr.splice(lo, 1);
        return arr;
    };
    const modifiedData: string[][] = props.data.map(op);

    return <table className="display-double-grouped-table">
        <thead>
            <tr><th>{props.groupLabel}</th></tr>
        </thead>
        <tbody>
            {modifiedData.map(
                x => <tr key={warnIfNotString(x[0])}>
                    <td>
                        {warnIfNotString(x[0])}
                    </td>
                </tr>
            )}
        </tbody>
    </table>;
}

/*** ***/

interface HighPriorityDisplayProps {
    key:           string;
    fieldLabels:   string[];
    groupLabel:    string;
    groupPriority: [number, number]; // position 0 is highest priority
    data:          string[][];
}

function HighPriorityDisplay(props: HighPriorityDisplayProps) {
    const grouped: GroupedSolution = arrayGroupAdjacent(
        props.data,
        x => warnIfNotString(x[props.groupPriority[1]]),
    );
    return <div className="output-box">
        <span className="display-double-grouped-title">
            {props.groupLabel}
        </span>
        <div className="display-double-grouped-inner">
            {grouped.map(
                x => <LowPriorityDisplay
                    key={x[0]}
                    groupLabel={`${props.fieldLabels[props.groupPriority[1]]} ${x[0]}`}
                    groupPriority={props.groupPriority}
                    data={x[1]}
                />
            )}
        </div>
    </div>;
}

/*** ***/

interface Props {
    fieldLabels:   string[];
    groupPriority: [number, number]; // position 0 is highest priority
    solutionData:  string[][];
}

export function DisplayDoubleGrouped(props: Props) {
    if (props.solutionData.length === 0) {
        return <div className="output-table-wrapper">
            There is a solution, but it has no values.
        </div>;
    }

    const groupedData: GroupedSolution = arrayGroupAdjacent(
        props.solutionData,
        x => warnIfNotString(x[props.groupPriority[0]]),
    );

    return <>
        {
            groupedData.map(
                x => <HighPriorityDisplay
                    key={x[0]}
                    fieldLabels={props.fieldLabels}
                    groupLabel={`${props.fieldLabels[props.groupPriority[0]]} ${x[0]}`}
                    groupPriority={props.groupPriority}
                    data={x[1]}
                />
            )
        }
    </>;
}

