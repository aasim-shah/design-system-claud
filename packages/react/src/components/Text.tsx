import { forwardRef, type ElementType, type HTMLAttributes } from 'react';
import type { TextVariant, FontWeight } from '@lumen/tokens';
import { cx, flag } from '../utils.js';

export type TextColor = 'primary' | 'secondary' | 'tertiary' | 'accent' | 'success' | 'warning' | 'danger' | 'inherit';

export interface TextProps extends HTMLAttributes<HTMLElement> {
  /** Type style from the Lumen scale. @default 'body' */
  variant?: TextVariant;
  /** Semantic color. @default 'inherit' */
  color?: TextColor;
  weight?: FontWeight;
  align?: 'start' | 'center' | 'end';
  /** Single line with an ellipsis. */
  truncate?: boolean;
  /** Tabular (monospaced) figures — for numbers that change or align. */
  tabular?: boolean;
  /** Balanced line breaks for headings. */
  balance?: boolean;
  mono?: boolean;
  rounded?: boolean;
  /** Element to render. Defaults to a sensible tag for the variant. */
  as?: ElementType;
  htmlFor?: string;
}

const defaultTag: Record<TextVariant, ElementType> = {
  display: 'h1',
  largeTitle: 'h1',
  title1: 'h2',
  title2: 'h3',
  title3: 'h4',
  headline: 'p',
  body: 'p',
  callout: 'p',
  subheadline: 'p',
  footnote: 'p',
  caption1: 'span',
  caption2: 'span',
};

export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  { variant = 'body', color = 'inherit', weight, align, truncate, tabular, balance, mono, rounded, as, className, ...rest },
  ref,
) {
  const Tag = as ?? defaultTag[variant];
  return (
    <Tag
      ref={ref}
      className={cx('lm-text', className)}
      data-variant={variant}
      data-color={color === 'inherit' ? undefined : color}
      data-weight={weight}
      data-align={align}
      data-truncate={flag(truncate)}
      data-tabular={flag(tabular)}
      data-balance={flag(balance)}
      data-mono={flag(mono)}
      data-rounded={flag(rounded)}
      {...rest}
    />
  );
});
