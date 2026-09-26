import type { ColorScheme, IntentColor } from './colors.js';

type RGB = [number, number, number];

export function hexToRgb(hex: string): RGB {
  let h = hex.replace('#', '').trim();
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  if (!/^[0-9a-fA-F]{6}$/.test(h)) throw new Error(`[lumen] Invalid hex color: "${hex}"`);
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function rgbToHex([r, g, b]: RGB): string {
  return (
    '#' +
    [r, g, b]
      .map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  );
}

/** Mix `hex` toward `target` by `amount` (0–1). */
export function mix(hex: string, target: string, amount: number): string {
  const a = hexToRgb(hex);
  const b = hexToRgb(target);
  return rgbToHex([0, 1, 2].map((i) => a[i] + (b[i] - a[i]) * amount) as RGB);
}

export function withAlpha(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** WCAG relative luminance. */
export function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Black or white — whichever reads better on `hex`. */
export function readableOn(hex: string): '#FFFFFF' | '#000000' {
  return contrastRatio(hex, '#FFFFFF') >= contrastRatio(hex, '#000000') * 0.62
    ? '#FFFFFF'
    : '#000000';
}

/**
 * Derive a complete intent color (default / pressed / subtle / on) from one
 * brand hex. Use it to re-brand the accent without hand-tuning every state.
 */
export function intentFrom(hex: string, scheme: ColorScheme): IntentColor {
  return {
    default: hex.toUpperCase(),
    pressed: scheme === 'dark' ? mix(hex, '#FFFFFF', 0.2) : mix(hex, '#000000', 0.18),
    subtle: withAlpha(hex, scheme === 'dark' ? 0.2 : 0.12),
    on: readableOn(hex),
  };
}
