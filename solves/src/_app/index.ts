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

class TestComponent extends React.Component<{}, {text: string[]}> {
    constructor(props: {}) {
        super(props);
        this.state = {
            text: ["Loading..."],
        };
    }

    override async componentDidMount() {
        const result = await runClingo();
        this.setState({text: result});
    }

    override render() {
        const elements = [];
        for (const s of this.state.text) {
            elements.push(s);
            elements.push(el("br"));
        }

        return el("div", {id: "hello"},
            ...elements,
        );
    }
}

ReactDOM.render(
    el(TestComponent, null),
    document.getElementById("app-mount")
);

