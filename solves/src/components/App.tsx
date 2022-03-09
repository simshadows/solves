/*
 * Filename: App.tsx
 * Author:   simshadows <contact@simshadows.com>
 * License:  GNU Affero General Public License v3 (AGPL-3.0)
 */

import React from "react";

import Container from "@mui/material/Container";
import Box       from "@mui/material/Box";
import Grid      from "@mui/material/Grid";
import Paper     from "@mui/material/Paper";
import TextField from "@mui/material/TextField";

import {ResultDisplay} from "./ResultDisplay";

import {
    type ClingoResult,
    runSolver
} from "../runSolver";

function parseInput(s: string): string[] {
    return s.split(/\s+/);
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
        const fullColWidth = 12;

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

        console.log("Invalid inputs:");
        console.log(this.state.invalidInputLines);

        return <Container>
            <Box sx={{my: 6}}>
                <Grid container spacing={3}>
                    <Grid item
                          xs={fullColWidth / 3}
                          sx={{minWidth: "12em"}}>
                        <Paper sx={{ p: 2,
                                     display: "flex",
                                     flexDirection: "column" }}>
                            <TextField
                                label="Colours"
                                multiline
                                rows={10}
                                value={this.state.inputColours}
                                onChange={setColours}
                            />
                        </Paper>
                    </Grid>
                    <Grid item
                          xs={fullColWidth / 3}
                          sx={{minWidth: "8em"}}>
                        <Paper sx={{ p: 2,
                                     display: "flex",
                                     flexDirection: "column" }}>
                            <TextField
                                label="Vertices"
                                multiline
                                rows={10}
                                value={this.state.inputVertices}
                                onChange={setVertices}
                            />
                        </Paper>
                    </Grid>
                    <Grid item
                          xs={fullColWidth / 3}
                          sx={{minWidth: "12em"}}>
                        <Paper sx={{ p: 2,
                                     display: "flex",
                                     flexDirection: "column" }}>
                            <TextField
                                label="Edges"
                                multiline
                                rows={10}
                                value={this.state.inputEdges}
                                onChange={setEdges}
                            />
                        </Paper>
                    </Grid>
                    <Grid item xs={fullColWidth}>
                        <Paper sx={{ p: 2,
                                     display: "flex",
                                     flexDirection: "column",
                                     minHeight: 240,
                                     overflowWrap: "break-word",
                                     fontFamily: "monospace" }}>
                            <ResultDisplay
                                clingoResult={this.state.outputResult}
                                initialized={this.state.initialized}
                            />
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Container>;
    }
}

