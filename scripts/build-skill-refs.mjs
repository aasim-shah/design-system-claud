// Copies generated references into the Claude Code skill so it always matches the code:
//   docs/SPECS.md                  → plugins/lumen/skills/design-system/references/specs.md
//   @lumen/icons (names/categories) → plugins/lumen/skills/design-system/references/icons.md
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { iconCategories } from '@lumen/icons';

const ref = (f) => fileURLToPath(new URL(`../plugins/lumen/skills/design-system/references/${f}`, import.meta.url));
const pascal = (n) => n.replace(/(^|-)(\w)/g, (_, __, c) => c.toUpperCase()) + 'Icon';

const specs = readFileSync(fileURLToPath(new URL('../docs/SPECS.md', import.meta.url)), 'utf8').replace(
  /^> Generated from .*$/m,
  '> Generated from the Lumen repo (packages/tokens/src/specs.ts). Values are px on web, pt on iOS, dp on Android.',
);
writeFileSync(ref('specs.md'), specs);

const icons = [
  '# Lumen Rounded icons',
  '',
  '85 icons on a 24px grid with a 2px stroke, round caps and no sharp corners.',
  '',
  '- Web: `import { HomeIcon } from \'@lumen/react\'`, or `<LumenIcon name="home" />`. Icons inherit the text color and scale with the font size.',
  '- React Native: `import { HomeIcon } from \'@lumen/icons/native\'`, then `<HomeIcon size={22} color={theme.colors.label.primary} />`. Needs `react-native-svg`.',
  '- Put an icon that needs a background in an `IconCircle`, never a square tile.',
  '',
  ...Object.entries(iconCategories).flatMap(([cat, names]) => [
    `## ${cat}`,
    '',
    '| name | component |',
    '| --- | --- |',
    ...names.map((n) => `| \`${n}\` | \`${pascal(n)}\` |`),
    '',
  ]),
].join('\n');
writeFileSync(ref('icons.md'), icons);
console.log('✓ skill references: specs.md, icons.md');
