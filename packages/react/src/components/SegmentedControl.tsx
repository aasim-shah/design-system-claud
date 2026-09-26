'use client';

import { useRef, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { cx, flag, vars } from '../utils.js';
import { useControllable } from './useControllable.js';

export interface SegmentedOption<T extends string = string> {
  value: T;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps<T extends string = string> {
  options: ReadonlyArray<SegmentedOption<T>>;
  value?: T;
  defaultValue?: T;
  onValueChange?: (value: T) => void;
  size?: 'md' | 'lg';
  fullWidth?: boolean;
  /** Accessible name for the group. */
  label?: string;
  className?: string;
  style?: CSSProperties;
}

/** A sliding pill selector for 2–5 mutually exclusive, instantly-applied options. */
export function SegmentedControl<T extends string = string>({
  options,
  value,
  defaultValue,
  onValueChange,
  size = 'md',
  fullWidth,
  label,
  className,
  style,
}: SegmentedControlProps<T>) {
  const [current, setCurrent] = useControllable<T>(value, defaultValue ?? options[0]?.value, onValueChange);
  const index = Math.max(0, options.findIndex((o) => o.value === current));
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const move = (e: KeyboardEvent, dir: 1 | -1) => {
    e.preventDefault();
    for (let i = 1; i <= options.length; i++) {
      const next = (index + dir * i + options.length) % options.length;
      if (!options[next].disabled) {
        setCurrent(options[next].value);
        refs.current[next]?.focus();
        return;
      }
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cx('lm-segmented', className)}
      data-size={size === 'md' ? undefined : size}
      data-full-width={flag(fullWidth)}
      style={vars(style, { '--lm-seg-count': options.length, '--lm-seg-index': index })}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') move(e, 1);
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') move(e, -1);
      }}
    >
      <span className="lm-segmented__thumb" aria-hidden />
      {options.map((o, i) => {
        const selected = i === index;
        return (
          <button
            key={o.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            disabled={o.disabled}
            className="lm-segmented__item"
            onClick={() => setCurrent(o.value)}
          >
            {o.icon}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
