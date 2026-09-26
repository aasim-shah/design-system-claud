/**
 * Spacing, radius, sizing and layering.
 * Everything sits on a 4pt grid (with a 2pt half-step for hairline tweaks).
 */

export const spacing = {
  0: 0,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
} as const;

export type SpacingKey = keyof typeof spacing;

/** Generous, soft corners. Nest with `inner = outer - padding`. */
export const radius = {
  none: 0,
  xs: 6,
  sm: 8,
  md: 10,
  lg: 14,
  xl: 20,
  '2xl': 28,
  full: 9999,
} as const;

export type RadiusKey = keyof typeof radius;

/** Control & component sizes. 44pt is the minimum comfortable touch target. */
export const size = {
  control: { sm: 32, md: 44, lg: 52 },
  icon: { xs: 12, sm: 16, md: 20, lg: 24, xl: 28 },
  avatar: { xs: 24, sm: 32, md: 40, lg: 56, xl: 80 },
  hairline: 0.5,
  maxContentWidth: 1080,
  maxReadableWidth: 680,
} as const;

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

export const zIndex = {
  base: 0,
  raised: 10,
  sticky: 100,
  overlay: 1000,
  modal: 1100,
  toast: 1200,
  tooltip: 1300,
} as const;

export const opacity = {
  disabled: 0.38,
  pressed: 0.7,
  hover: 0.85,
} as const;
