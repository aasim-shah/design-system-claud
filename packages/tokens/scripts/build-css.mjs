// Emits dist/tokens.css (CSS custom properties) and dist/tokens.json.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createThemeCss, tokens, lightTheme, darkTheme } from '../dist/index.js';

const out = (f) => fileURLToPath(new URL(`../dist/${f}`, import.meta.url));

const header = `/*! Lumen Design System — tokens.css (generated, do not edit) */\n\n`;
writeFileSync(out('tokens.css'), header + createThemeCss());

writeFileSync(
  out('tokens.json'),
  JSON.stringify(
    { ...tokens, elevation: undefined, motion: { ...tokens.motion, cssEasing: undefined }, themes: { light: lightTheme.colors, dark: darkTheme.colors } },
    null,
    2,
  ),
);
console.log('✓ @lumen/tokens → dist/tokens.css, dist/tokens.json');
