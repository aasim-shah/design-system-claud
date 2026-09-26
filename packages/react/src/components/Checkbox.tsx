'use client';

import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  type FieldsetHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { cx, flag } from '../utils.js';
import { CheckIcon } from './Icon.js';
import { useControllable } from './useControllable.js';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: ReactNode;
  description?: ReactNode;
  /** @default 'square' */
  shape?: 'square' | 'circle';
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, description, shape = 'square', indeterminate, className, disabled, onChange, onCheckedChange, id: idProp, ...rest },
  ref,
) {
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);
  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = Boolean(indeterminate);
  }, [indeterminate]);
  const autoId = useId();
  const id = idProp ?? autoId;

  return (
    <label className={cx('lm-check', className)} data-shape={shape === 'circle' ? 'circle' : undefined} data-disabled={flag(disabled)} htmlFor={id}>
      <input
        ref={inputRef}
        id={id}
        type="checkbox"
        className="lm-check__input"
        disabled={disabled}
        aria-describedby={description ? `${id}-desc` : undefined}
        onChange={(e) => {
          onChange?.(e);
          onCheckedChange?.(e.target.checked);
        }}
        {...rest}
      />
      <span className="lm-check__box" aria-hidden>
        <CheckIcon />
      </span>
      {(label || description) && (
        <span className="lm-check__text">
          {label && <span>{label}</span>}
          {description && (
            <span className="lm-check__description" id={`${id}-desc`}>
              {description}
            </span>
          )}
        </span>
      )}
    </label>
  );
});

interface RadioContextValue {
  name: string;
  value: string;
  setValue: (v: string) => void;
  disabled?: boolean;
}

const RadioContext = createContext<RadioContextValue | null>(null);

export interface RadioGroupProps extends Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, 'onChange' | 'defaultValue'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  /** Visually hidden legend for assistive tech. */
  label?: string;
  orientation?: 'vertical' | 'horizontal';
}

export function RadioGroup({
  value,
  defaultValue = '',
  onValueChange,
  name,
  label,
  orientation = 'vertical',
  disabled,
  className,
  children,
  ...rest
}: RadioGroupProps) {
  const autoName = useId();
  const [current, setValue] = useControllable(value, defaultValue, onValueChange);
  return (
    <RadioContext.Provider value={{ name: name ?? autoName, value: current, setValue, disabled }}>
      <fieldset className={cx('lm-radio-group', className)} data-orientation={orientation} disabled={disabled} {...rest}>
        {label && <legend className="lm-visually-hidden">{label}</legend>}
        {children}
      </fieldset>
    </RadioContext.Provider>
  );
}

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'value'> {
  value: string;
  label?: ReactNode;
  description?: ReactNode;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { value, label, description, className, disabled, id: idProp, ...rest },
  ref,
) {
  const group = useContext(RadioContext);
  const autoId = useId();
  const id = idProp ?? autoId;
  const isDisabled = disabled || group?.disabled;
  return (
    <label className={cx('lm-check', className)} data-type="radio" data-disabled={flag(isDisabled)} htmlFor={id}>
      <input
        ref={ref}
        id={id}
        type="radio"
        className="lm-check__input"
        name={group?.name}
        value={value}
        checked={group ? group.value === value : undefined}
        onChange={() => group?.setValue(value)}
        disabled={isDisabled}
        {...rest}
      />
      <span className="lm-check__box" aria-hidden>
        <span className="lm-check__dot" />
      </span>
      {(label || description) && (
        <span className="lm-check__text">
          {label && <span>{label}</span>}
          {description && <span className="lm-check__description">{description}</span>}
        </span>
      )}
    </label>
  );
});
