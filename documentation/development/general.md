# Solves General Notes

## Currently implemented features

-Minimal functional demo of a web application based on a simple problem specification.
    - No data validation, and vulnerable to Clingo code injection.
    - Only a functional demo. Not made for a non-technical user.
    - See `../sample_spec/` for the problem specification.

-Early-development version of a node wrapper package for Clingo.
    - Only validated for use in a web application written in TypeScript, and bundled using Webpack.
    - Has overly complex requirements on the side of the package user (e.g. Babel polyfills). This needs improvement.

## Other Tasks

- Continue revising this broad plan and the goals of the project.
- Consider defining epics and user stories to clearly split the work up.
- Estimate time/difficulty of units of work and consider the cost/benefit balance and which groups of users are benefited.
    - Plan implementation roadmap accordingly.
- Do research into what relevant works that exist and where Solves can break new ground.
    - Example: What autocomplete packages exist? How do they work?
    - Example: What web app generators exist? How do they work?
        - Jekyll and Gatsby are examples, even if they're intended for things like blog sites.
    - Example: <http://editor.planning.domains/#>
    - Example: <http://www.tptp.org/cgi-bin/SystemOnTPTP>
- Do research into problems that can be turned into solver apps.
    - Such solver apps should ideally be practical, but toy/fun demonstrations may also be made.
- Look into the I/O capabilities of Clingo and other solver backends, and whether it should be used here.
    - I feel like code generation shouldn't be the only way to use a solver backend...
- Consider conducting UX research
- Come up with a better project name (Solves is currently a codename, not intended to be permanent).

