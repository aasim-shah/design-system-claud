/**
 * Elevation — soft, diffuse, never harsh.
 * Each level is described once and rendered for CSS and React Native.
 */

import type { ColorScheme } from './colors.js';

interface ShadowLayer {
  y: number;
  blur: number;
  spread: number;
  opacity: number;
}

export type ElevationLevel = 0 | 1 | 2 | 3 | 4;

const layers: Record<ElevationLevel, ShadowLayer[]> = {
  0: [],
  1: [
    { y: 1, blur: 2, spread: 0, opacity: 0.06 },
    { y: 1, blur: 3, spread: 0, opacity: 0.04 },
  ],
  2: [
    { y: 2, blur: 8, spread: 0, opacity: 0.06 },
    { y: 4, blur: 16, spread: -2, opacity: 0.06 },
  ],
  3: [
    { y: 8, blur: 24, spread: -4, opacity: 0.1 },
    { y: 4, blur: 8, spread: -2, opacity: 0.04 },
  ],
  4: [
    { y: 24, blur: 48, spread: -8, opacity: 0.18 },
    { y: 8, blur: 16, spread: -4, opacity: 0.06 },
  ],
};

/** Shadows read weaker on dark surfaces, so they're deepened there. */
const darkBoost = 2.4;

export function cssShadow(level: ElevationLevel, scheme: ColorScheme = 'light'): string {
  const l = layers[level];
  if (!l.length) return 'none';
  const k = scheme === 'dark' ? darkBoost : 1;
  return l
    .map(
      (s) =>
        `0 ${s.y}px ${s.blur}px ${s.spread}px rgba(0, 0, 0, ${+Math.min(s.opacity * k, 0.6).toFixed(3)})`,
    )
    .join(', ');
}

export interface NativeShadow {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  /** Android */
  elevation: number;
}

export function nativeShadow(level: ElevationLevel, scheme: ColorScheme = 'light'): NativeShadow {
  const l = layers[level];
  const primary = l[0] ?? { y: 0, blur: 0, spread: 0, opacity: 0 };
  const k = scheme === 'dark' ? darkBoost : 1;
  return {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: primary.y },
    shadowOpacity: +Math.min(primary.opacity * k * 1.4, 0.6).toFixed(3),
    shadowRadius: primary.blur / 2,
    elevation: [0, 1, 3, 8, 16][level],
  };
}

export const elevation = {
  levels: [0, 1, 2, 3, 4] as const,
  css: cssShadow,
  native: nativeShadow,
};
