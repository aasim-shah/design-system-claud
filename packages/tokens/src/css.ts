/**
 * Turns the tokens into CSS custom properties (`--lm-*`).
 * Used at build time to emit `tokens.css`, and at runtime to emit brand
 * overrides (`createThemeCss({ accent: '#5E5CE6' })`).
 */
import { palette, type ColorScheme, type SemanticColors } from './colors.js';
import { typography } from './typography.js';
import { spacing, radius, size, zIndex, opacity } from './layout.js';
import { cssShadow, type ElevationLevel } from './elevation.js';
import { duration, easing, cssEasing, type EasingKey } from './motion.js';
import { resolveColors, type ThemeOverrides } from './theme.js';
import { brandAccent, brandFocus, brandNames, brandThumb, type BrandName } from './brands.js';

export const PREFIX = 'lm';

const kebab = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/\./g, '_').toLowerCase();

/** Flattens nested color objects: accent.default → accent, accent.subtle → accent-subtle. */
function flattenColors(obj: Record<string, any>, path: string[] = [], out: Record<string, string> = {}) {
  for (const [key, value] of Object.entries(obj)) {
    const next = key === 'default' ? path : [...path, kebab(key)];
    if (typeof value === 'object') flattenColors(value, next, out);
    else out[`--${PREFIX}-color-${next.join('-')}`] = value;
  }
  return out;
}

export function colorVars(colors: SemanticColors, scheme: ColorScheme): Record<string, string> {
  const vars = flattenColors(colors);
  for (const [name, value] of Object.entries(palette[scheme])) vars[`--${PREFIX}-${kebab(name)}`] = value;
  for (const level of [0, 1, 2, 3, 4] as ElevationLevel[]) vars[`--${PREFIX}-shadow-${level}`] = cssShadow(level, scheme);
  return vars;
}

export function staticVars(): Record<string, string> {
  const v: Record<string, string> = {};
  const { fontFamily, fontWeight, textStyles } = typography;
  for (const [k, val] of Object.entries(fontFamily)) v[`--${PREFIX}-font-${k}`] = val;
  for (const [k, val] of Object.entries(fontWeight)) v[`--${PREFIX}-weight-${k}`] = val;
  for (const [name, s] of Object.entries(textStyles)) {
    const n = kebab(name);
    v[`--${PREFIX}-text-${n}-size`] = `${s.fontSize / 16}rem`;
    v[`--${PREFIX}-text-${n}-line`] = `${+(s.lineHeight / s.fontSize).toFixed(4)}`;
    v[`--${PREFIX}-text-${n}-weight`] = s.fontWeight;
    v[`--${PREFIX}-text-${n}-tracking`] = `${s.tracking}em`;
  }
  for (const [k, val] of Object.entries(spacing)) v[`--${PREFIX}-space-${kebab(String(k))}`] = `${val / 16}rem`;
  for (const [k, val] of Object.entries(radius)) v[`--${PREFIX}-radius-${k}`] = `${val}px`;
  for (const [k, val] of Object.entries(size.control)) v[`--${PREFIX}-control-${k}`] = `${val}px`;
  for (const [k, val] of Object.entries(size.icon)) v[`--${PREFIX}-icon-${k}`] = `${val}px`;
  v[`--${PREFIX}-hairline`] = `${size.hairline}px`;
  v[`--${PREFIX}-max-content`] = `${size.maxContentWidth}px`;
  v[`--${PREFIX}-max-readable`] = `${size.maxReadableWidth}px`;
  for (const [k, val] of Object.entries(zIndex)) v[`--${PREFIX}-z-${k}`] = String(val);
  for (const [k, val] of Object.entries(opacity)) v[`--${PREFIX}-opacity-${k}`] = String(val);
  for (const [k, val] of Object.entries(duration)) v[`--${PREFIX}-duration-${k}`] = `${val}ms`;
  for (const k of Object.keys(easing) as EasingKey[]) v[`--${PREFIX}-ease-${k}`] = cssEasing(k);
  return v;
}

const block = (selector: string, vars: Record<string, string>, extra = '') =>
  `${selector} {\n${extra}${Object.entries(vars)
    .map(([k, val]) => `  ${k}: ${val};`)
    .join('\n')}\n}`;

/**
 * Emit a full stylesheet. Dark mode follows the OS by default and can be
 * forced with `data-theme="dark|light"` or a `.dark` / `.light` class on any
 * ancestor (compatible with next-themes).
 */
export function createThemeCss(overrides: ThemeOverrides = {}, options: { includeStatic?: boolean } = {}): string {
  const { includeStatic = true } = options;
  const light = colorVars(resolveColors('light', overrides), 'light');
  const dark = colorVars(resolveColors('dark', overrides), 'dark');
  const parts: string[] = [];
  if (includeStatic) parts.push(block(':root', staticVars()));
  parts.push(block(':root,\n[data-theme="light"],\n.light', light, '  color-scheme: light;\n'));
  parts.push(block('[data-theme="dark"],\n.dark', dark, '  color-scheme: dark;\n'));
  parts.push(
    `@media (prefers-color-scheme: dark) {\n${block(':root:not([data-theme="light"]):not(.light)', dark, '  color-scheme: dark;\n')
      .split('\n')
      .map((l) => '  ' + l)
      .join('\n')}\n}`,
  );
  return parts.join('\n\n') + '\n';
}

/** `cssVar('color-accent')` → `var(--lm-color-accent)` */
export const cssVar = (name: string, fallback?: string) =>
  `var(--${PREFIX}-${name}${fallback ? `, ${fallback}` : ''})`;

function accentVars(name: BrandName, scheme: ColorScheme): Record<string, string> {
  const a = brandAccent(name, scheme);
  return {
    [`--${PREFIX}-color-accent`]: a.default,
    [`--${PREFIX}-color-accent-pressed`]: a.pressed,
    [`--${PREFIX}-color-accent-subtle`]: a.subtle,
    [`--${PREFIX}-color-accent-on`]: a.on,
    [`--${PREFIX}-color-focus`]: brandFocus(name, scheme),
    [`--${PREFIX}-color-accent-thumb`]: brandThumb(name, scheme),
  };
}

/**
 * Scoped brand rules: put `data-brand="orange"` on <html> (whole app) or on
 * any element (one section). Light/dark follow the same rules as tokens.css.
 */
export function createBrandsCss(): string {
  const out: string[] = [];
  const dark: string[] = [];
  const media: string[] = [];
  for (const name of brandNames) {
    const b = `[data-brand="${name}"]`;
    out.push(block(b, accentVars(name, 'light')));
    dark.push(block(`[data-theme="dark"] ${b},\n[data-theme="dark"]${b},\n.dark ${b},\n.dark${b}`, accentVars(name, 'dark')));
    media.push(
      block(`:root:not([data-theme="light"]):not(.light) ${b},\n:root:not([data-theme="light"]):not(.light)${b}`, accentVars(name, 'dark'))
        .split('\n')
        .map((l) => '  ' + l)
        .join('\n'),
    );
  }
  return [...out, ...dark, `@media (prefers-color-scheme: dark) {\n${media.join('\n\n')}\n}`].join('\n\n') + '\n';
}
