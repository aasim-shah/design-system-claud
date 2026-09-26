'use client';

import { useId, type ReactNode } from 'react';
import { cx, flag } from '../utils.js';
import { ChevronDownIcon } from './Icon.js';
import { useControllable } from './useControllable.js';

export interface AccordionItem {
  value: string;
  title: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** `single` closes the others when one opens. @default 'single' */
  type?: 'single' | 'multiple';
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  className?: string;
}

/** Expandable sections (FAQ, settings details) with a smooth height animation. */
export function Accordion({ items, type = 'single', value, defaultValue = [], onValueChange, className }: AccordionProps) {
  const [open, setOpen] = useControllable(value, defaultValue, onValueChange);
  const id = useId();
  const toggle = (v: string) => {
    const isOpen = open.includes(v);
    if (type === 'single') setOpen(isOpen ? [] : [v]);
    else setOpen(isOpen ? open.filter((x) => x !== v) : [...open, v]);
  };
  return (
    <div className={cx('lm-accordion', className)}>
      {items.map((item) => {
        const isOpen = open.includes(item.value);
        const tid = `${id}-${item.value}-trigger`;
        const rid = `${id}-${item.value}-region`;
        return (
          <div key={item.value} className="lm-accordion__item">
            <h3 style={{ margin: 0 }}>
              <button
                type="button"
                id={tid}
                aria-expanded={isOpen}
                aria-controls={rid}
                disabled={item.disabled}
                className="lm-accordion__trigger"
                onClick={() => toggle(item.value)}
              >
                {item.title}
                <ChevronDownIcon className="lm-accordion__chevron" />
              </button>
            </h3>
            <div id={rid} role="region" aria-labelledby={tid} className="lm-accordion__region" data-open={flag(isOpen)} inert={!isOpen || undefined}>
              <div className="lm-accordion__inner">
                <div className="lm-accordion__content">{item.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
