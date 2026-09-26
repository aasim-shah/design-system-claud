'use client';

import {
  forwardRef,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ClipboardEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cx, flag } from '../utils.js';
import { CheckIcon, CloseIcon, EyeIcon, EyeOffIcon, FileIcon, MinusIcon, PlusIcon, UploadIcon } from './Icon.js';
import { Field } from './Field.js';
import { TextField, type TextFieldProps } from './TextField.js';
import { useControllable } from './useControllable.js';

/* ------------------------------------------------------------------- Chip */

export interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  /** Toggleable filter chip when defined. */
  selected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  /** Shows a × and makes the chip a static tag. */
  onRemove?: () => void;
  icon?: ReactNode;
}

/** Filter chip (toggle) or removable tag. */
export const Chip = forwardRef<HTMLButtonElement, ChipProps>(function Chip(
  { selected, onSelectedChange, onRemove, icon, className, children, onClick, ...rest },
  ref,
) {
  if (onRemove) {
    return (
      <span className={cx('lm-chip', className)} data-static="">
        {icon}
        {children}
        <button type="button" className="lm-chip__remove" aria-label={`Remove ${typeof children === 'string' ? children : ''}`.trim()} onClick={onRemove}>
          <CloseIcon />
        </button>
      </span>
    );
  }
  const toggle = selected !== undefined;
  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={toggle ? selected : undefined}
      className={cx('lm-chip', className)}
      onClick={(e) => {
        onClick?.(e);
        if (toggle) onSelectedChange?.(!selected);
      }}
      {...rest}
    >
      {toggle && selected ? <CheckIcon /> : icon}
      {children}
    </button>
  );
});

export function ChipGroup({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div role="group" className={cx('lm-chip-group', className)} {...rest} />;
}

/* ---------------------------------------------------------------- Stepper */

export interface StepperProps {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Accessible name, e.g. "Quantity". */
  label: string;
  format?: (value: number) => ReactNode;
  disabled?: boolean;
  className?: string;
}

/** − value + control for small, bounded numbers. */
export function Stepper({
  value,
  defaultValue = 0,
  onValueChange,
  min = 0,
  max = Infinity,
  step = 1,
  label,
  format,
  disabled,
  className,
}: StepperProps) {
  const [v, setV] = useControllable(value, defaultValue, onValueChange);
  const set = (n: number) => setV(Math.min(max, Math.max(min, n)));
  return (
    <div
      role="spinbutton"
      aria-label={label}
      aria-valuenow={v}
      aria-valuemin={Number.isFinite(min) ? min : undefined}
      aria-valuemax={Number.isFinite(max) ? max : undefined}
      tabIndex={-1}
      className={cx('lm-stepper', className)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowUp') { e.preventDefault(); set(v + step); }
        if (e.key === 'ArrowDown') { e.preventDefault(); set(v - step); }
      }}
    >
      <button type="button" className="lm-stepper__btn" aria-label={`Decrease ${label}`} disabled={disabled || v <= min} onClick={() => set(v - step)}>
        <MinusIcon />
      </button>
      <span className="lm-stepper__value" aria-live="polite">
        {format ? format(v) : v}
      </span>
      <button type="button" className="lm-stepper__btn" aria-label={`Increase ${label}`} disabled={disabled || v >= max} onClick={() => set(v + step)}>
        <PlusIcon />
      </button>
    </div>
  );
}

/* --------------------------------------------------------------- PinInput */

export interface PinInputProps {
  length?: number;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Called once every cell is filled. */
  onComplete?: (value: string) => void;
  /** Only digits by default. */
  type?: 'numeric' | 'alphanumeric';
  /** Mask characters (for PINs). */
  mask?: boolean;
  label?: ReactNode;
  error?: ReactNode;
  description?: ReactNode;
  /** Insert a separator after this many cells (e.g. 3 → 123–456). */
  groupSize?: number;
  autoFocus?: boolean;
}

/** One-time code / PIN entry with auto-advance, backspace-to-previous and paste support. */
export function PinInput({
  length = 6,
  value,
  defaultValue = '',
  onValueChange,
  onComplete,
  type = 'numeric',
  mask,
  label,
  error,
  description,
  groupSize,
  autoFocus,
}: PinInputProps) {
  const [v, setV] = useControllable(value, defaultValue, onValueChange);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const id = useId();
  const pattern = type === 'numeric' ? /[^0-9]/g : /[^0-9a-zA-Z]/g;

  const commit = (next: string) => {
    const clean = next.replace(pattern, '').slice(0, length);
    setV(clean);
    if (clean.length === length) onComplete?.(clean);
    return clean;
  };

  const onKey = (i: number) => (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (v[i]) commit(v.slice(0, i) + v.slice(i + 1));
      else if (i > 0) {
        commit(v.slice(0, i - 1) + v.slice(i));
        refs.current[i - 1]?.focus();
      }
    }
    if (e.key === 'ArrowLeft' && i > 0) refs.current[i - 1]?.focus();
    if (e.key === 'ArrowRight' && i < length - 1) refs.current[i + 1]?.focus();
  };

  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const clean = commit(e.clipboardData.getData('text'));
    refs.current[Math.min(clean.length, length - 1)]?.focus();
  };

  return (
    <Field id={`${id}-0`} label={label} error={error} description={description}>
      <div className="lm-pin" data-invalid={flag(error)} role="group" aria-label={typeof label === 'string' ? label : 'Verification code'}>
        {Array.from({ length }, (_, i) => (
          <span key={i} style={{ display: 'contents' }}>
            {groupSize && i > 0 && i % groupSize === 0 && <span className="lm-pin__sep" aria-hidden />}
            <input
              ref={(el) => { refs.current[i] = el; }}
              id={`${id}-${i}`}
              className="lm-pin__cell"
              type={mask ? 'password' : 'text'}
              inputMode={type === 'numeric' ? 'numeric' : 'text'}
              autoComplete={i === 0 ? 'one-time-code' : 'off'}
              maxLength={1}
              autoFocus={autoFocus && i === 0}
              aria-label={`Character ${i + 1} of ${length}`}
              aria-invalid={error ? true : undefined}
              value={v[i] ?? ''}
              onFocus={(e) => e.target.select()}
              onKeyDown={onKey(i)}
              onPaste={onPaste}
              onChange={(e) => {
                const ch = e.target.value.replace(pattern, '').slice(-1);
                if (!ch) return;
                const arr = v.padEnd(length, ' ').split('');
                arr[i] = ch;
                commit(arr.join('').trimEnd().replace(/ /g, ''));
                if (i < length - 1) refs.current[i + 1]?.focus();
              }}
            />
          </span>
        ))}
      </div>
    </Field>
  );
}

/* ---------------------------------------------------------- PasswordField */

export interface PasswordFieldProps extends Omit<TextFieldProps, 'type' | 'trailing'> {
  /** Show a strength meter under the field. */
  showStrength?: boolean;
}

export function passwordStrength(pw: string): 0 | 1 | 2 | 3 | 4 {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(4, score) as 0 | 1 | 2 | 3 | 4;
}

const strengthLabel = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'];

/** Password input with a show/hide toggle and an optional strength meter. */
export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(function PasswordField(
  { showStrength, description, value, defaultValue, onChange, autoComplete = 'current-password', ...rest },
  ref,
) {
  const [visible, setVisible] = useState(false);
  const [inner, setInner] = useState(String(defaultValue ?? ''));
  const pw = value !== undefined ? String(value) : inner;
  const score = passwordStrength(pw);

  const meter = showStrength && pw.length > 0 && (
    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span aria-hidden style={{ display: 'flex', gap: 4, flex: 1, maxWidth: 160 }}>
        {[1, 2, 3, 4].map((n) => (
          <span
            key={n}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 2,
              background:
                n <= score
                  ? score <= 1
                    ? 'var(--lm-color-danger)'
                    : score === 2
                      ? 'var(--lm-color-warning)'
                      : 'var(--lm-color-label-primary)'
                  : 'var(--lm-color-fill-primary)',
              transition: 'background-color var(--lm-duration-base)',
            }}
          />
        ))}
      </span>
      <span>{strengthLabel[score]}</span>
    </span>
  );

  return (
    <TextField
      ref={ref}
      type={visible ? 'text' : 'password'}
      autoComplete={autoComplete}
      value={value}
      defaultValue={defaultValue}
      onChange={(e) => {
        if (value === undefined) setInner(e.target.value);
        onChange?.(e);
      }}
      description={meter || description}
      trailing={
        <button
          type="button"
          className="lm-btn"
          data-variant="plain"
          data-tone="neutral"
          data-icon-only=""
          data-size="sm"
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          onClick={() => setVisible((x) => !x)}
          style={{ marginRight: -6 }}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      }
      {...rest}
    />
  );
});

/* --------------------------------------------------------------- FileDrop */

export interface FileDropProps {
  label?: ReactNode;
  /** e.g. "PNG, JPG or PDF up to 10 MB" */
  hint?: ReactNode;
  accept?: string;
  multiple?: boolean;
  /** Max bytes per file. */
  maxSize?: number;
  files?: File[];
  onFilesChange?: (files: File[]) => void;
  error?: ReactNode;
  disabled?: boolean;
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 ** 2) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 ** 2).toFixed(1)} MB`;
}

/** Drag-and-drop or click-to-browse file picker with a removable file list. */
export function FileDrop({ label, hint, accept, multiple, maxSize, files, onFilesChange, error, disabled }: FileDropProps) {
  const [list, setList] = useControllable<File[]>(files, [], onFilesChange);
  const [dragging, setDragging] = useState(false);
  const [rejected, setRejected] = useState<string | null>(null);
  const id = useId();

  const add = (incoming: FileList | null) => {
    if (!incoming) return;
    const arr = Array.from(incoming);
    const ok = maxSize ? arr.filter((f) => f.size <= maxSize) : arr;
    setRejected(ok.length < arr.length ? `${arr.length - ok.length} file(s) over ${formatBytes(maxSize!)} were skipped.` : null);
    setList(multiple ? [...list, ...ok] : ok.slice(0, 1));
  };

  return (
    <Field id={id} label={label} error={error ?? rejected ?? undefined}>
      <div
        className="lm-dropzone"
        data-dragging={flag(dragging)}
        aria-disabled={disabled || undefined}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (!disabled) add(e.dataTransfer.files);
        }}
      >
        <span className="lm-dropzone__icon">
          <UploadIcon />
        </span>
        <span className="lm-dropzone__title">{dragging ? 'Drop to upload' : 'Drag files here or click to browse'}</span>
        {hint && <span className="lm-dropzone__hint">{hint}</span>}
        <input
          id={id}
          type="file"
          className="lm-dropzone__input"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={(e) => {
            add(e.target.files);
            e.target.value = '';
          }}
        />
      </div>
      {list.length > 0 && (
        <ul className="lm-file-list">
          {list.map((f, i) => (
            <li key={`${f.name}-${i}`} className="lm-file">
              <FileIcon />
              <span className="lm-file__name">{f.name}</span>
              <span className="lm-file__size">{formatBytes(f.size)}</span>
              <button
                type="button"
                className="lm-btn"
                data-variant="plain"
                data-tone="neutral"
                data-icon-only=""
                data-size="sm"
                aria-label={`Remove ${f.name}`}
                onClick={() => setList(list.filter((_, j) => j !== i))}
              >
                <CloseIcon strokeWidth={2.4} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Field>
  );
}
