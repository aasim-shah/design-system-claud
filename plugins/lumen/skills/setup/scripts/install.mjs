#!/usr/bin/env node
/**
 * Lumen installer — builds the design system from source and installs it
 * into a project as local tarballs (no npm publishing needed).
 *
 *   node install.mjs [--target .] [--platform auto|next|react|native]
 *                    [--brand orange] [--source <git url | local path>] [--ref <branch>]
 *                    [--dry-run]
 *
 * What it does:
 *   1. Gets the Lumen repo (clones --source, or uses a local checkout).
 *   2. Runs `npm ci && npm run build` there.
 *   3. Packs the needed packages into <target>/vendor/lumen/*.tgz.
 *   4. Adds them to the target with its own package manager (npm, pnpm,
 *      yarn or bun) and pins @lumen/* to those tarballs.
 *   5. For React Native, also installs react-native-svg (for the icons).
 * It never edits your source files; it prints the snippets to add.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative, resolve } from 'node:path';

const DEFAULT_SOURCE = 'https://github.com/aasim-shah/design-system-claud.git';
const BRANDS = ['graphite', 'orange', 'blue', 'indigo', 'green', 'teal', 'pink', 'red', 'purple'];

function parseArgs(argv) {
  const args = { target: '.', platform: 'auto', brand: 'graphite', source: DEFAULT_SOURCE, ref: '', dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i];
    if (a === '--target') args.target = next();
    else if (a === '--platform') args.platform = next();
    else if (a === '--brand') args.brand = next();
    else if (a === '--source') args.source = next();
    else if (a === '--ref') args.ref = next();
    else if (a === '--dry-run') args.dryRun = true;
    else if (a === '-h' || a === '--help') {
      console.log(readFileSync(new URL(import.meta.url), 'utf8').split('*/')[0]);
      process.exit(0);
    } else fail(`Unknown option: ${a}`);
  }
  return args;
}

function fail(msg) {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

function run(cmd, args, cwd, dryRun) {
  console.log(`  $ ${cmd} ${args.join(' ')}${cwd ? `   (in ${cwd})` : ''}`);
  if (dryRun) return '';
  try {
    return execFileSync(cmd, args, { cwd, stdio: ['ignore', 'pipe', 'inherit'], encoding: 'utf8', shell: process.platform === 'win32' });
  } catch {
    fail(`\`${cmd} ${args.join(' ')}\` failed (see the output above). Fix that error, then re-run this script.`);
  }
}

function detectPlatform(pkg) {
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  if (deps['react-native'] || deps.expo) return 'native';
  if (deps.next) return 'next';
  if (deps.react) return 'react';
  return null;
}

function detectPackageManager(dir) {
  if (existsSync(join(dir, 'pnpm-lock.yaml'))) return 'pnpm';
  if (existsSync(join(dir, 'yarn.lock'))) return 'yarn';
  if (existsSync(join(dir, 'bun.lockb')) || existsSync(join(dir, 'bun.lock'))) return 'bun';
  return 'npm';
}

const args = parseArgs(process.argv.slice(2));
const target = resolve(args.target);
if (!existsSync(join(target, 'package.json'))) fail(`No package.json in ${target}. Run inside your app, or pass --target <app dir>.`);
if (!BRANDS.includes(args.brand)) fail(`Unknown brand "${args.brand}". Use one of: ${BRANDS.join(', ')}`);

const pkgPath = join(target, 'package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
const platform = args.platform === 'auto' ? detectPlatform(pkg) : args.platform;
if (!['next', 'react', 'native'].includes(platform ?? ''))
  fail('Could not detect the platform. Pass --platform next | react | native.');
const pm = detectPackageManager(target);

console.log(`\nLumen setup → ${target}\n  platform: ${platform} · package manager: ${pm} · brand: ${args.brand}\n`);

/* 1. Source ---------------------------------------------------------------- */
let source = args.source;
let cleanup = null;
const isLocal = existsSync(resolve(source, 'packages', 'tokens', 'package.json'));
if (isLocal) {
  source = resolve(source);
  console.log(`1. Using local checkout ${source}`);
} else {
  const dir = mkdtempSync(join(tmpdir(), 'lumen-'));
  console.log(`1. Cloning ${source}${args.ref ? ` (${args.ref})` : ''}`);
  run('git', ['clone', '--depth', '1', ...(args.ref ? ['--branch', args.ref] : []), source, dir], undefined, args.dryRun);
  source = dir;
  cleanup = dir;
}

/* 2. Build ----------------------------------------------------------------- */
console.log('\n2. Building');
if (!existsSync(join(source, 'node_modules')) || !isLocal) run('npm', ['ci', '--no-audit', '--no-fund'], source, args.dryRun);
const platformPkg = platform === 'native' ? '@lumen/react-native' : '@lumen/react';
// Build in dependency order; only what this app needs.
for (const w of ['@lumen/tokens', '@lumen/icons', platformPkg]) run('npm', ['run', 'build', '-w', w], source, args.dryRun);

/* 3. Pack ------------------------------------------------------------------ */
console.log('\n3. Packing');
const vendor = join(target, 'vendor', 'lumen');
const wanted = ['@lumen/tokens', '@lumen/icons', platformPkg];
if (!args.dryRun) {
  mkdirSync(vendor, { recursive: true });
  for (const f of readdirSync(vendor)) if (f.endsWith('.tgz')) rmSync(join(vendor, f));
}
run('npm', ['pack', ...wanted.flatMap((w) => ['-w', w]), '--pack-destination', vendor], source, args.dryRun);

const tarballs = {};
for (const name of wanted) {
  const file = `${name.replace('@', '').replace('/', '-')}-${
    JSON.parse(readFileSync(join(source, 'packages', name.split('/')[1], 'package.json'), 'utf8')).version
  }.tgz`;
  tarballs[name] = `./${relative(target, join(vendor, file)).split('\\').join('/')}`;
}

/* 4. Install --------------------------------------------------------------- */
console.log('\n4. Installing into your project');
if (pm !== 'npm') {
  // pnpm / yarn / bun resolve each package's own dependencies strictly, so pin
  // @lumen/* to the local tarballs everywhere in the tree.
  const spec = Object.fromEntries(Object.entries(tarballs).map(([k, v]) => [k, `file:${v}`]));
  if (pm === 'pnpm') pkg.pnpm = { ...pkg.pnpm, overrides: { ...pkg.pnpm?.overrides, ...spec } };
  else if (pm === 'yarn') pkg.resolutions = { ...pkg.resolutions, ...spec };
  else pkg.overrides = { ...pkg.overrides, ...spec };
  if (!args.dryRun) writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log(`  pinned @lumen/* via ${pm === 'pnpm' ? 'pnpm.overrides' : pm === 'yarn' ? 'resolutions' : 'overrides'}`);
}
const addCmd = { npm: ['install'], pnpm: ['add'], yarn: ['add'], bun: ['add'] }[pm];
run(pm, [...addCmd, ...Object.values(tarballs)], target, args.dryRun);

if (platform === 'native') {
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  if (!deps['react-native-svg']) {
    if (deps.expo) run('npx', ['expo', 'install', 'react-native-svg'], target, args.dryRun);
    else run(pm, [...addCmd, 'react-native-svg'], target, args.dryRun);
  }
}

if (cleanup && !args.dryRun) rmSync(cleanup, { recursive: true, force: true });

/* 5. Next steps ------------------------------------------------------------ */
const brandAttr = args.brand === 'graphite' ? '' : ` data-brand="${args.brand}"`;
const brandProp = args.brand === 'graphite' ? '' : ` brand="${args.brand}"`;
const snippets = {
  next: `// app/layout.tsx
import '@lumen/react/styles.css';
import { ThemeScript, ToastProvider } from '@lumen/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en"${brandAttr} suppressHydrationWarning>
      <head><ThemeScript /></head>
      <body><ToastProvider>{children}</ToastProvider></body>
    </html>
  );
}`,
  react: `// src/main.tsx
import '@lumen/react/styles.css';
${brandAttr ? `document.documentElement.dataset.brand = '${args.brand}';\n` : ''}// wrap <App /> in <ToastProvider> (and <ThemeProvider> if you want a light/dark toggle)`,
  native: `// App.tsx
import { ThemeProvider, ToastProvider } from '@lumen/react-native';

export default function App() {
  return (
    <ThemeProvider${brandProp}>
      <ToastProvider>{/* your navigation / screens */}</ToastProvider>
    </ThemeProvider>
  );
}`,
};

console.log(`\n✓ Lumen installed (${wanted.join(', ')}).\n\nAdd this to your app:\n\n${snippets[platform]}\n`);
console.log(`Commit vendor/lumen/*.tgz so teammates and CI install the same build.\nRe-run this script to update to the latest Lumen.\n`);
