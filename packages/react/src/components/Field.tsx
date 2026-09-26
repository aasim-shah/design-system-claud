import { type ReactNode } from 'react';
import { cx, flag } from '../utils.js';

export interface FieldProps {
  id: string;
  label?: ReactNode;
  /** Helper text shown under the control. */
  description?: ReactNode;
  /** Error message. Also marks the control invalid. */
  error?: ReactNode;
  className?: string;
  children: ReactNode;
}

/** Label + control + message wrapper shared by every form control. */
export function Field({ id, label, description, error, className, children }: FieldProps) {
  const message = error ?? description;
  return (
    <div className={cx('lm-field', className)} data-invalid={flag(error)}>
      {label && (
        <label className="lm-field__label" htmlFor={id}>
          {label}
        </label>
      )}
      {children}
      {message && (
        <p className="lm-field__message" id={`${id}-message`} role={error ? 'alert' : undefined}>
          {message}
        </p>
      )}
    </div>
  );
}

/** Props shared by TextField, TextArea, Select. */
export interface FieldChromeProps {
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  /** Class for the outer field wrapper (the control gets `className`). */
  wrapperClassName?: string;
}
