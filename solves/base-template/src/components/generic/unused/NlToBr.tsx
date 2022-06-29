/*
 * Filename: NlToBr.tsx
 * Author:   simshadows <contact@simshadows.com>
 * License:  GNU Affero General Public License v3 (AGPL-3.0)
 */

import React from "react";

export function NlToBr(props: {value: string}) {
    const elements: (JSX.Element | string)[] = [];
    for (const [i, s] of props.value.split("\n").entries()) {
        if (i !== 0) elements.push(<br key={`b${i}`} />);
        elements.push(s);
    }
    return <>
        {elements}
    </>;
}

