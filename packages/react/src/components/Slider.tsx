'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import { cx, vars } from '../utils.js';
import { useControllable } from './useControllable.js';

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'defaultValue' | 'onChange'> {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

/** Continuous value picker built on the native range input (full keyboard & a11y support). */
export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(
  { value, defaultValue, onValueChange, min = 0, max = 100, step = 1, className, style, ...rest },
  ref,
) {
  const [current, setCurrent] = useControllable(value, defaultValue ?? (min + max) / 2, onValueChange);
  const pct = max === min ? 0 : ((current - min) / (max - min)) * 100;
  return (
    <input
      ref={ref}
      type="range"
      min={min}
      max={max}
      step={step}
      value={current}
      onChange={(e) => setCurrent(Number(e.target.value))}
      className={cx('lm-slider', className)}
      style={vars(style, { '--lm-slider-value': `${pct}%` })}
      {...rest}
    />
  );
});
