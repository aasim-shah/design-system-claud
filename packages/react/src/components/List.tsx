import {
  Children,
  forwardRef,
  isValidElement,
  type AnchorHTMLAttributes,
  type CSSProperties,
  type HTMLAttributes,
  type MouseEventHandler,
  type ReactNode,
} from 'react';
import { cx, flag } from '../utils.js';
import { CheckIcon, ChevronRightIcon } from './Icon.js';

export interface ListSectionProps extends HTMLAttributes<HTMLElement> {
  /** Small uppercase caption above the group. */
  header?: ReactNode;
  /** Explanatory footnote below the group. */
  footer?: ReactNode;
}

/** A titled group of rows — the building block of settings-style screens. */
export function ListSection({ header, footer, className, children, ...rest }: ListSectionProps) {
  return (
    <section className={cx('lm-list-section', className)} {...rest}>
      {header && <h3 className="lm-list-section__header">{header}</h3>}
      {children}
      {footer && <p className="lm-list-section__footer">{footer}</p>}
    </section>
  );
}

export interface ListProps extends HTMLAttributes<HTMLUListElement> {
  /** `inset` rounded group (default), `filled` on plain canvases, or edge-to-edge `plain`. */
  variant?: 'inset' | 'filled' | 'plain';
}

export const List = forwardRef<HTMLUListElement, ListProps>(function List(
  { variant = 'inset', className, children, ...rest },
  ref,
) {
  return (
    <ul ref={ref} className={cx('lm-list', className)} data-variant={variant === 'inset' ? undefined : variant} {...rest}>
      {Children.map(children, (child) => (isValidElement(child) ? <li>{child}</li> : child))}
    </ul>
  );
});

export interface ListItemProps {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Leading visual: an `<ListIcon>`, `<Avatar>` or any node. */
  leading?: ReactNode;
  /** Secondary value on the right (e.g. "Wi-Fi name"). */
  detail?: ReactNode;
  /** Custom trailing content (Switch, Badge…). */
  trailing?: ReactNode;
  /** Show a disclosure chevron. Defaults to true when `href`/`onClick` is set. */
  chevron?: boolean;
  /** Show a selection checkmark. */
  selected?: boolean;
  destructive?: boolean;
  disabled?: boolean;
  href?: string;
  target?: AnchorHTMLAttributes<HTMLAnchorElement>['target'];
  rel?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  className?: string;
}

export const ListItem = forwardRef<HTMLElement, ListItemProps>(function ListItem(
  { title, subtitle, leading, detail, trailing, chevron, selected, destructive, disabled, href, target, rel, onClick, className },
  ref,
) {
  const interactive = Boolean(href || onClick);
  const showChevron = chevron ?? (interactive && selected === undefined && !destructive);
  const Tag = href ? 'a' : onClick ? 'button' : 'div';

  return (
    <Tag
      ref={ref as never}
      href={href}
      target={target}
      rel={rel}
      type={Tag === 'button' ? 'button' : undefined}
      onClick={disabled ? undefined : onClick}
      aria-disabled={disabled || undefined}
      aria-current={selected ? 'true' : undefined}
      className={cx('lm-list-item', className)}
      data-interactive={flag(interactive)}
      data-destructive={flag(destructive)}
      data-has-leading={flag(leading)}
    >
      {leading && <span className="lm-list-item__leading">{leading}</span>}
      <span className="lm-list-item__content">
        <span className="lm-list-item__title">{title}</span>
        {subtitle && <span className="lm-list-item__subtitle">{subtitle}</span>}
      </span>
      {detail !== undefined && <span className="lm-list-item__detail">{detail}</span>}
      {(trailing || showChevron || selected) && (
        <span className="lm-list-item__trailing">
          {trailing}
          {selected && <CheckIcon className="lm-list-item__check" label="Selected" />}
          {showChevron && <ChevronRightIcon className="lm-list-item__chevron" />}
        </span>
      )}
    </Tag>
  );
});

export interface ListIconProps {
  children: ReactNode;
  /** Optional tile color (glyph turns white). Neutral gray by default. */
  color?: string;
}

/** The small rounded, colored icon tile used at the start of list rows. */
export function ListIcon({ children, color }: ListIconProps) {
  return (
    <span className="lm-list-item__icon" style={color ? ({ '--lm-list-icon-bg': color, '--lm-list-icon-fg': '#fff' } as CSSProperties) : undefined}>
      {children}
    </span>
  );
}
