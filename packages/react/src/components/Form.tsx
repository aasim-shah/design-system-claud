import { forwardRef, type CSSProperties, type FormHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils.js';

export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {}

/** Vertical form layout with consistent rhythm. Handles `noValidate` so Lumen fields show the errors. */
export const Form = forwardRef<HTMLFormElement, FormProps>(function Form({ className, noValidate = true, ...rest }, ref) {
  return <form ref={ref} noValidate={noValidate} className={cx('lm-form', className)} {...rest} />;
});

export interface FormSectionProps extends Omit<HTMLAttributes<HTMLFieldSetElement>, 'title'> {
  title?: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

/** A titled group of fields, separated from the next group by a hairline. */
export function FormSection({ title, description, className, children, ...rest }: FormSectionProps) {
  return (
    <fieldset className={cx('lm-form-section', className)} {...rest}>
      {(title || description) && (
        <legend className="lm-form-section__head">
          {title && <span className="lm-form-section__title">{title}</span>}
          {description && <span className="lm-form-section__description">{description}</span>}
        </legend>
      )}
      {children}
    </fieldset>
  );
}

export interface FormRowProps extends HTMLAttributes<HTMLDivElement> {
  /** Columns on wide screens; always stacks on phones. @default 2 */
  columns?: number;
}

export function FormRow({ columns = 2, className, style, ...rest }: FormRowProps) {
  return <div className={cx('lm-form-row', className)} style={{ ['--lm-form-cols' as string]: columns, ...style } as CSSProperties} {...rest} />;
}

/** Right-aligned submit / cancel row (stacks primary-first on phones). */
export function FormActions({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('lm-form-actions', className)} {...rest} />;
}
