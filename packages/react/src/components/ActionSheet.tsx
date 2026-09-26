'use client';

import { type ReactNode } from 'react';
import { cx, flag } from '../utils.js';
import { useDialog } from './Modal.js';

export interface ActionSheetAction {
  label: ReactNode;
  onSelect?: () => void;
  destructive?: boolean;
  disabled?: boolean;
}

export interface ActionSheetProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  message?: ReactNode;
  actions: ActionSheetAction[];
  /** @default 'Cancel' */
  cancelLabel?: ReactNode;
  className?: string;
}

/** A set of choices related to the current context. Bottom-anchored on phones, centered on desktop. */
export function ActionSheet({ open, onClose, title, message, actions, cancelLabel = 'Cancel', className }: ActionSheetProps) {
  const dialog = useDialog(open, onClose, true);
  return (
    <dialog {...dialog} className={cx('lm-modal', className)} data-action-sheet="">
      {(open || dialog['data-closing'] !== undefined) && (
        <>
          <div className="lm-action-sheet__group">
            {(title || message) && (
              <div className="lm-action-sheet__header">
                {title && <div className="lm-action-sheet__title">{title}</div>}
                {message && <div className="lm-action-sheet__message">{message}</div>}
              </div>
            )}
            {actions.map((a, i) => (
              <button
                key={i}
                type="button"
                className="lm-action-sheet__action"
                data-destructive={flag(a.destructive)}
                disabled={a.disabled}
                onClick={() => {
                  a.onSelect?.();
                  onClose();
                }}
              >
                {a.label}
              </button>
            ))}
          </div>
          <div className="lm-action-sheet__group">
            <button type="button" className="lm-action-sheet__action" data-cancel="" onClick={onClose} autoFocus>
              {cancelLabel}
            </button>
          </div>
        </>
      )}
    </dialog>
  );
}
