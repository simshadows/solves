import React from "react";

interface Props {
    label:        string;
    min:          number;
    max:          number;
    value:        number;
    invalidLines: Set<string>;
    onChange:     (value: number) => Promise<void>;
}

export function IntegerInput(props: Props) {
    const onChange = (event: {target: {value: string}}) => {
        let value = parseInt(event.target.value);
        if (value > props.max) value = props.max;
        if (value < props.min) value = props.min;
        props.onChange(value);
    }
    return <>
        {props.label}
        <input
            type="range"
            min={props.min}
            max={props.max}
            value={props.value}
            onChange={onChange}
        />
        <output>{props.value}</output>
    </>;
}

