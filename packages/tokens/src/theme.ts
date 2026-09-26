import { semantic, palette, type ColorScheme, type SemanticColors, type IntentColor } from './colors.js';
import { intentFrom, withAlpha } from './color-utils.js';
import { typography } from './typography.js';
import { spacing, radius, size, breakpoints, zIndex, opacity } from './layout.js';
import { elevation } from './elevation.js';
import { motion } from './motion.js';

type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };

export interface ThemeOverrides {
  /**
   * Brand accent. One hex for both schemes, or a pair.
   * Pressed / subtle / on colors are derived automatically.
   */
  accent?: string | { light: string; dark: string };
  /** Surgical overrides of any semantic color, per scheme. */
  colors?: Partial<Record<ColorScheme, DeepPartial<SemanticColors>>>;
}

export interface Theme {
  scheme: ColorScheme;
  colors: SemanticColors;
  palette: (typeof palette)[ColorScheme];
  typography: typeof typography;
  spacing: typeof spacing;
  radius: typeof radius;
  size: typeof size;
  breakpoints: typeof breakpoints;
  zIndex: typeof zIndex;
  opacity: typeof opacity;
  motion: typeof motion;
  elevation: typeof elevation;
}

function merge<T>(base: T, patch?: DeepPartial<T>): T {
  if (!patch) return base;
  const out: any = Array.isArray(base) ? [...(base as any)] : { ...base };
  for (const [k, v] of Object.entries(patch)) {
    if (v === undefined) continue;
    out[k] = v && typeof v === 'object' && !Array.isArray(v) ? merge((base as any)[k], v as any) : v;
  }
  return out;
}

export function resolveAccent(
  accent: ThemeOverrides['accent'],
  scheme: ColorScheme,
): IntentColor | undefined {
  if (!accent) return undefined;
  const hex = typeof accent === 'string' ? accent : accent[scheme];
  return intentFrom(hex, scheme);
}

export function resolveColors(scheme: ColorScheme, overrides: ThemeOverrides = {}): SemanticColors {
  let colors = semantic[scheme];
  const accent = resolveAccent(overrides.accent, scheme);
  if (accent) colors = { ...colors, accent, focus: withAlpha(accent.default, scheme === 'dark' ? 0.6 : 0.45) };
  return merge(colors, overrides.colors?.[scheme]);
}

/** Build a fully-resolved theme object for one color scheme. */
export function createTheme(scheme: ColorScheme = 'light', overrides: ThemeOverrides = {}): Theme {
  return {
    scheme,
    colors: resolveColors(scheme, overrides),
    palette: palette[scheme],
    typography,
    spacing,
    radius,
    size,
    breakpoints,
    zIndex,
    opacity,
    motion,
    elevation,
  };
}

export const lightTheme = createTheme('light');
export const darkTheme = createTheme('dark');
