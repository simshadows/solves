import "regenerator-runtime/runtime";

import React from "react";
import ReactDOM from "react-dom";
import "normalize.css";

import {App} from "./components/App";

import "./index.css";

ReactDOM.render(
    <div className="wrapper">
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </div>,
    document.getElementById("app-mount")
);

