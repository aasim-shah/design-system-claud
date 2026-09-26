// Extracts every ```tsx block marked `// @check web|native <file>` from the skill's
// references and typechecks them against the real packages.
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const refs = `${root}plugins/lumen/skills/design-system/references/`;
const out = `${root}.skill-check/`;
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

let count = 0;
for (const file of readdirSync(refs).filter((f) => f.endsWith('.md'))) {
  const md = readFileSync(refs + file, 'utf8');
  for (const m of md.matchAll(/```tsx\n\/\/ @check (web|native) (\S+)\n([\s\S]*?)```/g)) {
    writeFileSync(`${out}${m[1]}-${m[2]}`, m[3]);
    count++;
  }
}
writeFileSync(
  `${out}tsconfig.json`,
  JSON.stringify({ extends: '../tsconfig.base.json', compilerOptions: { noEmit: true, types: [] }, include: ['*.tsx'] }, null, 2),
);
try {
  execFileSync('npx', ['tsc', '-p', `${out}tsconfig.json`], { cwd: root, stdio: 'inherit' });
  console.log(`✓ ${count} skill snippets typecheck`);
} catch {
  console.error('✗ skill snippets failed to typecheck (see above)');
  process.exitCode = 1;
} finally {
  rmSync(out, { recursive: true, force: true });
}
