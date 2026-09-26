import type { CSSProperties } from 'react';
import { spacing, type SpacingKey } from '@lumen/tokens';

type ClassValue = string | false | null | undefined;

/** Tiny className joiner. */
export function cx(...values: ClassValue[]): string {
  return values.filter(Boolean).join(' ');
}

/** `true` → `''` so it renders as a bare data attribute; falsy → omitted. */
export const flag = (value: unknown): '' | undefined => (value ? '' : undefined);

/** Spacing key (4pt grid) or any CSS length → CSS value. */
export function space(value: SpacingKey | string | undefined): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value === 'number') return `${spacing[value] / 16}rem`;
  return value in spacing ? `${spacing[value as unknown as SpacingKey] / 16}rem` : value;
}

/** Merge a component's CSS custom properties into a style prop. */
export function vars(
  style: CSSProperties | undefined,
  custom: Record<string, string | number | undefined>,
): CSSProperties {
  const out: Record<string, unknown> = { ...style };
  for (const [k, v] of Object.entries(custom)) if (v !== undefined) out[k] = v;
  return out as CSSProperties;
}
