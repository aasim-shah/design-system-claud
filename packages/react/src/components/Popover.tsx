'use client';

import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
  type Ref,
  type RefObject,
} from 'react';
import { createPortal } from 'react-dom';
import { cx, flag } from '../utils.js';
import { useControllable } from './useControllable.js';

export interface PopoverTriggerProps {
  ref: Ref<HTMLElement>;
  onClick: () => void;
  'aria-expanded': boolean;
  'aria-haspopup': 'menu' | 'dialog';
  'aria-controls': string;
}

export interface PopoverProps {
  /** Render prop for the trigger — spread the props onto your button. */
  trigger: (props: PopoverTriggerProps) => ReactNode;
  children: ReactNode | ((close: () => void) => ReactNode);
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Horizontal alignment to the trigger. @default 'start' */
  align?: 'start' | 'end';
  /** Adds comfortable inner padding (for non-menu content). */
  padded?: boolean;
  role?: 'menu' | 'dialog';
  className?: string;
  style?: CSSProperties;
}

const GAP = 6;
const MARGIN = 12;

/** Floating panel anchored to a trigger. Closes on outside click and Esc; flips above when needed. */
export function Popover({
  trigger,
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  align = 'start',
  padded,
  role = 'dialog',
  className,
  style,
}: PopoverProps) {
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const triggerRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number; origin: string } | null>(null);
  const id = useId();

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, [setOpen]);

  const place = useCallback(() => {
    const t = triggerRef.current?.getBoundingClientRect();
    const p = panelRef.current;
    if (!t || !p) return;
    const w = p.offsetWidth;
    const h = p.offsetHeight;
    let left = align === 'end' ? t.right - w : t.left;
    left = Math.min(Math.max(MARGIN, left), window.innerWidth - w - MARGIN);
    const below = t.bottom + GAP + h <= window.innerHeight - MARGIN || t.top - GAP - h < MARGIN;
    const top = below ? t.bottom + GAP : t.top - GAP - h;
    setPos({ top, left, origin: `${below ? 'top' : 'bottom'} ${align === 'end' ? 'right' : 'left'}` });
  }, [align]);

  useLayoutEffect(() => {
    if (!isOpen) {
      setPos(null);
      return;
    }
    place();
  }, [isOpen, place]);

  useEffect(() => {
    if (!isOpen) return;
    const onDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (!panelRef.current?.contains(target) && !triggerRef.current?.contains(target)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      }
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [isOpen, close, place, setOpen]);

  return (
    <>
      {trigger({
        ref: (el: HTMLElement | null) => {
          triggerRef.current = el;
        },
        onClick: () => setOpen(!isOpen),
        'aria-expanded': isOpen,
        'aria-haspopup': role,
        'aria-controls': id,
      })}
      {isOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={panelRef}
            id={id}
            role={role === 'dialog' ? 'dialog' : undefined}
            className={cx('lm-popover', className)}
            data-padded={flag(padded)}
            style={{
              ...style,
              top: pos?.top ?? -9999,
              left: pos?.left ?? -9999,
              visibility: pos ? undefined : 'hidden',
              ['--lm-popover-origin' as string]: pos?.origin,
            }}
          >
            {typeof children === 'function' ? children(close) : children}
          </div>,
          document.body,
        )}
    </>
  );
}

/* ------------------------------------------------------------------- Menu */

export type MenuEntry =
  | {
      type?: 'item';
      label: ReactNode;
      icon?: ReactNode;
      shortcut?: string;
      destructive?: boolean;
      disabled?: boolean;
      onSelect?: () => void;
    }
  | { type: 'separator' }
  | { type: 'heading'; label: ReactNode };

export interface MenuProps extends Omit<PopoverProps, 'children' | 'role' | 'padded'> {
  items: MenuEntry[];
}

/** Dropdown action menu with keyboard navigation (↑ ↓ Home End, Enter, Esc). */
export function Menu({ items, ...popover }: MenuProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const enabled = () => Array.from(listRef.current?.querySelectorAll<HTMLButtonElement>('.lm-menu__item:not(:disabled)') ?? []);

  return (
    <Popover {...popover} role="menu">
      {(close) => (
        <MenuList listRef={listRef} enabled={enabled}>
          {items.map((entry, i) => {
            if (entry.type === 'separator') return <div key={i} role="separator" className="lm-menu__separator" />;
            if (entry.type === 'heading')
              return (
                <div key={i} role="presentation" className="lm-menu__heading">
                  {entry.label}
                </div>
              );
            return (
              <button
                key={i}
                type="button"
                role="menuitem"
                tabIndex={-1}
                disabled={entry.disabled}
                className="lm-menu__item"
                data-destructive={flag(entry.destructive)}
                onClick={() => {
                  entry.onSelect?.();
                  close();
                }}
              >
                {entry.icon}
                <span className="lm-menu__label">{entry.label}</span>
                {entry.shortcut && <span className="lm-menu__shortcut">{entry.shortcut}</span>}
              </button>
            );
          })}
        </MenuList>
      )}
    </Popover>
  );
}

function MenuList({
  listRef,
  enabled,
  children,
}: {
  listRef: RefObject<HTMLDivElement | null>;
  enabled: () => HTMLButtonElement[];
  children: ReactNode;
}) {
  useEffect(() => {
    enabled()[0]?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div
      ref={listRef}
      role="menu"
      className="lm-menu"
      onKeyDown={(e) => {
        const list = enabled();
        const i = list.indexOf(document.activeElement as HTMLButtonElement);
        const go = (n: number) => {
          e.preventDefault();
          list[(n + list.length) % list.length]?.focus();
        };
        if (e.key === 'ArrowDown') go(i + 1);
        if (e.key === 'ArrowUp') go(i - 1);
        if (e.key === 'Home') go(0);
        if (e.key === 'End') go(list.length - 1);
        if (e.key === 'Tab') e.preventDefault();
      }}
    >
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------- Tooltip */

export interface TooltipProps {
  content: ReactNode;
  side?: 'top' | 'bottom';
  /** A single focusable element (button, link…). */
  children: ReactElement;
}

/** Short, non-essential hint on hover and keyboard focus. */
export function Tooltip({ content, side = 'top', children }: TooltipProps) {
  const id = useId();
  const child = isValidElement(children)
    ? cloneElement(children as ReactElement<{ 'aria-describedby'?: string }>, { 'aria-describedby': id })
    : children;
  return (
    <span className="lm-tooltip" data-side={side === 'bottom' ? 'bottom' : undefined}>
      {child}
      <span role="tooltip" id={id} className="lm-tooltip__bubble">
        {content}
      </span>
    </span>
  );
}
