/*
 * Filename: index.tsx
 * Author:   simshadows <contact@simshadows.com>
 * License:  GNU Affero General Public License v3 (AGPL-3.0)
 */

import "regenerator-runtime/runtime"; // A hack to get it working. Idk how it works. It just does...

import React from "react";
import ReactDOM from "react-dom";
import "normalize.css";

import {App} from "./components/App";

import "./index.css";

ReactDOM.render(
    <div className="wrapper">
        <App />
    </div>,
    document.getElementById("app-mount")
);

