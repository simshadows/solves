/*
 * Filename: index.ts
 * Author:   simshadows <contact@simshadows.com>
 * License:  GNU Affero General Public License v3 (AGPL-3.0)
 */

import "regenerator-runtime/runtime"; // A hack to get it working. Idk how it works. It just do

import React from "react";
import ReactDOM from "react-dom";
const el = React.createElement;

import {runClingo} from "./clingo";

import "./index.css";

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
        return el("div", {id: "hello"},
            this.state.text,
        );
    }
}

ReactDOM.render(
    el(TestComponent, null),
    document.getElementById("app-mount")
);

