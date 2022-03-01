/*
 * Filename: App.tsx
 * Author:   simshadows <contact@simshadows.com>
 * License:  GNU Affero General Public License v3 (AGPL-3.0)
 */

import React from "react";
import {runClingo} from "clingo-wrapper";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";

const query = `
base(colour, blue).
base(colour, red).
base(colour, green).

base(vertex, v1).
base(vertex, v2).
base(vertex, v3).
base(vertex, v4).

instance(edge(v1, v2)).
instance(edge(v2, v3)).
instance(edge(v3, v4)).
instance(edge(v4, v1)).
instance(edge(v1, v3)).

{ solution(color(V,C)) } :- base(vertex, V), base(colour, C).
coloured(V) :- solution(color(V,C)).
:- base(vertex, V), not coloured(V).
:- solution(color(V,C1)), solution(color(V,C2)), C1 != C2.
:- instance(edge(V1, V2)), solution(color(V1, C)), solution(color(V2, C)).
#show.
#show X : solution(X).
`;

interface State {
    inputColours:  string;
    inputVertices: string;
    inputEdges:    string;

    outputText: string;
}

export class App extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
            inputColours:  "red\ngreen\nblue",
            inputVertices: "v1\nv2\nv3\nv4",
            inputEdges:    "v1, v2\nv2, v3\nv3, v4\nv4, v1\nv1, v3",

            outputText: "Loading...",
        };
    }

    async _recalculateOutputs() {
        const result = await runClingo(query);
        this.setState({
            outputText: JSON.stringify(result) + String(Date.now()), // hacky temporary demo of rerender
        });
    }

    override async componentDidMount() {
        const result = await runClingo(query);
        this.setState({
            outputText: JSON.stringify(result),
        });
    }

    override render() {
        const fullColWidth = 12;

        const setColours = async (event: {target: {value: string;};}) => {
            this.setState({inputColours: event.target.value});
            await this._recalculateOutputs();
        };
        const setVertices = async (event: {target: {value: string;};}) => {
            this.setState({inputVertices: event.target.value});
            await this._recalculateOutputs();
        };
        const setEdges = async (event: {target: {value: string;};}) => {
            this.setState({inputEdges: event.target.value});
            await this._recalculateOutputs();
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
                                     overflowWrap: "break-word" }}>
                            {this.state.outputText}
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Container>;
    }
}
