/*
 * This is a prototype module. The goal is to generate this in a better way.
 */

import React from "react";

import {type ParsedSolutionSpecialCode} from "../runSolver";
import {
    warnIfNotString,
    arrayGroupAdjacent,
} from "../utils";

import "./ResultDisplayDoubleGrouped.css";

type GroupedSolution = [string, string[][]][];

/*** ***/

interface GroupDisplayProps {
    key:       string;
    groupName: string;
    data:      string[][];
}

function GroupDisplay(props: GroupDisplayProps) {
    // TODO: How to splice multiple arbitrary indices in a simple manner?
    const modifiedData: string[][] = props.data.map(x => x.splice(2));
    return <table className="output-inner-group">
        <thead>
            <tr><th>Group {props.groupName}</th></tr>
        </thead>
        <tbody>
            {modifiedData.map(
                x => <tr key={warnIfNotString(x[0])}><td>
                    {warnIfNotString(x[0])}
                </td></tr>
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
    return <div className="output-table-wrapper">
        Round {props.roundName}
        {grouped.map(
            x => <GroupDisplay
                key={x[0]}
                groupName={x[0]}
                data={x[1]}
            />
        )}
    </div>;
}

/*** ***/

interface Props {
    fieldLabels: string[];
    solutionData: string[][] | ParsedSolutionSpecialCode | "not-initialized";
}

export function ResultDisplayDoubleGrouped(props: Props) {
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

