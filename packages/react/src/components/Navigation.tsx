'use client';

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { cx } from '../utils.js';
import { ChevronLeftIcon, ChevronRightIcon } from './Icon.js';
import { Badge } from './Badge.js';
import { useControllable } from './useControllable.js';

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/* ------------------------------------------------------------ Breadcrumbs */

export interface BreadcrumbItem {
  label: ReactNode;
  href?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  /** Collapse the middle into "…" when longer than this. */
  maxItems?: number;
}

export function Breadcrumbs({ items, maxItems = 4, className, ...rest }: BreadcrumbsProps) {
  const [expanded, setExpanded] = useState(false);
  const collapse = !expanded && items.length > maxItems;
  const visible: (BreadcrumbItem | 'ellipsis')[] = collapse
    ? [items[0], 'ellipsis', ...items.slice(items.length - (maxItems - 1))]
    : items;

  return (
    <nav aria-label="Breadcrumb" className={cx('lm-breadcrumbs', className)} {...rest}>
      <ol className="lm-breadcrumbs__list">
        {visible.map((item, i) => {
          const last = i === visible.length - 1;
          return (
            <li key={i} className="lm-breadcrumbs__item">
              {item === 'ellipsis' ? (
                <button type="button" className="lm-breadcrumbs__ellipsis" aria-label="Show full path" onClick={() => setExpanded(true)}>
                  …
                </button>
              ) : last ? (
                <span className="lm-breadcrumbs__current" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <a className="lm-breadcrumbs__link" href={item.href ?? '#'} onClick={item.onClick}>
                  {item.label}
                </a>
              )}
              {!last && <ChevronRightIcon className="lm-breadcrumbs__sep" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* ------------------------------------------------------------------- Tabs */

export interface TabItem {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
  content?: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Accessible name for the tab list. */
  label?: string;
  className?: string;
}

/** Underline tabs with a sliding indicator and full arrow-key support. */
export function Tabs({ items, value, defaultValue, onValueChange, label, className }: TabsProps) {
  const [current, setCurrent] = useControllable(value, defaultValue ?? items[0]?.value ?? '', onValueChange);
  const id = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [bar, setBar] = useState({ x: 0, w: 0 });
  const index = Math.max(0, items.findIndex((t) => t.value === current));

  useIsoLayoutEffect(() => {
    const el = tabRefs.current[index];
    if (el) setBar({ x: el.offsetLeft, w: el.offsetWidth });
  }, [index, items.length]);

  useEffect(() => {
    const onResize = () => {
      const el = tabRefs.current[index];
      if (el) setBar({ x: el.offsetLeft, w: el.offsetWidth });
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [index]);

  /** Select + focus the next enabled tab from `start`, stepping by `dir`. */
  const focusFrom = (start: number, dir: 1 | -1) => {
    const n = items.length;
    for (let k = 0; k < n; k++) {
      const j = (((start + k * dir) % n) + n) % n;
      if (!items[j].disabled) {
        setCurrent(items[j].value);
        tabRefs.current[j]?.focus();
        return;
      }
    }
  };

  const active = items[index];

  return (
    <div className={cx('lm-tabs', className)}>
      <div
        ref={listRef}
        role="tablist"
        aria-label={label}
        className="lm-tabs__list"
        onKeyDown={(e) => {
          const keys: Record<string, [number, 1 | -1]> = {
            ArrowRight: [index + 1, 1],
            ArrowLeft: [index - 1, -1],
            Home: [0, 1],
            End: [items.length - 1, -1],
          };
          const move = keys[e.key];
          if (move) {
            e.preventDefault();
            focusFrom(...move);
          }
        }}
      >
        {items.map((t, i) => (
          <button
            key={t.value}
            ref={(el) => { tabRefs.current[i] = el; }}
            type="button"
            role="tab"
            id={`${id}-tab-${t.value}`}
            aria-selected={i === index}
            aria-controls={`${id}-panel`}
            tabIndex={i === index ? 0 : -1}
            disabled={t.disabled}
            className="lm-tabs__tab"
            onClick={() => setCurrent(t.value)}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
        <span className="lm-tabs__indicator" aria-hidden style={{ width: bar.w, transform: `translateX(${bar.x}px)` }} />
      </div>
      {items.some((t) => t.content !== undefined) && (
        <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${active?.value}`} tabIndex={0} className="lm-tabs__panel">
          {active?.content}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------- Pagination */

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  /** Pages shown on each side of the current one. @default 1 */
  siblings?: number;
}

export function pageRange(page: number, count: number, siblings = 1): (number | 'gap')[] {
  const total = siblings * 2 + 5;
  if (count <= total) return Array.from({ length: count }, (_, i) => i + 1);
  const start = Math.max(2, page - siblings);
  const end = Math.min(count - 1, page + siblings);
  const out: (number | 'gap')[] = [1];
  // A gap that would hide a single page shows that page instead.
  if (start === 3) out.push(2);
  else if (start > 3) out.push('gap');
  for (let i = start; i <= end; i++) out.push(i);
  if (end === count - 2) out.push(count - 1);
  else if (end < count - 2) out.push('gap');
  out.push(count);
  return out;
}

export function Pagination({ page, pageCount, onPageChange, siblings = 1, className, ...rest }: PaginationProps) {
  return (
    <nav aria-label="Pagination" className={cx('lm-pagination', className)} {...rest}>
      <button type="button" className="lm-pagination__page" aria-label="Previous page" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        <ChevronLeftIcon />
      </button>
      {pageRange(page, pageCount, siblings).map((p, i) =>
        p === 'gap' ? (
          <span key={`g${i}`} className="lm-pagination__gap" aria-hidden>
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            className="lm-pagination__page"
            aria-current={p === page ? 'page' : undefined}
            aria-label={`Page ${p}`}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ),
      )}
      <button type="button" className="lm-pagination__page" aria-label="Next page" disabled={page >= pageCount} onClick={() => onPageChange(page + 1)}>
        <ChevronRightIcon />
      </button>
    </nav>
  );
}

/* ---------------------------------------------------------------- TabBar */

export interface TabBarItem {
  value: string;
  label: string;
  icon: ReactNode;
  href?: string;
  badge?: number;
}

export interface TabBarProps {
  items: TabBarItem[];
  value: string;
  onValueChange?: (value: string) => void;
  /** Pin to the bottom of the viewport. */
  fixed?: boolean;
  className?: string;
}

/** Bottom navigation for mobile web / PWAs (3–5 destinations). */
export function TabBar({ items, value, onValueChange, fixed, className }: TabBarProps) {
  return (
    <nav aria-label="Main" className={cx('lm-tabbar', className)} data-fixed={fixed ? '' : undefined}>
      {items.map((t) => {
        const props = {
          className: 'lm-tabbar__item',
          'aria-current': t.value === value ? ('page' as const) : undefined,
          onClick: () => onValueChange?.(t.value),
        };
        const inner = (
          <>
            {t.icon}
            <span>{t.label}</span>
            {!!t.badge && <Badge className="lm-tabbar__badge" variant="solid" tone="danger" size="sm" count={t.badge} />}
          </>
        );
        return t.href ? (
          <a key={t.value} href={t.href} {...props}>
            {inner}
          </a>
        ) : (
          <button key={t.value} type="button" {...props}>
            {inner}
          </button>
        );
      })}
    </nav>
  );
}

/* --------------------------------------------------------------- Sidebar */

export interface SidebarItem {
  value: string;
  label: string;
  icon?: ReactNode;
  href?: string;
  count?: number;
}

export interface SidebarSection {
  heading?: string;
  items: SidebarItem[];
}

export interface SidebarProps {
  sections: SidebarSection[];
  value: string;
  onValueChange?: (value: string) => void;
  className?: string;
  label?: string;
}

/** Vertical app navigation for desktop layouts. */
export function Sidebar({ sections, value, onValueChange, className, label = 'Sidebar' }: SidebarProps) {
  return (
    <nav aria-label={label} className={cx('lm-sidebar', className)}>
      {sections.map((s, i) => (
        <div key={i} className="lm-sidebar__section">
          {s.heading && <div className="lm-sidebar__heading">{s.heading}</div>}
          {s.items.map((item) => {
            const common = {
              className: 'lm-sidebar__item',
              'aria-current': item.value === value ? ('page' as const) : undefined,
              onClick: () => onValueChange?.(item.value),
            };
            const inner = (
              <>
                {item.icon}
                <span className="lm-sidebar__label">{item.label}</span>
                {item.count !== undefined && <span className="lm-sidebar__count">{item.count}</span>}
              </>
            );
            return item.href ? (
              <a key={item.value} href={item.href} {...(common as AnchorHTMLAttributes<HTMLAnchorElement>)}>
                {inner}
              </a>
            ) : (
              <button key={item.value} type="button" {...common}>
                {inner}
              </button>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
