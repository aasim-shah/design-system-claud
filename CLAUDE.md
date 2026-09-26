# Lumen design system — working in this repo

- Packages: `packages/tokens` (source of truth), `packages/icons`, `packages/react`, `packages/react-native`.
  Build order matters: tokens, then icons, then react and react-native (`npm run build` does this).
- Change a value in `packages/tokens/src/*`, never in component CSS. Component CSS uses only `var(--lm-*)`.
- Web and native components share names and props. When you add or change one, update both (or document the gap in the README component tables).
- After changing specs, icons or components, run `npm run docs`. It regenerates `docs/SPECS.md` and
  `plugins/lumen/skills/design-system/references/{specs,icons}.md`. Keep `components-web.md`,
  `components-native.md` and `patterns.md` in that folder accurate by hand.
- Before committing, run `npm run typecheck && npm test`. The tests cover:
  - token contrast and brand AA checks
  - SSR of every web component
  - typechecking of every `// @check` recipe in the skill references
- For visual changes, run `npm run showcase` and open `showcase/dist/index.html`.
- The Claude Code plugin lives in `plugins/lumen` and the marketplace manifest in `.claude-plugin/marketplace.json`.
  Validate both with `claude plugin validate .`.
