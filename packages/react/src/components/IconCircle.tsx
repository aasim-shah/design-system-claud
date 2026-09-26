import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils.js';

export interface IconCircleProps extends HTMLAttributes<HTMLSpanElement> {
  /** An icon element, e.g. <WifiIcon />. */
  icon: ReactNode;
  /** 24 · 32 · 40 · 56. @default 'md' (32) */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /**
   * soft    – quiet gray disc, primary glyph (default)
   * solid   – accent disc, on-accent glyph
   * outline – hairline ring
   * tinted  – your `color` at 14% with the glyph in `color`
   */
  variant?: 'soft' | 'solid' | 'outline' | 'tinted';
  /** Any CSS color, used by `solid` and `tinted`. */
  color?: string;
}

/**
 * The signature Lumen icon container: a perfect circle holding a rounded
 * glyph. Used by list rows, alerts, empty states, dropzones and menus.
 */
export const IconCircle = forwardRef<HTMLSpanElement, IconCircleProps>(function IconCircle(
  { icon, size = 'md', variant = 'soft', color, className, style, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      aria-hidden
      className={cx('lm-icon-circle', className)}
      data-size={size === 'md' ? undefined : size}
      data-variant={variant === 'soft' ? undefined : variant}
      style={color ? ({ '--lm-icon-circle-color': color, ...style } as CSSProperties) : style}
      {...rest}
    >
      {icon}
    </span>
  );
});
