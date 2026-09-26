// Bundles the showcase into ONE self-contained HTML file: showcase/dist/index.html
import { build } from 'esbuild';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));

const result = await build({
  entryPoints: [root('showcase/main.tsx')],
  bundle: true,
  minify: true,
  format: 'iife',
  jsx: 'automatic',
  write: false,
  define: { 'process.env.NODE_ENV': '"production"' },
  logLevel: 'warning',
});

const js = result.outputFiles[0].text.replace(/<\/script/g, '<\\/script');
const css =
  readFileSync(root('packages/react/dist/styles.css'), 'utf8') + '\n' + readFileSync(root('showcase/showcase.css'), 'utf8');

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<title>Lumen Design System</title>
<meta name="description" content="Lumen — a calm, minimal design system for React, Next.js and React Native." />
<script>try{var s=localStorage.getItem('lumen-showcase-scheme');if(s==='light'||s==='dark')document.documentElement.setAttribute('data-theme',s)}catch(e){}</script>
<style>${css}</style>
</head>
<body>
<div id="root"></div>
<script>${js}</script>
</body>
</html>
`;

mkdirSync(root('showcase/dist'), { recursive: true });
writeFileSync(root('showcase/dist/index.html'), html);
console.log(`✓ showcase → showcase/dist/index.html (${(html.length / 1024).toFixed(0)} KB)`);
