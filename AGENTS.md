# AGENTS.md

## Build, Lint, and Test Commands
- **Build docs:** `npm run docs:build`
- **Dev server:** `npm run docs:dev`
- **Preview docs:** `npm run docs:preview`
- **Lint:** No explicit lint command; use `eslint` for TypeScript/JavaScript if needed.
- **Test:** No explicit test command; add tests and use a standard runner (e.g., vitest, jest) if required.

## Code Style Guidelines
- **Imports:** Use ES module syntax (`import ... from ...`).
- **Formatting:** 2 spaces for indentation. Prefer single quotes for strings.
- **Types:** Use TypeScript for config and scripts when possible.
- **Naming:** Use descriptive, camelCase for variables/functions, PascalCase for types/classes.
- **Error Handling:** Use try/catch for async code. Log errors clearly.
- **Markdown:** Use clear section headers, code blocks, and examples.
- **Docs:** Keep documentation concise and up-to-date.
- **Config:** Place config in `.vitepress/config.mts` using `defineConfig`.
- **Contributions:** Follow these guidelines for consistency and maintainability.

---
For questions, refer to Vitepress docs or ask in project discussions.
