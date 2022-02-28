/*
 * Filename: index.ts
 * Author:   simshadows <contact@simshadows.com>
 * License:  GNU Affero General Public License v3 (AGPL-3.0)
 */

import "regenerator-runtime/runtime"; // A hack to get it working. Idk how it works. It just does...

import React from "react";
import ReactDOM from "react-dom";
const el = React.createElement;

import CssBaseline from "@mui/material/CssBaseline";
import {ThemeProvider} from "@mui/material/styles";
import {runClingo} from "clingo-wrapper";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import {theme} from "./theme";

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

class TestComponent extends React.Component<{}, {text: string}> {
    constructor(props: {}) {
        super(props);
        this.state = {
            text: "Loading...",
        };
    }

    override async componentDidMount() {
        const result = await runClingo(query);
        this.setState({text: JSON.stringify(result)});
    }

    override render() {
        return el(Container, {maxWidth: "sm"},
            el(Box, {sx: {my: 4}},
                el(Typography, { variant: "h4",
                                 gutterBottom: true },
                    "Solves Demo",
                ),
                this.state.text,
            ),
        );
    }
}

ReactDOM.render(
    el(ThemeProvider, {theme: theme},
        el(CssBaseline),
        el(TestComponent),
    ),
    document.getElementById("app-mount")
);

