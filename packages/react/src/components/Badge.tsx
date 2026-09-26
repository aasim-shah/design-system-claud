import { forwardRef, type HTMLAttributes } from 'react';
import { cx, flag } from '../utils.js';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  variant?: 'subtle' | 'solid';
  size?: 'sm' | 'md';
  /** Leading status dot. */
  dot?: boolean;
  /** Numeric count bubble (renders "99+" above `max`). */
  count?: number;
  max?: number;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { tone = 'accent', variant = 'subtle', size = 'md', dot, count, max = 99, className, children, ...rest },
  ref,
) {
  const isCount = typeof count === 'number';
  return (
    <span
      ref={ref}
      className={cx('lm-badge', className)}
      data-tone={tone === 'accent' ? undefined : tone}
      data-variant={variant === 'subtle' ? undefined : variant}
      data-size={size === 'md' ? undefined : size}
      data-count={flag(isCount)}
      {...rest}
    >
      {dot && <span className="lm-badge__dot" aria-hidden />}
      {isCount ? (count > max ? `${max}+` : count) : children}
    </span>
  );
});
