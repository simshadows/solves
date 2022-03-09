/*
 * Filename: LineHighlighterTextbox.tsx
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
import "codemirror/theme/monokai.css";
// TODO: Change to a different theme later.
//       I'm using monokai for now due to its salience while I debug.

interface Props {
    label:            string;
    initialValue:     string;
    errorLineNumbers: number[];
    onChange:         (event: {target: {value: string;};}) => Promise<void>;
}

export class LineHighlighterTextbox extends React.Component<Props, {}> {
    private myRefs: {
        mount: React.RefObject<HTMLTextAreaElement>;
    };
    private cmInstance: CodeMirror.EditorFromTextArea | null;

    constructor(props: Props) {
        super(props);
        this.myRefs = {
            mount: React.createRef(),
        };
        this.cmInstance = null;
    }

    getValue(): string {
        if (this.cmInstance === null) return this.props.initialValue;
        return this.cmInstance.getValue();
    }

    private changeHandler(
        instance: CodeMirror.Editor,
        changeObj: CodeMirror.EditorChange,
    ): void {
        changeObj; // Unused for now
        const newValue: string = instance.getValue();
        this.props.onChange({target: {value: newValue}});
    }

    private clearMarks(): void {
        if (this.cmInstance === null) {
            console.error("Expected a CM instance.");
            return;
        }

        for (const mark of this.cmInstance.getAllMarks()) {
            mark.clear();
        }
    }

    private setMarks() {
        if (this.cmInstance === null) {
            console.error("Expected a CM instance.");
            return;
        }

        this.clearMarks();
        for (const line of this.props.errorLineNumbers) {
            this.cmInstance.markText(
                {line: line, ch: 0},
                {line: line, ch: 9999}, // Arbitrary end character
                {css: "color: #f00;"},
            );
        }
    }

    override async componentDidMount() {
        const mountPoint: HTMLTextAreaElement | null = this.myRefs.mount.current;
        if (mountPoint === null) throw "Expected a HTML element.";
        this.cmInstance = CodeMirror.fromTextArea(
            mountPoint,
            {
                mode: "javascript",
                theme: "monokai",
            },
        );
        this.cmInstance.setValue(this.props.initialValue);
        this.setMarks();
        this.cmInstance.on("change", this.changeHandler.bind(this));
    }

    override async componentWillUnmount() {
        if (this.cmInstance === null) {
            console.error("Expected a CodeMirror instance.");
            return;
        }
        this.cmInstance.toTextArea(); // Destroys CodeMirror instance
    }

    override render() {
        this.setMarks();
        return <>
            {this.props.label}
            <textarea
                ref={this.myRefs.mount}
            />
        </>;
    }
}

