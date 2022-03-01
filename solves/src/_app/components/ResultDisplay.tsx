/*
 * Filename: ResultDisplay.tsx
 * Author:   simshadows <contact@simshadows.com>
 * License:  GNU Affero General Public License v3 (AGPL-3.0)
 */

import React from "react";

import {type ClingoResult} from "clingo-wrapper";

interface Props {
    clingoResult: null | ClingoResult;
}

export function ResultDisplay(props: Props) {
    return <>
        {JSON.stringify(props.clingoResult)}
    </>;
}

