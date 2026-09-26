/**
 * Lumen type scale.
 *
 * Mirrors the rhythm of Apple's Human Interface text styles, so web and
 * native share the same vocabulary (`body`, `headline`, `footnote`…).
 *
 * `tracking` is expressed in `em`. On iOS the system font applies optical
 * tracking automatically, so the native adapter only uses it on other
 * platforms / custom fonts.
 */

export const fontFamily = {
  /** SF Pro on Apple platforms, then the best neutral grotesk available. */
  sans:
    '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Inter", "Segoe UI Variable", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
  rounded:
    'ui-rounded, "SF Pro Rounded", -apple-system, BlinkMacSystemFont, "Nunito", "Segoe UI", Roboto, sans-serif',
  mono: 'ui-monospace, "SF Mono", SFMono-Regular, Menlo, Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace',
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  heavy: '800',
} as const;

export type FontWeight = keyof typeof fontWeight;

export interface TextStyle {
  /** px / pt */
  fontSize: number;
  /** px / pt */
  lineHeight: number;
  fontWeight: (typeof fontWeight)[FontWeight];
  /** Letter spacing in em. */
  tracking: number;
}

export const textStyles = {
  display: { fontSize: 48, lineHeight: 52, fontWeight: fontWeight.bold, tracking: -0.022 },
  largeTitle: { fontSize: 34, lineHeight: 41, fontWeight: fontWeight.bold, tracking: -0.016 },
  title1: { fontSize: 28, lineHeight: 34, fontWeight: fontWeight.bold, tracking: -0.014 },
  title2: { fontSize: 22, lineHeight: 28, fontWeight: fontWeight.bold, tracking: -0.012 },
  title3: { fontSize: 20, lineHeight: 25, fontWeight: fontWeight.semibold, tracking: -0.01 },
  headline: { fontSize: 17, lineHeight: 22, fontWeight: fontWeight.semibold, tracking: -0.022 },
  body: { fontSize: 17, lineHeight: 22, fontWeight: fontWeight.regular, tracking: -0.022 },
  callout: { fontSize: 16, lineHeight: 21, fontWeight: fontWeight.regular, tracking: -0.02 },
  subheadline: { fontSize: 15, lineHeight: 20, fontWeight: fontWeight.regular, tracking: -0.016 },
  footnote: { fontSize: 13, lineHeight: 18, fontWeight: fontWeight.regular, tracking: -0.006 },
  caption1: { fontSize: 12, lineHeight: 16, fontWeight: fontWeight.regular, tracking: 0 },
  caption2: { fontSize: 11, lineHeight: 13, fontWeight: fontWeight.regular, tracking: 0.006 },
} as const satisfies Record<string, TextStyle>;

export type TextVariant = keyof typeof textStyles;

export const typography = { fontFamily, fontWeight, textStyles } as const;
