'use client';

import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
  type SyntheticEvent,
} from 'react';
import { cx, flag } from '../utils.js';
import { IconButton } from './Button.js';
import { CloseIcon } from './Icon.js';

interface ModalBaseProps extends Omit<HTMLAttributes<HTMLDialogElement>, 'title'> {
  open: boolean;
  /** Called on Esc, backdrop click, or the close button. */
  onClose: () => void;
  /** Close when the backdrop is clicked. @default true */
  dismissible?: boolean;
}

/**
 * Built on the native `<dialog>` element: top-layer rendering, focus trapping,
 * Esc handling and inert background come for free from the browser.
 * Exit animations are played before the dialog actually closes.
 */
export function useDialog(open: boolean, onClose: () => void, dismissible: boolean) {
  const ref = useRef<HTMLDialogElement>(null);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open) {
      setClosing(false);
      if (!el.open) el.showModal();
      return;
    }
    if (!el.open) return;
    const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      el.close();
      return;
    }
    setClosing(true);
    const done = () => {
      el.close();
      setClosing(false);
    };
    const timer = window.setTimeout(done, 400);
    el.addEventListener('animationend', done, { once: true });
    return () => {
      window.clearTimeout(timer);
      el.removeEventListener('animationend', done);
    };
  }, [open]);

  // Lock page scroll while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [open]);

  const props = {
    ref,
    'data-closing': flag(closing),
    onCancel: (e: SyntheticEvent) => {
      e.preventDefault();
      onClose();
    },
    onMouseDown: (e: MouseEvent<HTMLDialogElement>) => {
      // Clicks on the ::backdrop target the dialog element itself.
      if (dismissible && e.target === e.currentTarget) {
        const r = e.currentTarget.getBoundingClientRect();
        const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
        if (!inside) onClose();
      }
    },
  };
  return props;
}

export interface DialogProps extends ModalBaseProps {
  title?: ReactNode;
  description?: ReactNode;
  /** Buttons, right-aligned (or equal-width when `align="center"`). */
  actions?: ReactNode;
  /** `center` gives the compact, alert-style layout. */
  align?: 'start' | 'center';
  children?: ReactNode;
}

/** Focused decision or short task. For longer flows, prefer `Sheet`. */
export function Dialog({
  open,
  onClose,
  dismissible = true,
  title,
  description,
  actions,
  align = 'start',
  className,
  style,
  children,
  ...rest
}: DialogProps) {
  const dialog = useDialog(open, onClose, dismissible);
  const id = useId();
  return (
    <dialog
      {...dialog}
      className={cx('lm-modal', className)}
      data-align={align === 'center' ? 'center' : undefined}
      aria-labelledby={title ? `${id}-title` : undefined}
      aria-describedby={description ? `${id}-desc` : undefined}
      style={align === 'center' ? ({ '--lm-modal-width': '320px', ...style } as CSSProperties) : style}
      {...rest}
    >
      {(open || dialog['data-closing'] !== undefined) && (
        <>
          <div className="lm-modal__body">
            {title && (
              <h2 className="lm-modal__title" id={`${id}-title`}>
                {title}
              </h2>
            )}
            {description && (
              <p className="lm-modal__description" id={`${id}-desc`}>
                {description}
              </p>
            )}
            {children}
          </div>
          {actions && <div className="lm-modal__actions">{actions}</div>}
        </>
      )}
    </dialog>
  );
}

export interface SheetProps extends ModalBaseProps {
  title?: ReactNode;
  /** Element placed at the leading edge of the header (e.g. "Cancel"). */
  headerLeading?: ReactNode;
  /** Element placed at the trailing edge (defaults to a close button). */
  headerTrailing?: ReactNode;
  children?: ReactNode;
}

/** Slides up from the bottom on phones; a centered card on larger screens. */
export function Sheet({
  open,
  onClose,
  dismissible = true,
  title,
  headerLeading,
  headerTrailing,
  className,
  children,
  ...rest
}: SheetProps) {
  const dialog = useDialog(open, onClose, dismissible);
  const id = useId();
  return (
    <dialog
      {...dialog}
      className={cx('lm-modal', className)}
      data-sheet=""
      aria-labelledby={title ? `${id}-title` : undefined}
      {...rest}
    >
      {(open || dialog['data-closing'] !== undefined) && (
        <>
          <span className="lm-modal__grabber" aria-hidden />
          <div className="lm-modal__header">
            <div>{headerLeading}</div>
            {title ? (
              <h2 className="lm-modal__title" id={`${id}-title`}>
                {title}
              </h2>
            ) : (
              <span />
            )}
            {headerTrailing ?? (
              <IconButton label="Close" size="sm" icon={<CloseIcon strokeWidth={2} />} onClick={onClose} />
            )}
          </div>
          <div className="lm-modal__content">{children}</div>
        </>
      )}
    </dialog>
  );
}
