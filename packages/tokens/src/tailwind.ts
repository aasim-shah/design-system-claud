/**
 * Tailwind CSS preset (v3 `presets: [...]`, or v4 via `@config`).
 * Every utility points at a Lumen CSS variable, so light/dark switching and
 * brand overrides keep working with zero Tailwind `dark:` variants.
 *
 *   // tailwind.config.ts
 *   import lumen from '@lumen/tokens/tailwind';
 *   export default { presets: [lumen], content: [...] };
 */
import { typography } from './typography.js';
import { spacing, radius, breakpoints } from './layout.js';
import { duration, easing } from './motion.js';

const v = (name: string) => `var(--lm-${name})`;

const kebab = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

const fontSize = Object.fromEntries(
  Object.entries(typography.textStyles).map(([name, s]) => [
    kebab(name),
    [
      `${s.fontSize / 16}rem`,
      { lineHeight: `${s.lineHeight / 16}rem`, letterSpacing: `${s.tracking}em`, fontWeight: s.fontWeight },
    ],
  ]),
);

const intent = (name: string) => ({
  DEFAULT: v(`color-${name}`),
  pressed: v(`color-${name}-pressed`),
  subtle: v(`color-${name}-subtle`),
  on: v(`color-${name}-on`),
});

const preset = {
  theme: {
    screens: Object.fromEntries(Object.entries(breakpoints).map(([k, px]) => [k, `${px}px`])),
    extend: {
      colors: {
        background: {
          DEFAULT: v('color-background-primary'),
          primary: v('color-background-primary'),
          secondary: v('color-background-secondary'),
          tertiary: v('color-background-tertiary'),
          grouped: v('color-background-grouped'),
          'grouped-secondary': v('color-background-grouped-secondary'),
          'grouped-tertiary': v('color-background-grouped-tertiary'),
          elevated: v('color-background-elevated'),
        },
        label: {
          DEFAULT: v('color-label-primary'),
          primary: v('color-label-primary'),
          secondary: v('color-label-secondary'),
          tertiary: v('color-label-tertiary'),
          quaternary: v('color-label-quaternary'),
          inverse: v('color-label-inverse'),
        },
        fill: {
          DEFAULT: v('color-fill-primary'),
          primary: v('color-fill-primary'),
          secondary: v('color-fill-secondary'),
          tertiary: v('color-fill-tertiary'),
          quaternary: v('color-fill-quaternary'),
        },
        separator: { DEFAULT: v('color-separator'), opaque: v('color-separator-opaque') },
        accent: intent('accent'),
        success: intent('success'),
        warning: intent('warning'),
        danger: intent('danger'),
        info: intent('info'),
        blue: v('blue'), green: v('green'), indigo: v('indigo'), orange: v('orange'),
        pink: v('pink'), purple: v('purple'), red: v('red'), teal: v('teal'),
        mint: v('mint'), cyan: v('cyan'), yellow: v('yellow'), brown: v('brown'),
      },
      fontFamily: {
        sans: [v('font-sans')],
        rounded: [v('font-rounded')],
        mono: [v('font-mono')],
      },
      fontSize,
      spacing: Object.fromEntries(Object.entries(spacing).map(([k, px]) => [k, `${px / 16}rem`])),
      borderRadius: Object.fromEntries(
        Object.entries(radius).map(([k, px]) => [k === 'full' ? 'full' : k, `${px}px`]),
      ),
      boxShadow: {
        1: v('shadow-1'), 2: v('shadow-2'), 3: v('shadow-3'), 4: v('shadow-4'),
      },
      transitionDuration: Object.fromEntries(Object.entries(duration).map(([k, ms]) => [k, `${ms}ms`])),
      transitionTimingFunction: Object.fromEntries(
        Object.entries(easing).map(([k, p]) => [k, `cubic-bezier(${p.join(', ')})`]),
      ),
    },
  },
};

export default preset;
