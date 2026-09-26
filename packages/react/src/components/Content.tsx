import { type HTMLAttributes, type Key, type ReactNode } from 'react';
import { cx } from '../utils.js';
import { AlertIcon, CheckCircleIcon, CheckIcon, CloseIcon, InfoIcon, XCircleIcon } from './Icon.js';

/* ------------------------------------------------------------------ Alert */

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  tone?: 'neutral' | 'success' | 'warning' | 'danger';
  title?: ReactNode;
  children?: ReactNode;
  /** Custom icon; `null` hides it. */
  icon?: ReactNode | null;
  /** Buttons under the text. */
  actions?: ReactNode;
  onDismiss?: () => void;
}

const alertIcons = {
  neutral: <InfoIcon />,
  success: <CheckCircleIcon />,
  warning: <AlertIcon />,
  danger: <XCircleIcon />,
};

/** Inline, persistent message inside the page flow. Only the icon carries color. */
export function Alert({ tone = 'neutral', title, children, icon, actions, onDismiss, className, ...rest }: AlertProps) {
  const shown = icon === undefined ? alertIcons[tone] : icon;
  return (
    <div role={tone === 'danger' || tone === 'warning' ? 'alert' : 'status'} className={cx('lm-alert', className)} data-tone={tone === 'neutral' ? undefined : tone} {...rest}>
      {shown && <span className="lm-alert__icon">{shown}</span>}
      <div className="lm-alert__body">
        {title && <div className="lm-alert__title">{title}</div>}
        {children && <div className="lm-alert__description">{children}</div>}
        {actions && <div className="lm-alert__actions">{actions}</div>}
      </div>
      {onDismiss && (
        <button type="button" className="lm-btn lm-alert__close" data-variant="plain" data-icon-only="" data-size="sm" data-tone="neutral" aria-label="Dismiss" onClick={onDismiss}>
          <CloseIcon strokeWidth={2} />
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------- EmptyState */

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}

/** What to show when there's nothing to show — and what to do about it. */
export function EmptyState({ icon, title, description, actions, className, ...rest }: EmptyStateProps) {
  return (
    <div className={cx('lm-empty', className)} {...rest}>
      {icon && <span className="lm-empty__icon">{icon}</span>}
      <div className="lm-empty__title">{title}</div>
      {description && <p className="lm-empty__description">{description}</p>}
      {actions && <div className="lm-empty__actions">{actions}</div>}
    </div>
  );
}

/* -------------------------------------------------------------------- Kbd */

export function Kbd({ className, ...rest }: HTMLAttributes<HTMLElement>) {
  return <kbd className={cx('lm-kbd', className)} {...rest} />;
}

/* ------------------------------------------------------------------ Table */

export interface TableColumn<Row> {
  key: string;
  header: ReactNode;
  align?: 'start' | 'center' | 'end';
  width?: number | string;
  render?: (row: Row) => ReactNode;
}

export interface TableProps<Row> {
  columns: TableColumn<Row>[];
  rows: Row[];
  rowKey: (row: Row) => Key;
  onRowClick?: (row: Row) => void;
  caption?: string;
  className?: string;
  /** Rendered when `rows` is empty. */
  empty?: ReactNode;
}

/** Clean data table: hairline rows, tabular numbers, horizontal scroll on small screens. */
export function Table<Row extends Record<string, unknown>>({ columns, rows, rowKey, onRowClick, caption, className, empty }: TableProps<Row>) {
  return (
    <div className={cx('lm-table-wrap', className)}>
      <table className="lm-table">
        {caption && <caption className="lm-visually-hidden">{caption}</caption>}
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} scope="col" data-align={c.align} style={{ width: c.width }}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && empty ? (
            <tr>
              <td colSpan={columns.length} style={{ height: 'auto' }}>
                {empty}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={rowKey(row)}
                data-interactive={onRowClick ? '' : undefined}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                tabIndex={onRowClick ? 0 : undefined}
                onKeyDown={onRowClick ? (e) => e.key === 'Enter' && onRowClick(row) : undefined}
              >
                {columns.map((c) => (
                  <td key={c.key} data-align={c.align}>
                    {c.render ? c.render(row) : (row[c.key] as ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ Steps */

export interface StepsProps extends HTMLAttributes<HTMLOListElement> {
  steps: { label: ReactNode; description?: ReactNode }[];
  /** Zero-based index of the current step. */
  current: number;
}

/** Progress through a multi-step flow (checkout, onboarding). */
export function Steps({ steps, current, className, ...rest }: StepsProps) {
  return (
    <ol className={cx('lm-steps', className)} {...rest}>
      {steps.map((s, i) => {
        const state = i < current ? 'complete' : i === current ? 'current' : 'upcoming';
        return (
          <li key={i} className="lm-steps__item" data-state={state} aria-current={state === 'current' ? 'step' : undefined}>
            <span className="lm-steps__marker">{state === 'complete' ? <CheckIcon /> : i + 1}</span>
            <span className="lm-steps__label">{s.label}</span>
            {s.description && <span className="lm-steps__description">{s.description}</span>}
          </li>
        );
      })}
    </ol>
  );
}
