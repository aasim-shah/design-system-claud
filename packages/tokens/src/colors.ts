/**
 * Lumen color system.
 *
 * Two layers:
 *  1. `palette`  – raw, vibrant hues tuned separately for light & dark so they
 *                  keep the same perceived weight on white and on black.
 *  2. `semantic` – intent-based roles (background, label, fill, accent…).
 *                  Components only ever consume semantic roles, so swapping a
 *                  theme or brand accent never requires touching a component.
 */

export type ColorScheme = 'light' | 'dark';

export const palette = {
  light: {
    blue: '#007AFF',
    green: '#34C759',
    indigo: '#5856D6',
    orange: '#FF9500',
    pink: '#FF2D55',
    purple: '#AF52DE',
    red: '#FF3B30',
    teal: '#30B0C7',
    mint: '#00C7BE',
    cyan: '#32ADE6',
    yellow: '#FFCC00',
    brown: '#A2845E',
    gray: '#8E8E93',
    gray2: '#AEAEB2',
    gray3: '#C7C7CC',
    gray4: '#D1D1D6',
    gray5: '#E5E5EA',
    gray6: '#F2F2F7',
    white: '#FFFFFF',
    black: '#000000',
  },
  dark: {
    blue: '#0A84FF',
    green: '#30D158',
    indigo: '#5E5CE6',
    orange: '#FF9F0A',
    pink: '#FF375F',
    purple: '#BF5AF2',
    red: '#FF453A',
    teal: '#40C8E0',
    mint: '#63E6E2',
    cyan: '#64D2FF',
    yellow: '#FFD60A',
    brown: '#AC8E68',
    gray: '#8E8E93',
    gray2: '#636366',
    gray3: '#48484A',
    gray4: '#3A3A3C',
    gray5: '#2C2C2E',
    gray6: '#1C1C1E',
    white: '#FFFFFF',
    black: '#000000',
  },
} as const;

export type PaletteColor = keyof typeof palette.light;

export interface IntentColor {
  /** Solid color for text, icons and filled controls. */
  default: string;
  /** Pressed / active state of the solid color. */
  pressed: string;
  /** Tinted, low-contrast background (badges, banners, tinted buttons). */
  subtle: string;
  /** Foreground to place on top of `default`. */
  on: string;
}

export interface SemanticColors {
  background: {
    /** Main app canvas. */
    primary: string;
    /** Content layered on primary (e.g. a sidebar or a card on plain bg). */
    secondary: string;
    /** Content layered on secondary. */
    tertiary: string;
    /** Canvas for grouped / inset content (Settings-style screens). */
    grouped: string;
    /** Cells & cards on the grouped canvas. */
    groupedSecondary: string;
    /** Content inside grouped cells. */
    groupedTertiary: string;
    /** Floating surfaces: popovers, menus, sheets. */
    elevated: string;
  };
  label: {
    primary: string;
    secondary: string;
    tertiary: string;
    quaternary: string;
    /** Text on an inverted surface (e.g. a toast). */
    inverse: string;
  };
  /** Translucent fills for thin/small shapes: tracks, inputs, chips. */
  fill: {
    primary: string;
    secondary: string;
    tertiary: string;
    quaternary: string;
  };
  separator: {
    /** Hairline that lets content behind it show through. */
    default: string;
    /** Solid hairline. */
    opaque: string;
  };
  /** Translucent "materials" meant to sit on top of a backdrop blur. */
  material: {
    thin: string;
    regular: string;
    thick: string;
  };
  accent: IntentColor;
  success: IntentColor;
  warning: IntentColor;
  danger: IntentColor;
  info: IntentColor;
  /** Dimming layer behind modals & sheets. */
  scrim: string;
  /** Keyboard focus ring. */
  focus: string;
  /** Inverted surface (toasts, tooltips). */
  inverse: string;
  /** Raised thumb of segmented controls. */
  thumb: string;
}

const light: SemanticColors = {
  background: {
    primary: '#FFFFFF',
    secondary: '#F2F2F7',
    tertiary: '#FFFFFF',
    grouped: '#F2F2F7',
    groupedSecondary: '#FFFFFF',
    groupedTertiary: '#F2F2F7',
    elevated: '#FFFFFF',
  },
  label: {
    primary: '#000000',
    secondary: 'rgba(60, 60, 67, 0.6)',
    tertiary: 'rgba(60, 60, 67, 0.3)',
    quaternary: 'rgba(60, 60, 67, 0.18)',
    inverse: '#FFFFFF',
  },
  fill: {
    primary: 'rgba(120, 120, 128, 0.2)',
    secondary: 'rgba(120, 120, 128, 0.16)',
    tertiary: 'rgba(118, 118, 128, 0.12)',
    quaternary: 'rgba(116, 116, 128, 0.08)',
  },
  separator: {
    default: 'rgba(60, 60, 67, 0.29)',
    opaque: '#C6C6C8',
  },
  material: {
    thin: 'rgba(255, 255, 255, 0.6)',
    regular: 'rgba(249, 249, 249, 0.78)',
    thick: 'rgba(255, 255, 255, 0.92)',
  },
  accent: {
    default: palette.light.blue,
    pressed: '#0062CC',
    subtle: 'rgba(0, 122, 255, 0.12)',
    on: '#FFFFFF',
  },
  success: {
    default: palette.light.green,
    pressed: '#248A3D',
    subtle: 'rgba(52, 199, 89, 0.14)',
    on: '#FFFFFF',
  },
  warning: {
    default: palette.light.orange,
    pressed: '#C93400',
    subtle: 'rgba(255, 149, 0, 0.14)',
    on: '#FFFFFF',
  },
  danger: {
    default: palette.light.red,
    pressed: '#D70015',
    subtle: 'rgba(255, 59, 48, 0.12)',
    on: '#FFFFFF',
  },
  info: {
    default: palette.light.indigo,
    pressed: '#3634A3',
    subtle: 'rgba(88, 86, 214, 0.12)',
    on: '#FFFFFF',
  },
  scrim: 'rgba(0, 0, 0, 0.32)',
  focus: 'rgba(0, 122, 255, 0.45)',
  inverse: '#1C1C1E',
  thumb: '#FFFFFF',
};

const dark: SemanticColors = {
  background: {
    primary: '#000000',
    secondary: '#1C1C1E',
    tertiary: '#2C2C2E',
    grouped: '#000000',
    groupedSecondary: '#1C1C1E',
    groupedTertiary: '#2C2C2E',
    elevated: '#1C1C1E',
  },
  label: {
    primary: '#FFFFFF',
    secondary: 'rgba(235, 235, 245, 0.6)',
    tertiary: 'rgba(235, 235, 245, 0.3)',
    quaternary: 'rgba(235, 235, 245, 0.16)',
    inverse: '#000000',
  },
  fill: {
    primary: 'rgba(120, 120, 128, 0.36)',
    secondary: 'rgba(120, 120, 128, 0.32)',
    tertiary: 'rgba(118, 118, 128, 0.24)',
    quaternary: 'rgba(118, 118, 128, 0.18)',
  },
  separator: {
    default: 'rgba(84, 84, 88, 0.6)',
    opaque: '#38383A',
  },
  material: {
    thin: 'rgba(37, 37, 37, 0.6)',
    regular: 'rgba(29, 29, 29, 0.78)',
    thick: 'rgba(22, 22, 22, 0.92)',
  },
  accent: {
    default: palette.dark.blue,
    pressed: '#409CFF',
    subtle: 'rgba(10, 132, 255, 0.2)',
    on: '#FFFFFF',
  },
  success: {
    default: palette.dark.green,
    pressed: '#30DB5B',
    subtle: 'rgba(48, 209, 88, 0.2)',
    on: '#000000',
  },
  warning: {
    default: palette.dark.orange,
    pressed: '#FFB340',
    subtle: 'rgba(255, 159, 10, 0.2)',
    on: '#000000',
  },
  danger: {
    default: palette.dark.red,
    pressed: '#FF6961',
    subtle: 'rgba(255, 69, 58, 0.2)',
    on: '#FFFFFF',
  },
  info: {
    default: palette.dark.indigo,
    pressed: '#7D7AFF',
    subtle: 'rgba(94, 92, 230, 0.24)',
    on: '#FFFFFF',
  },
  scrim: 'rgba(0, 0, 0, 0.56)',
  focus: 'rgba(10, 132, 255, 0.6)',
  inverse: '#F2F2F7',
  thumb: '#636366',
};

export const semantic: Record<ColorScheme, SemanticColors> = { light, dark };

export const colors = { palette, semantic } as const;
