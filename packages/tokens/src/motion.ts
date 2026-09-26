/**
 * Motion — quick, physical and quiet. Animate to explain, never to decorate.
 */

export const duration = {
  instant: 100,
  fast: 160,
  base: 240,
  slow: 360,
  slower: 500,
} as const;

/** Cubic-bezier control points, usable by CSS and by RN's `Easing.bezier`. */
export const easing = {
  /** Default for most UI transitions. */
  standard: [0.25, 0.1, 0.25, 1],
  /** Elements entering the screen. */
  decelerate: [0, 0, 0.2, 1],
  /** Elements leaving the screen. */
  accelerate: [0.4, 0, 1, 1],
  /** Big, expressive moves (sheets, page transitions). */
  emphasized: [0.32, 0.72, 0, 1],
} as const satisfies Record<string, readonly [number, number, number, number]>;

export type EasingKey = keyof typeof easing;

export const cssEasing = (key: EasingKey): string => `cubic-bezier(${easing[key].join(', ')})`;

/** Spring presets for React Native `Animated.spring` / Reanimated `withSpring`. */
export const spring = {
  /** Snappy feedback: buttons, toggles. */
  snappy: { damping: 20, stiffness: 400, mass: 1 },
  /** Default for layout & position changes. */
  smooth: { damping: 26, stiffness: 260, mass: 1 },
  /** Sheets and larger surfaces. */
  gentle: { damping: 30, stiffness: 180, mass: 1 },
} as const;

/** Scale applied to pressable surfaces while held. */
export const pressScale = 0.97;

export const motion = { duration, easing, cssEasing, spring, pressScale } as const;
