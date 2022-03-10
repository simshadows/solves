/*
 * Filename: ResultDisplay.tsx
 * Author:   simshadows <contact@simshadows.com>
 * License:  GNU Affero General Public License v3 (AGPL-3.0)
 */

import React from "react";

import Table          from "@mui/material/Table";
import TableBody      from "@mui/material/TableBody";
import TableCell      from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead      from "@mui/material/TableHead";
import TableRow       from "@mui/material/TableRow";
import Box            from "@mui/material/Box";

import {type ClingoResult} from "../runSolver";

const solutionRE = /(?<=color\(.*)[^,]+(?=.*\))/g;

function parseSolutionStr(s: string) {
    const matches = s.match(solutionRE);
    if (matches?.length !== 2) console.error("Expected two items.");
    return {
        // Intentionally treats empty string as invalid
        vertex: matches?.[0] || "<INVALID>",
        colour: matches?.[1] || "<INVALID>",
    };
}

function renderRow(s: string, i: number) {
    const parsed = parseSolutionStr(s);
    return <TableRow key={i}
                     sx={{ "&:last-child td, &:last-child th": {border: 0} }} >
        <TableCell component="th" scope="row">{parsed.vertex}</TableCell>
        <TableCell>{parsed.colour}</TableCell>
    </TableRow>;
}

function renderSatisfiable(solution: string[]) {
    return (
        <TableContainer component={Box}>
            <Table sx={{ minWidth: 650 }} size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Vertex</TableCell>
                        <TableCell>Colour</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {solution.map(renderRow)}
                </TableBody>
            </Table>
        </TableContainer>
    );
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

