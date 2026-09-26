export * from './colors.js';
export * from './color-utils.js';
export * from './typography.js';
export * from './layout.js';
export * from './elevation.js';
export * from './motion.js';
export * from './theme.js';
export { createThemeCss, createBrandsCss, colorVars, staticVars, cssVar, PREFIX } from './css.js';
export * from './brands.js';

import { colors } from './colors.js';
import { typography } from './typography.js';
import { spacing, radius, size, breakpoints, zIndex, opacity } from './layout.js';
import { elevation } from './elevation.js';
import { motion } from './motion.js';

/** Every raw token in one object — handy for docs, Figma sync or JSON export. */
export const tokens = {
  colors,
  typography,
  spacing,
  radius,
  size,
  breakpoints,
  zIndex,
  opacity,
  elevation,
  motion,
} as const;
export * from './specs.js';
