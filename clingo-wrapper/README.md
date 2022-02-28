# clingo-wrapper

Manages the Clingo dependency and wraps it with a useful API with TypeScript support.

**Currently in the very early prototyping stage.**

## TODO

- Make the usage of this package as simple as adding and importing `import {runClingo} from "clingo-wrapper";`. We shouldn't need to add polyfill dependencies and put so much into the `webpack.config.js` file.
- Create a build script that will transpile this package's TypeScript source to Javascript and other necessary files.
- Ideally, find out how to compile Clingo to files that don't require modification or hacky fixes to work work Webpack.
- Create a Clingo compile script that will automatically clone and appropriately compile Clingo from source and insert it into this package's source.
- Figure out how to make this package work outside of the very narrow use-case of being imported into web application code with Webpack and using TypeScript.

## Using clingo-wrapper

**This package is currently only set up to work as an import for web application code bundled using Webpack, requiring TypeScript to be set up**. It could very well work in other contexts, but it's currently untested.

To use it, begin by importing `clingo-wrapper` and using it in your web application code:

```TypeScript
import {runClingo} from "clingo-wrapper";

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

const result = await runClingo(query);
console.log(result);
```

Next, you'll need to add polyfill dependencies:
```
$ yarn add buffer crypto-browserify events path-browserify stream-browserify string_decoder
```

And modify `webpack.config.js` by adding the equivalent of the following:

```Javascript
module.exports = {
    resolve: {
        fallback: {
            "buffer": require.resolve("buffer/"),
            "crypto": require.resolve("crypto-browserify"),
            "events": require.resolve("events/"),
            "path": require.resolve("path-browserify"),
            "stream": require.resolve("stream-browserify"),
            "string_decoder": require.resolve("string_decoder/"),
        },
    },
    module: {
        rules: [
            {test: /\.wasm$/i, type: "asset/resource"},
        ],
    },
};
```

## Compiling Clingo

To compile Clingo, download the latest release from [GitHub](https://github.com/potassco/clingo/releases) and extract the archive.

We will then follow the instructions from [clingo's INSTALL.md](https://github.com/potassco/clingo/blob/master/INSTALL.md#compilation-to-javascript), except we must also add `-s MODULARIZE=1` to `DCMAKE_CXX_FLAGS`. The exact commands that worked for me were:

```
$ cd clingo-5.5.1
$ emcmake cmake -H. -Bbuild \
    -DCLINGO_BUILD_WEB=On \
    -DCLINGO_BUILD_WITH_PYTHON=Off \
    -DCLINGO_BUILD_WITH_LUA=Off \
    -DCLINGO_BUILD_SHARED=Off \
    -DCLASP_BUILD_WITH_THREADS=Off \
    -DCMAKE_VERBOSE_MAKEFILE=On \
    -DCMAKE_BUILD_TYPE=release \
    -DCMAKE_CXX_FLAGS="-std=c++11 -Wall -s DISABLE_EXCEPTION_CATCHING=0 -s MODULARIZE=1" \
    -DCMAKE_CXX_FLAGS_RELEASE="-Os -DNDEBUG" \
    -DCMAKE_EXE_LINKER_FLAGS="" \
    -DCMAKE_EXE_LINKER_FLAGS_RELEASE=""
$ cmake --build build --target web
```

The compiled files `clingo.js` and `clingo.wasm` should now be present in `./build/bin`. Copy both files to `./src/compiled-files` (replacing the existing files).

After copying, you'll need to make some minor modifications to `clingo.js`. This is because by default, Emscripten will attempt to access `/clingo.wasm`. First, we need to add the following lines to the top of the script (comment's optional, but helpful):

```Javascript
const __clingoWASM_importByHand_full = require("./clingo.wasm");
// Extract pathname and remove leading slash
const __clingoWASM_importByHand_modified = (new URL(__clingoWASM_importByHand_full)).pathname.substring(1);
```

Then, search for the string `"clingo.wasm"` in the file and replace it with `__clingoWASM_importByHand_modified`.

## License

### clingo-wrapper

This package is licensed under the [*MIT License (MIT)*](https://opensource.org/licenses/MIT).

### Clingo

This repository contains a compiled copy of [Clingo](https://potassco.org/clingo/). Clingo is licensed under the MIT license. A copy of the license can be found in [`documentation/notices/LICENSE.clingo.md`](https://github.com/simshadows/solves/blob/master/documentation/notices/LICENSE.clingo.md).

### Other Dependencies

Additional software packages are used and managed through the yarn package manager.

