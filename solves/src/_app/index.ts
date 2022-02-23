import React from "react";
import ReactDOM from "react-dom";
const el = React.createElement;

import "./index.css";

function TestComponent() {
    return el("div", {id: "hello"},
        "Hello, World!",
    );
}

ReactDOM.render(
    el(TestComponent, null),
    document.getElementById("app-mount")
);

