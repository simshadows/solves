# Solves Broad Planning

## Currently implemented features

**Minimal functional demo of a web application based on a simple problem specification.**
- No data validation, and vulnerable to Clingo code injection.
- Only a functional demo. Not made for a non-technical user.
- See `../sample_spec/` for the problem specification.

**Early-development version of a node wrapper package for Clingo.**
- Only validated for use in a web application written in TypeScript, and bundled using Webpack.
- Has overly complex requirements on the side of the package user (e.g. Babel polyfills). This needs improvement.

## MVP Requirements

- **Web Application Generator (Core)**
    - Clingo programmers using the web application generator with no web development knowledge (but understand at a high level how websites work and are hosted):
        - Must be able to easily write problem specifications that the Solves tooling can consume.
        - Must be able to generate a complete functional web application that can be deployed as-is with no modifications.
        - Must not need any web development knowledge to generate a website.
        - Can read our documentation to be guided through deploying their app to be hosted on the internet, even if they haven't done it before.
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
        - Should quickly and easily understand how to use it without reading documentation, after being told what it does.
        - (If possible) should quickly and easily understand what it does without reading documentation.
        - Are assisted using features such as autocomplete and syntax/error highlighting.
    - Tech-savvy users of generated web applications:
        - (If possible) should be able to quickly use the app with minimal friction. *(The app should be streamlined.)*
- **Specification Parsing Package (Core)**
    - Must meet the needs of the web application generator.
    - The specifications must be writable with minimal reading of documentation.
        - The Clingo (or other solver programs) side of the specification can be assumed knowledge.
    - Must support Clingo.

## Proposed Features

- **Alternative Solver Backends Support** [HIGH PRIORITY]
    - This can involve things like preprocessors/transpilers for Clingo.
- **Solver library for the web** [HIGH PRIORITY]
    - A library that implements the parsing/solving logic, exposing an interface that a web developer can use to design their own custom UI.
    - The web app generator should just make use of this library.
- **Alterernative Web Front-End Tooling Support** [MEDIUM PRIORITY]
    - E.g. Angular or Vue.
- **Online Repository** [LOW PRIORITY]
    - Clingo programmers can simply submit their specs to a website (in a zip/tar file?), and the website will host a generated website through a permalink.
    - How do we sustainably deal with spam or offensive/illegal content? (Fees? User accounts?)
    - This is likely to be very challenging to secure since you're running arbitrary solver code on the browser.
        - E.g. if Clingo allows you to send network requests, or inject Javascript into the browser.
- **Option For Server-Side Computation** [LOW PRIORITY]
    - Not entirely sure why you'd want this though. Maybe if the server is massively multi-core (possibly even a cluster) and the solver is somehow configured to use the hardware?
    - This is likely only desired within a private network such as a corporate or university network? Or maybe behind authentication (implemented by the web server)? Otherwise, you open the server up for denial-of-service abuse if it were public.
    - This is likely to be very challenging to secure since you're running arbitrary code on the server. Execution will need to somehow be sandboxed properly.

## Other Tasks

- Continue revising this broad plan and the goals of the project.
- Refine feature epics:
    - Convert feature epics into user stories
    - Estimate time/difficulty of features and consider the cost/benefit balance and which groups of users are benefited.
    - Plan implementation roadmap accordingly.
- Do research into what relevant works that exist and where Solves can break new ground.
    - Example: What autocomplete packages exist? How do they work?
    - Example: What web app generators exist? How do they work?
        - Jekyll and Gatsby are examples, even if they're intended for things like blog sites.
    - Example: <http://editor.planning.domains/#>
    - Example: <http://www.tptp.org/cgi-bin/SystemOnTPTP>
- Do research into problems that can be turned into solver apps.
    - Such solver apps should ideally be practical, but toy/fun demonstrations may also be made.
- Come up with a better project name (Solves is currently a codename, not intended to be permanent).

