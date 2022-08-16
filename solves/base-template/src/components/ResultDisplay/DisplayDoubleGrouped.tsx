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

interface GroupDisplayProps {
    key:       string;
    groupName: string;
    data:      string[][];
}

function GroupDisplay(props: GroupDisplayProps) {
    // TODO: How to splice multiple arbitrary indices in a simple manner?
    const modifiedData: string[][] = props.data.map(x => [...x].splice(2));
    return <table className="display-double-grouped-table">
        <thead>
            <tr><th>Group {props.groupName}</th></tr>
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

interface RoundDisplayProps {
    key:       string;
    roundName: string;
    data:      string[][];
}

function RoundDisplay(props: RoundDisplayProps) {
    const grouped: GroupedSolution = arrayGroupAdjacent(
        props.data,
        x => warnIfNotString(x[1]),
    );
    return <div className="output-box">
        <span className="display-double-grouped-title">
            Round {props.roundName}
        </span>
        <div className="display-double-grouped-inner">
            {grouped.map(
                x => <GroupDisplay
                    key={x[0]}
                    groupName={x[0]}
                    data={x[1]}
                />
            )}
        </div>
    </div>;
}

/*** ***/

interface Props {
    fieldLabels: string[];
    solutionData: string[][];
}

export function DisplayDoubleGrouped(props: Props) {
    if (props.solutionData.length === 0) {
        return <div className="output-table-wrapper">
            There is a solution, but it has no values.
        </div>;
    }

    const groupedData: GroupedSolution = arrayGroupAdjacent(
        props.solutionData,
        x => warnIfNotString(x[0]),
    );

    return <>
        {
            groupedData.map(
                x => <RoundDisplay
                    key={x[0]}
                    roundName={x[0]}
                    data={x[1]}
                />
            )
        }
    </>;
}

