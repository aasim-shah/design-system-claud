'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cx } from '../utils.js';
import { useControllable } from './useControllable.js';

export interface SwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'value' | 'defaultValue'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** Monochrome `accent` (default) or iOS-style green `success`. @default 'accent' */
  tone?: 'accent' | 'success';
  size?: 'sm' | 'md';
  /** Name + value for native form submission. */
  name?: string;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  { checked, defaultChecked = false, onCheckedChange, tone = 'accent', size = 'md', className, onClick, name, ...rest },
  ref,
) {
  const [on, setOn] = useControllable(checked, defaultChecked, onCheckedChange);
  return (
    <>
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={on}
        className={cx('lm-switch', className)}
        data-tone={tone === 'accent' ? undefined : tone}
        data-size={size === 'md' ? undefined : size}
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented) setOn(!on);
        }}
        {...rest}
      >
        <span className="lm-switch__thumb" />
      </button>
      {name && <input type="hidden" name={name} value={on ? 'on' : 'off'} />}
    </>
  );
});
