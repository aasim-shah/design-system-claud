import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react';
import { cx, flag } from '../utils.js';
import { Spinner } from './Spinner.js';

export type ButtonVariant = 'filled' | 'tinted' | 'gray' | 'plain' | 'outline';
export type ButtonTone = 'accent' | 'neutral' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface BaseProps {
  /**
   * Visual weight, from loudest to quietest:
   * `filled` → `tinted` → `gray` → `outline` → `plain`.
   * Use one `filled` button per view for the primary action. @default 'filled'
   */
  variant?: ButtonVariant;
  /** Color intent. @default 'accent' */
  tone?: ButtonTone;
  /** @default 'md' (44px — the minimum comfortable touch target) */
  size?: ButtonSize;
  shape?: 'rounded' | 'capsule';
  fullWidth?: boolean;
  loading?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  children?: ReactNode;
}

export type ButtonProps = BaseProps &
  (
    | ({ href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>)
    | ({ href: string } & AnchorHTMLAttributes<HTMLAnchorElement>)
  );

/**
 * The primary way to trigger an action. Renders an `<a>` when given `href`
 * (wrap in Next.js `<Link legacyBehavior passHref>` or pass `as` via your router).
 */
export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(function Button(props, ref) {
  const {
    variant = 'filled',
    tone = 'accent',
    size = 'md',
    shape,
    fullWidth,
    loading,
    leadingIcon,
    trailingIcon,
    className,
    children,
    ...rest
  } = props;

  const common = {
    className: cx('lm-btn', className),
    'data-variant': variant === 'filled' ? undefined : variant,
    'data-tone': tone === 'accent' ? undefined : tone,
    'data-size': size === 'md' ? undefined : size,
    'data-shape': shape === 'capsule' ? 'capsule' : undefined,
    'data-full-width': flag(fullWidth),
    'data-loading': flag(loading),
    'aria-busy': loading || undefined,
  };

  const content = (
    <>
      {leadingIcon}
      {children !== undefined && children !== null && <span>{children}</span>}
      {trailingIcon}
      {loading && (
        <span className="lm-btn__spinner">
          <Spinner size="sm" color="currentColor" />
        </span>
      )}
    </>
  );

  if (typeof rest.href === 'string') {
    const anchor = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a ref={ref as Ref<HTMLAnchorElement>} {...common} {...anchor}>
        {content}
      </a>
    );
  }

  const { type = 'button', disabled, onClick, ...button } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      ref={ref as Ref<HTMLButtonElement>}
      type={type}
      disabled={disabled}
      aria-disabled={loading || undefined}
      onClick={loading ? undefined : onClick}
      {...common}
      {...button}
    >
      {content}
    </button>
  );
});

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Required: describes the action for screen readers. */
  label: string;
  icon: ReactNode;
  variant?: ButtonVariant;
  tone?: ButtonTone;
  size?: ButtonSize;
}

/** Circular, icon-only button. Always provide a `label`. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, icon, variant = 'gray', tone = 'accent', size = 'md', className, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={label}
      className={cx('lm-btn', className)}
      data-icon-only=""
      data-variant={variant === 'filled' ? undefined : variant}
      data-tone={tone === 'accent' ? undefined : tone}
      data-size={size === 'md' ? undefined : size}
      {...rest}
    >
      {icon}
    </button>
  );
});
