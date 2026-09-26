// Bundles tokens + base + components into dist/styles.css (one import for apps),
// and ships components.css alone for apps that load tokens separately.
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const here = (p) => fileURLToPath(new URL(p, import.meta.url));

const tokens = readFileSync(require.resolve('@lumen/tokens/tokens.css'), 'utf8');
const base = readFileSync(here('../src/styles/base.css'), 'utf8');
const components = readFileSync(here('../src/styles/components.css'), 'utf8');

writeFileSync(here('../dist/components.css'), base + '\n' + components);
writeFileSync(here('../dist/styles.css'), tokens + '\n' + base + '\n' + components);
console.log('✓ @lumen/react → dist/styles.css');
