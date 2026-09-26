import { forwardRef, type ElementType, type HTMLAttributes } from 'react';
import { cx, flag } from '../utils.js';

export interface CardProps extends HTMLAttributes<HTMLElement> {
  /**
   * `elevated` – floating surface with a soft shadow (default)
   * `filled`   – quiet tinted surface, no shadow
   * `grouped`  – white/charcoal card for grouped (gray) canvases
   * `outlined` – hairline border only
   */
  variant?: 'elevated' | 'filled' | 'grouped' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Adds hover lift & press feedback. Automatically true for `href` / `onClick`. */
  interactive?: boolean;
  href?: string;
  as?: ElementType;
}

export const Card = forwardRef<HTMLElement, CardProps>(function Card(
  { variant = 'elevated', padding = 'md', interactive, href, as, className, onClick, ...rest },
  ref,
) {
  const isInteractive = interactive ?? Boolean(href || onClick);
  const Tag: ElementType = as ?? (href ? 'a' : onClick ? 'button' : 'div');
  return (
    <Tag
      ref={ref}
      href={href}
      type={Tag === 'button' ? 'button' : undefined}
      onClick={onClick}
      className={cx('lm-card', className)}
      data-variant={variant === 'elevated' ? undefined : variant}
      data-padding={padding === 'md' ? undefined : padding}
      data-interactive={flag(isInteractive)}
      {...rest}
    />
  );
});
