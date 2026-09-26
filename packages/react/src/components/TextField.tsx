'use client';

import {
  forwardRef,
  useCallback,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';
import { cx, flag } from '../utils.js';
import { Field, type FieldChromeProps } from './Field.js';
import { ChevronUpDownIcon, CloseIcon, SearchIcon } from './Icon.js';

export interface TextFieldProps extends FieldChromeProps, Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Content before the input (icon, prefix like "$"). */
  leading?: ReactNode;
  /** Content after the input (icon, unit, button). */
  trailing?: ReactNode;
  /** Show a clear (×) button when the field has a value. */
  clearable?: boolean;
  onClear?: () => void;
  /** `search` renders the compact, pill-ish search style. */
  appearance?: 'default' | 'search';
}

function describedBy(id: string, hasMessage: boolean, extra?: string) {
  return [hasMessage ? `${id}-message` : undefined, extra].filter(Boolean).join(' ') || undefined;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  {
    label,
    description,
    error,
    size = 'md',
    wrapperClassName,
    leading,
    trailing,
    clearable,
    onClear,
    className,
    id: idProp,
    disabled,
    value,
    defaultValue,
    onChange,
    appearance = 'default',
    'aria-describedby': ariaDescribedBy,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  const controlled = value !== undefined;
  const [inner, setInner] = useState(String(defaultValue ?? ''));
  const current = controlled ? String(value ?? '') : inner;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!controlled) setInner(e.target.value);
    onChange?.(e);
  };

  const clear = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;
    // Use the native setter so React's onChange fires for controlled inputs.
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
    setter?.call(el, '');
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.focus();
    onClear?.();
  }, [onClear]);

  return (
    <Field id={id} label={label} description={description} error={error} className={wrapperClassName}>
      <div
        className={cx('lm-input', className)}
        data-size={size === 'md' ? undefined : size}
        data-search={flag(appearance === 'search')}
        data-invalid={flag(error)}
        data-disabled={flag(disabled)}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) {
            e.preventDefault();
            inputRef.current?.focus();
          }
        }}
      >
        {leading && <span className="lm-input__adornment">{leading}</span>}
        <input
          ref={inputRef}
          id={id}
          className="lm-input__control"
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, Boolean(error ?? description), ariaDescribedBy)}
          value={controlled ? value : inner}
          onChange={handleChange}
          {...rest}
        />
        {clearable && current && !disabled && (
          <button type="button" className="lm-input__clear" aria-label="Clear" onClick={clear}>
            <CloseIcon />
          </button>
        )}
        {trailing && <span className="lm-input__adornment">{trailing}</span>}
      </div>
    </Field>
  );
});

export interface SearchFieldProps extends Omit<TextFieldProps, 'leading' | 'label' | 'type'> {
  /** Visually hidden label for assistive tech. @default 'Search' */
  label?: string;
}

/** Rounded search input with a magnifier and clear button. */
export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(function SearchField(
  { label = 'Search', placeholder = 'Search', className, ...rest },
  ref,
) {
  return (
    <TextField
      ref={ref}
      type="search"
      aria-label={label}
      placeholder={placeholder}
      leading={<SearchIcon />}
      clearable
      enterKeyHint="search"
      autoComplete="off"
      className={className}
      appearance="search"
      {...rest}
    />
  );
});

export interface TextAreaProps extends FieldChromeProps, Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { label, description, error, size = 'md', wrapperClassName, className, id: idProp, disabled, rows = 4, ...rest },
  ref,
) {
  const autoId = useId();
  const id = idProp ?? autoId;
  return (
    <Field id={id} label={label} description={description} error={error} className={wrapperClassName}>
      <div
        className={cx('lm-input', className)}
        data-multiline=""
        data-size={size === 'md' ? undefined : size}
        data-invalid={flag(error)}
        data-disabled={flag(disabled)}
      >
        <textarea
          ref={ref}
          id={id}
          rows={rows}
          className="lm-input__control"
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, Boolean(error ?? description))}
          {...rest}
        />
      </div>
    </Field>
  );
});

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends FieldChromeProps, Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options?: SelectOption[];
  placeholder?: string;
}

/** Native `<select>` in Lumen clothing — the best picker on every platform. */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, description, error, size = 'md', wrapperClassName, className, id: idProp, disabled, options, placeholder, children, ...rest },
  ref,
) {
  const autoId = useId();
  const id = idProp ?? autoId;
  return (
    <Field id={id} label={label} description={description} error={error} className={wrapperClassName}>
      <div
        className={cx('lm-input', className)}
        data-select=""
        data-size={size === 'md' ? undefined : size}
        data-invalid={flag(error)}
        data-disabled={flag(disabled)}
      >
        <select
          ref={ref}
          id={id}
          className="lm-input__control"
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, Boolean(error ?? description))}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options?.map((o) => (
            <option key={o.value} value={o.value} disabled={o.disabled}>
              {o.label}
            </option>
          ))}
          {children}
        </select>
        <ChevronUpDownIcon className="lm-input__chevron" />
      </div>
    </Field>
  );
});
