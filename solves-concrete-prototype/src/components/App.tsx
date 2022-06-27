/*
 * Filename: App.tsx
 * Author:   simshadows <contact@simshadows.com>
 * License:  GNU Affero General Public License v3 (AGPL-3.0)
 */

import React from "react";

import "./App.css";

import {LineHighlighterTextbox} from "./generic/LineHighlighterTextbox";
import {ResultDisplay} from "./ResultDisplay";

import {
    type ClingoResult,
    runSolver
} from "../runSolver";

function parseInput(s: string): string[] {
    return s.split("\n");
}

interface State {
    initialized: boolean;

    inputColours:  string;
    inputVertices: string;
    inputEdges:    string;

    outputResult: null | ClingoResult;
    invalidInputLines: {
        colours:  number[];
        vertices: number[];
        edges:    number[];
    };
}

export class App extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
            initialized: false,

            // TODO: This is NOT the source of truth for input values. This input
            //       value state should technically no longer exist, and we should
            //       instead set up refs to read directly from their uncontrolled
            //       textboxes. However, I'm going to be looking into ways to turn
            //       LineHighlighterTextbox into a controllable component.
            //       Resolve this ASAP! Either implement a proper uncontrolled
            //       component, or improve LineHighlighterTextbox into a
            //       controllable component!
            inputColours:  "red\ngreen\nblue",
            inputVertices: "v1\nv2\nv3\nv4",
            inputEdges:    "v1,v2\nv2,v3\nv3,v4\nv4,v1\nv1,v3",

            outputResult: null,
            invalidInputLines: {
                colours:  [],
                vertices: [],
                edges:    [],
            },
        };
    }

    async _recalculateOutputs() {
        const result = await runSolver({
            colours:  parseInput(this.state.inputColours),
            vertices: parseInput(this.state.inputVertices),
            edges:    parseInput(this.state.inputEdges),
        });
        this.setState({
            initialized:       true,
            outputResult:      result.resultObj,
            invalidInputLines: result.invalidInputs,
        });
    }

    override async componentDidMount() {
        await this._recalculateOutputs();
    }

    override render() {
        const recalcCallback = async () => this._recalculateOutputs();

        const setColours = async (event: {target: {value: string;};}) => {
            this.setState({inputColours: event.target.value}, recalcCallback);
        };
        const setVertices = async (event: {target: {value: string;};}) => {
            this.setState({inputVertices: event.target.value}, recalcCallback);
        };
        const setEdges = async (event: {target: {value: string;};}) => {
            this.setState({inputEdges: event.target.value}, recalcCallback);
        };

        return <div id="app">
            <div className="text-input-wrapper">
                <LineHighlighterTextbox
                    label="Colours"
                    initialValue={this.state.inputColours}
                    errorLineNumbers={this.state.invalidInputLines.colours}
                    onChange={setColours}
                />
            </div>
            <div className="text-input-wrapper">
                <LineHighlighterTextbox
                    label="Vertices"
                    initialValue={this.state.inputVertices}
                    errorLineNumbers={this.state.invalidInputLines.vertices}
                    onChange={setVertices}
                />
            </div>
            <div className="text-input-wrapper">
                <LineHighlighterTextbox
                    label="Edges"
                    initialValue={this.state.inputEdges}
                    errorLineNumbers={this.state.invalidInputLines.edges}
                    onChange={setEdges}
                />
            </div>
            <div className="output-table-wrapper">
                <ResultDisplay
                    clingoResult={this.state.outputResult}
                    initialized={this.state.initialized}
                />
            </div>
        </div>;
    }
}

