// Generates docs/SPECS.md from @lumen/tokens specs, so the docs always match the code.
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import * as T from '@lumen/tokens';

const out = fileURLToPath(new URL('../docs/SPECS.md', import.meta.url));
const esc = (s) => String(s).replace(/\|/g, '\\|');
const usage = (rows) =>
  ['| Token | Value | Use for |', '| --- | --- | --- |', ...rows.map((r) => `| \`${r.token}\` | ${esc(r.value)} | ${esc(r.use)} |`)].join('\n');

const type = Object.entries(T.textStyles)
  .map(([k, s]) => `| \`${k}\` | ${s.fontSize} | ${s.lineHeight} | ${s.fontWeight} | ${s.tracking}em |`)
  .join('\n');

const comps = [
  '| Component | Height | Padding | Radius | Type | Notes |',
  '| --- | --- | --- | --- | --- | --- |',
  ...T.componentSpecs.map((c) => `| **${c.component}** | ${esc(c.height)} | ${esc(c.padding)} | ${esc(c.radius)} | ${esc(c.type)} | ${esc(c.notes)} |`),
].join('\n');

const md = `# Lumen specs

> Generated from \`packages/tokens/src/specs.ts\` by \`npm run docs\`. Edit that file, not this one.

All values are in px on the web and pt on iOS. On Android they are dp.
Everything sits on a **4pt grid**. Where two values appear, like \`44 (32 / 52)\`, they are the \`md (sm / lg)\` sizes.

## Spacing

${usage(T.spacingUsage)}

**Rules**
- Use \`gap\` on the parent (\`Stack gap={4}\`), not margins on children.
- Related things sit closer than unrelated things. A label is 6 from its field, and a field is 16 from the next field.
- Padding inside a component is always less than or equal to the space around it.

## Layout & margins

${usage(T.layoutRules)}

## Radius

${usage(T.radiusUsage)}

**Nested corners:** inner radius = outer radius − padding. For example, a card with radius 20 and padding 12 holds items with radius 8.

## Typography

| Variant | Size | Line height | Weight | Tracking |
| --- | --- | --- | --- | --- |
${type}

- Body copy is 17. Keep lines under about 65 characters (\`max-readable\` 680px).
- Use one \`largeTitle\` or \`title1\` per screen, and step down one size at a time.
- Secondary text changes color (\`label.secondary\`), not size. Use at most two sizes per component.

## Borders, separators & focus

${usage(T.borderRules)}

## Elevation

${usage(T.elevationUsage)}

## States

${usage(T.stateRules)}

## Motion

${usage(T.motionUsage)}

Springs: \`snappy\` (buttons, toggles), \`smooth\` (thumbs, layout) and \`gentle\` (sheets). Pressed surfaces scale to ${T.motion.pressScale}.

## Layers

${usage(T.zIndexUsage)}

## Components

${comps}
`;

mkdirSync(fileURLToPath(new URL('../docs', import.meta.url)), { recursive: true });
writeFileSync(out, md);
console.log('✓ docs/SPECS.md');
