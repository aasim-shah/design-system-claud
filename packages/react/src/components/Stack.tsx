import { forwardRef, type CSSProperties, type ElementType, type HTMLAttributes } from 'react';
import type { SpacingKey } from '@lumen/tokens';
import { cx, space, vars } from '../utils.js';

type Align = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
type Justify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

export interface StackProps extends HTMLAttributes<HTMLElement> {
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  /** Spacing key on the 4pt grid (e.g. 4 → 16px) or any CSS length. */
  gap?: SpacingKey | string;
  align?: Align;
  justify?: Justify;
  wrap?: boolean;
  as?: ElementType;
}

const alignMap: Record<Align, CSSProperties['alignItems']> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
  baseline: 'baseline',
};

const justifyMap: Record<Justify, CSSProperties['justifyContent']> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
};

/** Flexbox layout primitive. Use `HStack` / `VStack` for the common cases. */
export const Stack = forwardRef<HTMLElement, StackProps>(function Stack(
  { direction = 'column', gap, align, justify, wrap, as: Tag = 'div', className, style, ...rest },
  ref,
) {
  return (
    <Tag
      ref={ref}
      className={cx('lm-stack', className)}
      style={vars(style, {
        // Always set every knob: custom properties inherit, and a nested
        // stack must never pick up its parent's direction or gap.
        '--lm-stack-direction': direction,
        '--lm-stack-gap': space(gap) ?? '0',
        '--lm-stack-align': align ? (alignMap[align] as string) : 'stretch',
        '--lm-stack-justify': justify ? (justifyMap[justify] as string) : 'flex-start',
        '--lm-stack-wrap': wrap ? 'wrap' : 'nowrap',
      })}
      {...rest}
    />
  );
});

export const HStack = forwardRef<HTMLElement, Omit<StackProps, 'direction'>>(function HStack(
  { align = 'center', ...props },
  ref,
) {
  return <Stack ref={ref} direction="row" align={align} {...props} />;
});

export const VStack = forwardRef<HTMLElement, Omit<StackProps, 'direction'>>(function VStack(props, ref) {
  return <Stack ref={ref} direction="column" {...props} />;
});
