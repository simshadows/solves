import React from "react";

interface Props {
    label:        string;
    min:          number;
    max:          number;
    value:        number;
    invalidLines: Set<string>;
    onChange:     (value: number) => Promise<void>;
}

//interface State {
//    // Nothing for now
//}

export function IntegerInput(props: Props) {
    return <>
        {props.label}
    </>;
}

