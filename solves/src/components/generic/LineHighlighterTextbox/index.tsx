/*
 * Filename: index.tsx
 * Author:   simshadows <contact@simshadows.com>
 * License:  GNU Affero General Public License v3 (AGPL-3.0)
 *
 * IMPORTANT: LineHighlighterTextbox is implemented as an uncontrolled component
 *            for now. Ideally, this should be refactored to allow it to be used
 *            as a controlled component!
 */

import React from "react";
import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
//import "codemirror/theme/monokai.css";

import TextField from "@mui/material/TextField";

import "./index.css";

interface Props {
    label:            string;
    initialValue:     string;
    errorLineNumbers: number[];
    onChange:         (event: {target: {value: string;};}) => Promise<void>;
}

interface State {
    focused: boolean;
}

export class LineHighlighterTextbox extends React.Component<Props, State> {
    private myRefs: {
        mount: React.RefObject<HTMLTextAreaElement>;
    };
    private cmInstance: CodeMirror.EditorFromTextArea | null;
    private currentlyHighlighted: number[];

    constructor(props: Props) {
        super(props);
        this.myRefs = {
            mount: React.createRef(),
        };
        this.cmInstance = null;
        this.currentlyHighlighted = [];
        this.state = {
            focused: false,
        };
    }

    getValue(): string {
        if (this.cmInstance === null) return this.props.initialValue;
        return this.cmInstance.getValue();
    }

    private changeHandler(
        instance: CodeMirror.Editor,
        changeObj: CodeMirror.EditorChange,
    ): void {
        changeObj; // Unused
        const newValue: string = instance.getValue();
        this.props.onChange({target: {value: newValue}});
    }

    private focusHandler(
        instance: CodeMirror.Editor,
        event: FocusEvent,
    ): void {
        instance; // Unused
        event; // Unused
        this.setState({focused: true});
    }

    private blurHandler(
        instance: CodeMirror.Editor,
        event: FocusEvent,
    ): void {
        instance; // Unused
        event; // Unused
        this.setState({focused: false});
    }

    private clearHighlightedLines(): void {
        if (this.cmInstance === null) {
            console.error("Expected a CM instance.");
            return;
        }

        for (const line of this.currentlyHighlighted) {
            this.cmInstance.removeLineClass(line, "wrap", "cm-invalid-line");
        }
        this.currentlyHighlighted = [];
    }

    private setHighlightedLines() {
        if (this.cmInstance === null) {
            console.error("Expected a CM instance.");
            return;
        }

        for (const line of this.props.errorLineNumbers) {
            this.currentlyHighlighted.push(line);
            this.cmInstance.addLineClass(line, "wrap", "cm-invalid-line");
        }
    }

    private updateCMInstance() {
        if (this.cmInstance === null) {
            console.error("Expected a CM instance.");
            return;
        }

        this.clearHighlightedLines();
        this.setHighlightedLines();

        this.cmInstance.setSize("100%", "230px"); // TODO: Make this height configurable!
    }

    override async componentDidMount() {
        const mountPoint: HTMLTextAreaElement | null = this.myRefs.mount.current;
        if (mountPoint === null) throw "Expected a HTML element.";
        this.cmInstance = CodeMirror.fromTextArea(
            mountPoint,
            {
                mode: "javascript",
                //theme: "monokai",
            },
        );
        this.cmInstance.setValue(this.props.initialValue);
        this.updateCMInstance();
        this.cmInstance.on("change", this.changeHandler.bind(this));
        this.cmInstance.on("focus", this.focusHandler.bind(this));
        this.cmInstance.on("blur", this.blurHandler.bind(this));
    }

    override async componentWillUnmount() {
        if (this.cmInstance === null) {
            console.error("Expected a CodeMirror instance.");
            return;
        }
        this.cmInstance.toTextArea(); // Destroys CodeMirror instance
    }

    override render() {
        this.updateCMInstance();
        return <>
            {/*
            <textarea
                ref={this.myRefs.mount}
            />
            */}
            <TextField
                inputProps={{
                    ref: this.myRefs.mount,
                }}
                label={this.props.label}
                multiline
                focused={this.state.focused}
                value={" " /* Hacky way to force the look we want */}
                rows={10}
            />
        </>;
    }
}

