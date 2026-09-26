import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';
import { cx, flag, vars } from '../utils.js';

export interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  orientation?: 'horizontal' | 'vertical';
}

/** Hairline separator. */
export const Divider = forwardRef<HTMLHRElement, DividerProps>(function Divider(
  { orientation = 'horizontal', className, ...rest },
  ref,
) {
  return (
    <hr
      ref={ref}
      aria-orientation={orientation}
      className={cx('lm-divider', className)}
      data-orientation={orientation === 'vertical' ? 'vertical' : undefined}
      {...rest}
    />
  );
});

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  /** 0–100. Omit for an indeterminate bar. */
  value?: number;
  size?: 'md' | 'lg';
  color?: string;
  label?: string;
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  { value, size = 'md', color, label, className, style, ...rest },
  ref,
) {
  const indeterminate = value === undefined;
  const clamped = indeterminate ? 0 : Math.min(100, Math.max(0, value));
  return (
    <div
      ref={ref}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={indeterminate ? undefined : Math.round(clamped)}
      className={cx('lm-progress', className)}
      data-size={size === 'md' ? undefined : size}
      data-indeterminate={flag(indeterminate)}
      style={vars(style, { '--lm-progress-value': `${clamped}%`, '--lm-progress-color': color })}
      {...rest}
    >
      <div className="lm-progress__bar" />
    </div>
  );
});

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  shape?: 'rect' | 'text' | 'circle';
  width?: CSSProperties['width'];
  height?: CSSProperties['height'];
}

/** Placeholder shimmer shown while content loads. */
export function Skeleton({ shape = 'rect', width, height, className, style, ...rest }: SkeletonProps) {
  return (
    <span
      aria-hidden
      className={cx('lm-skeleton', className)}
      data-shape={shape === 'rect' ? undefined : shape}
      style={{ width, height: height ?? (shape === 'circle' ? width : undefined), ...style }}
      {...rest}
    />
  );
}
