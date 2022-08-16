import React from "react";

import {type ParsedSolutionSpecialCode} from "../../runSolver";

import "./DisplaySpecialMessage.css";

type SpecialCode = ParsedSolutionSpecialCode | "not-initialized";

function getText(specialCode: SpecialCode): string {
    switch (specialCode) {
        case "not-initialized":
            return "Loading...";
        case "no-solution":
            return "No solution.";
        case "invalid-input":
            return "Invalid input.";
        default:
            console.error("Invalid special code.");
            // Fallthrough
        case "error":
            return "An error has occurred.";
    }
}

/*** ***/

interface Props {
    specialCode: SpecialCode;
}

export function DisplaySpecialMessage(props: Props) {
    return <div className="output-table-wrapper">
        {getText(props.specialCode)}
    </div>;
}

