/*
 * Filename: App.tsx
 * Author:   simshadows <contact@simshadows.com>
 * License:  GNU Affero General Public License v3 (AGPL-3.0)
 */

import React from "react";
import {
    type ClingoResult,
    runClingo,
} from "clingo-wrapper";

import Container from "@mui/material/Container";
import Box       from "@mui/material/Box";
import Grid      from "@mui/material/Grid";
import Paper     from "@mui/material/Paper";
import TextField from "@mui/material/TextField";

import {ResultDisplay} from "./ResultDisplay";

const logicSpec = `
{ solution(color(V,C)) } :- base(vertex, V), base(colour, C).
coloured(V) :- solution(color(V,C)).
:- base(vertex, V), not coloured(V).
:- solution(color(V,C1)), solution(color(V,C2)), C1 != C2.
:- instance(edge(V1, V2)), solution(color(V1, C)), solution(color(V2, C)).
#show.
#show X : solution(X).
`;

function generateBaseDef(toParse: string, name: string): string {
    const parts = toParse.split(/\s+/);
    const codeLines = [];
    for (const part of parts) {
        codeLines.push(`base(${name}, ${part}).`);
    }
    return codeLines.join("\n");
}

function generateInstDef(toParse: string, name: string): string {
    const parts = toParse.split(/\s+/);
    const codeLines = [];
    for (const part of parts) {
        codeLines.push(`instance(${name}(${part})).`);
    }
    return codeLines.join("\n");
}

interface State {
    inputColours:  string;
    inputVertices: string;
    inputEdges:    string;

    outputResult: null | ClingoResult;
}

export class App extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
            inputColours:  "red\ngreen\nblue",
            inputVertices: "v1\nv2\nv3\nv4",
            inputEdges:    "v1,v2\nv2,v3\nv3,v4\nv4,v1\nv1,v3",

            outputResult: null,
        };
    }

    async _recalculateOutputs() {
        const fullQuery = [
            logicSpec,
            generateBaseDef(this.state.inputColours, "colour"),
            generateBaseDef(this.state.inputVertices, "vertex"),
            generateInstDef(this.state.inputEdges, "edge"),
        ].join("\n\n");

        const result = await runClingo(fullQuery);
        this.setState({outputResult: result});
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
                                     height: 240,
                                     overflowWrap: "break-word",
                                     fontFamily: "monospace" }}>
                            <ResultDisplay clingoResult={this.state.outputResult} />
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Container>;
    }
}

