import { forwardRef, type HTMLAttributes } from 'react';
import { cx, vars } from '../utils.js';

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: 'sm' | 'md' | 'lg';
  /** Any CSS color. Defaults to the secondary label color. */
  color?: string;
  /** Accessible label. @default 'Loading' */
  label?: string;
}

/** Eight-spoke activity indicator. */
export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size = 'md', color, label = 'Loading', className, style, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      role="progressbar"
      aria-label={label}
      aria-busy="true"
      className={cx('lm-spinner', className)}
      data-size={size === 'md' ? undefined : size}
      style={vars(style, { '--lm-spinner-color': color })}
      {...rest}
    >
      {Array.from({ length: 8 }, (_, i) => (
        <span key={i} />
      ))}
    </span>
  );
});
