# Solves Feature Proposals

*IMPORTANT: For the meantime, this document is stale. Please refer to the thesis initial report for updated information.*

## Core Proposals

### Requirements

- Clingo programmers using the web application generator with no web development knowledge (but understand at a high level how websites work and are hosted):
    - Must be able to easily write problem specifications that the Solves tooling can consume, with minimal documentation.
        - The Clingo (or other solver backends) side of the specification can be assumed knowledge.
    - Must be able to automatically generate a complete functional web application that can be deployed as-is with no modifications, using only a logic specification written in Clingo.
    - Must not need any web development knowledge to generate a website.
    - Can read our documentation to be guided through deploying their app to be hosted on the internet, even if they haven't done it before.
- Non-tech-savvy users of generated web applications:
    - Can access a [properly deployed] application on the internet from a typical modern desktop web browser with no installs or configuration. *(This excludes IE11 for the core proposals, but IE11 will be included in the prioritized proposals.)*
    - Should quickly and easily understand how to use it without reading documentation, after being told what it does.
    - (If possible) should quickly and easily understand what it does without reading documentation.
    - Are assisted using features such as autocomplete and syntax/error highlighting.
- Tech-savvy users of generated web applications:
    - (If possible) should be able to quickly use the app with minimal friction.
    - *(The app should be as streamlined as possible, but priority should be given to non-tech-savvy users and ease of understanding.)*

### Features

- **Core Web Application Generator**
    - Generates a complete functional web application based on a specification that:
        - can be deployed as-is without modification, and
        - with practically no web development knowledge.
    - Uses the specification parsing package.
    - Uses Clingo as the solver backend.
    - Should it be compilable into self-contained executable file formats such as Linux ELF or Windows PE?
        - Ideally, this should lower the barrier to entry.
        - However, since the generated codebase is likely to be a Node package, the programmer may still need to install the Node tooling anyway to build the app.
- **Core Specification Parsing Package**
    - Consumes Clingo code and a JSON-based I/O specification.
        - The I/O specification details the inputs and outputs of the Clingo code, and dependencies between inputs (e.g. graph edges must be between graph vertices).
        - The Clingo code details the problem logic, relating how the inputs are processed to get the outputs.
    - Validates the specification.
    - [Optionally] may validate the Clingo code for obvious issues.
    - The package exposes an API that users of the package can easily consume.

## Prioritized Proposals

### Requirements

- Programmers __of other solver backends__:
    - (Similar to Clingo programmers.)
- Web developers with experience using the implementation technologies of a generated web application:
    - Must be able to easily understand the generated code.
    - Must be able to easily modify the application for:
        - Graphical styling (colours, fonts, borders, etc.).
        - Rearrangement of UI elements.
        - Hand-crafted designs to better guide the user through the use of the application.
        - Further customization of UI elements to better-represent input data (e.g. dropdown menus) and output data (e.g. maybe a world map interactive graphic might be possible).
    - *(Implementation technologies should be selected based on a balance of popularity/ecosystem and practicality.)*
- Web developers __WITHOUT__ experience using the implementation technologies of a generated web application:
    - [To the best of our ability] are guided to help understand the codebase.
- Non-tech-savvy users of generated web applications:
    - Can access a [properly deployed] application on the internet from *Internet Explorer 11 on a desktop system composed of software from 2013* with no installs or configuration.
    - Can access a [properly deployed] application on the internet from *a typical modern mobile browser* with no installs or configuration.
    - Can use the application by installing it natively on a typical *desktop* computer.
    - Can use the application by installing it natively on a typical *mobile* device.

### Features

- **Alternative Solver Backends Support** [HIGH PRIORITY]
    - This can involve things like preprocessors/transpilers for Clingo.
- **Flexible generated codebase** [MEDIUM PRIORITY]
    - The MVP only requires the generated codebase to be functional.
    - This feature takes that a step further by making the generated codebase flexible enough to easily form the basis for a custom app.
    - (See the *Requirements* section for details on what this feature aims for.)
- **Improved I/O specification formats** [MEDIUM PRIORITY]
    - E.g. support an I/O annotation syntax for Clingo source files.
    - Idea for implementation: Maybe the alternative specification formats will be converted to the JSON syntax? This essentially uses the JSON syntax as an intermediate language.
- **Solver library for the web** [MEDIUM PRIORITY]
    - A library that implements the parsing/solving logic, exposing an interface that a web developer can use to design their own custom UI.
    - The web app generator should just make use of this library.
- **Alterernative Web Front-End Tooling Support** [LOW PRIORITY]
    - E.g. Angular or Vue.
- **Responsive Design (i.e. support for mobile devices)** [LOW PRIORITY]
    - This probably already comes with component libraries, but this won't be validated.
    - *IMPORTANT: Maybe we should develop for mobile-first for the MVP? That's a popular development technique, and for good reason since mobile is the harder platform to design for.*
- **Alternative Platform Support** [LOW PRIORITY]
    - E.g. developing native apps for Windows, MacOS, Linux, Android, iOS, etc.
    - Probably using React Native and/or Electron to exploit heavy code sharing with the web app.

## Draft Proposals

### Requirements

*(This section will not be fleshed out until later.)*

### Features

- **Solver code autotesting stubs in generated web app codebases**
    - E.g. if a Clingo programmer generates their codebase, they can then fill out autotests to validate their problem specification.
- **Online Repository**
    - Clingo programmers can simply submit their specs to a website (in a zip/tar file?), and the website will host a generated website through a permalink.
    - How do we sustainably deal with spam or offensive/illegal content?
        - Fees?
        - User accounts?
        - Well-designed administration tools and database schema?
    - This is likely to be __very challenging to secure__ since you're running arbitrary solver code on the browser.
        - E.g. if Clingo allows you to send network requests, or inject Javascript into the browser.
    - Maybe this can be implemented as a PoC?
    - Idea for implementation: The server will store complete single-file specifications at permalinks, and the client-side will pull specifications (via. query string). This assumes specification parsing and UI configuration is done by the front-end.
- **Option For Server-Side Computation**
    - Not entirely sure why you'd want this though. Maybe if the server is massively multi-core (possibly even a cluster) and the solver is somehow configured to use the hardware?
    - This is likely only desired within a private network such as a corporate or university network? Or maybe behind authentication (implemented by the web server)? Otherwise, you open the server up for denial-of-service abuse if it were public.
    - This is likely to be __very challenging to secure__ since you're running arbitrary code on the server. Execution will need to somehow be sandboxed properly.
    - Maybe this can be implemented as a PoC?

