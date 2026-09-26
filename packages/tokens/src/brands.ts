/**
 * Brand presets — one per product.
 *
 * Lumen is monochrome by default (`graphite`). Each preset swaps only the
 * accent family (default / pressed / subtle / on + focus ring); every other
 * role stays neutral so apps built on different brands still feel related.
 *
 * Light values meet WCAG AA (≥ 4.5:1) against white for text and for white
 * labels on filled buttons. Dark values are the vivid system hues, with the
 * label color picked per hue for contrast.
 */
import { semantic, type ColorScheme, type IntentColor } from './colors.js';
import { mix, withAlpha } from './color-utils.js';

export type BrandName = 'graphite' | 'orange' | 'blue' | 'indigo' | 'green' | 'teal' | 'pink' | 'red' | 'purple';

interface BrandDef {
  label: string;
  light: string;
  dark: string;
  /** Label color on the filled dark-mode accent. */
  onDark: '#FFFFFF' | '#000000';
}

export const brandPresets: Record<Exclude<BrandName, 'graphite'>, BrandDef> = {
  orange: { label: 'Orange', light: '#C95100', dark: '#FF9F0A', onDark: '#000000' },
  blue: { label: 'Blue', light: '#0071E3', dark: '#0A84FF', onDark: '#FFFFFF' },
  indigo: { label: 'Indigo', light: '#5856D6', dark: '#7D7AFF', onDark: '#FFFFFF' },
  green: { label: 'Green', light: '#15803D', dark: '#30D158', onDark: '#000000' },
  teal: { label: 'Teal', light: '#0E7C86', dark: '#40C8E0', onDark: '#000000' },
  pink: { label: 'Pink', light: '#E11D48', dark: '#FF375F', onDark: '#FFFFFF' },
  red: { label: 'Red', light: '#DC2626', dark: '#FF453A', onDark: '#FFFFFF' },
  purple: { label: 'Purple', light: '#9333EA', dark: '#BF5AF2', onDark: '#FFFFFF' },
};

export const brandNames: BrandName[] = ['graphite', ...(Object.keys(brandPresets) as Exclude<BrandName, 'graphite'>[])];

export const brandLabel = (name: BrandName) => (name === 'graphite' ? 'Graphite' : brandPresets[name].label);

/** Full accent family for a brand in one color scheme. */
export function brandAccent(name: BrandName, scheme: ColorScheme): IntentColor {
  if (name === 'graphite') return semantic[scheme].accent;
  const b = brandPresets[name];
  const hex = b[scheme];
  return {
    default: hex,
    pressed: scheme === 'dark' ? mix(hex, '#FFFFFF', 0.2) : mix(hex, '#000000', 0.18),
    subtle: withAlpha(hex, scheme === 'dark' ? 0.2 : 0.1),
    on: scheme === 'dark' ? b.onDark : '#FFFFFF',
  };
}

/** Switch knob on the accent track: white unless the accent itself is near-white. */
export function brandThumb(name: BrandName, scheme: ColorScheme): string {
  return name === 'graphite' ? semantic[scheme].accentThumb : '#FFFFFF';
}

export function brandFocus(name: BrandName, scheme: ColorScheme): string {
  if (name === 'graphite') return semantic[scheme].focus;
  return withAlpha(brandPresets[name][scheme], scheme === 'dark' ? 0.55 : 0.4);
}
