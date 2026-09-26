import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx, flag, vars } from '../utils.js';

export interface NavigationBarProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title?: ReactNode;
  /** Big, bold title shown under the bar (iOS "large title" style). */
  largeTitle?: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  /** Remove the translucent material (e.g. over a hero image). */
  transparent?: boolean;
  /** Constrain the inner content width (e.g. 1080). */
  maxWidth?: number | string;
}

/** Sticky, translucent top bar with a backdrop blur. */
export const NavigationBar = forwardRef<HTMLElement, NavigationBarProps>(function NavigationBar(
  { title, largeTitle, leading, trailing, transparent, maxWidth, className, style, ...rest },
  ref,
) {
  return (
    <header
      ref={ref}
      className={cx('lm-navbar', className)}
      data-transparent={flag(transparent)}
      style={vars(style, { '--lm-navbar-max': typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth })}
      {...rest}
    >
      <div className="lm-navbar__bar">
        <div className="lm-navbar__leading">{leading}</div>
        <div className="lm-navbar__title">{title}</div>
        <div className="lm-navbar__trailing">{trailing}</div>
      </div>
      {largeTitle && <h1 className="lm-navbar__large">{largeTitle}</h1>}
    </header>
  );
});
