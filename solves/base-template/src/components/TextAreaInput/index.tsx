import React from "react";

import {LineHighlighterTextbox} from "../generic/LineHighlighterTextbox";

import "./index.css";

interface Props {
    label:        string;
    initialValue: string;
    invalidLines: Set<string>;
    onChange:     (event: {target: {value: string;};}) => Promise<void>;
}

export function TextAreaInput(props: Props) {
    return <div className="integer-input">
        {props.label}
        <LineHighlighterTextbox {...props} />
    </div>;
}

