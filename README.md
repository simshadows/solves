# solves

Facilitates the development of user-friendly problem solving apps powered by declarative programming tools.

**Currently in the very early prototyping stage.**

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

The compiled files `clingo.js` and `clingo.wasm` should now be present in `./build/bin`. Simply copy both files to `./solves/src/_app/clingo/compiled-files` (replacing the existing files).

## License

### Original Works

Unless specified, all original source code is licensed under the [*GNU Affero General Public License v3.0 (AGPLv3)*](https://www.gnu.org/licenses/agpl-3.0.en.html).

All other original work is licensed under the [*Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)*](https://creativecommons.org/licenses/by-sa/4.0/).

### Third Party Software

This repository contains a compiled copy of [Clingo](https://potassco.org/clingo/). Clingo is licensed under the MIT license. A copy of the license can be found in [`documentation/notices/LICENSE.clingo.md`](https://github.com/simshadows/solves/blob/master/documentation/notices/LICENSE.clingo.md).

Additional software packages are used and managed through the yarn package manager.

