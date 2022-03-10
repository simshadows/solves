# Solves Prototype Planning

*This document records possible immediate next steps for developing the prototype.*

## Next Step Proposals

- Implement single-file spec-parsing and UI-generation
    - Might be worth implementing this ASAP because then, the other features won't need to be refactored anymore.
- Implement textbox autocomplete
    - E.g. when filling out edges, the textbox automatically suggests valid vertices. It may also automatically add a comma.
- Implement arbitrary string mapping
    - E.g. "Foo" is not a valid clingo constant, but if the user inputs it, we might map it to an arbitrary valid constant like "colour1" and automatically translate between string and constant for the UI.
- Implement textbox error messages
    - Instead of just highlighting lines with errors, this means somehow showing a message to user describing what's wrong with their input.
- Implement dropdown-menu-based input components for dependent inputs
    - E.g. Edges input might involve an expandable table consisting of two dropdown menus per row. Each dropdown menu is a selection of vertices.

## Latter-Stage Proposals

- Implement multi-file spec-parsing
- Implement automated testing
    - This should be done ASAP, but due to the rapidly changing design, automated testing is being deferred until things settle.
- Implement a simple web application generator
    - This should actually be quite simple if it just means emitting the same codebase, but with different spec files.

