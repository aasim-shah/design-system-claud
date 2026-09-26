import { forwardRef, type ReactNode, type SVGProps } from 'react';
import { cx } from '../utils.js';

export interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (any CSS length). Defaults to 1.15em so icons scale with text. */
  size?: number | string;
  /** Accessible label. When omitted the icon is decorative (aria-hidden). */
  label?: string;
}

/**
 * Base for stroke icons drawn on a 24×24 grid with rounded caps & joins —
 * the same visual language as SF Symbols' regular weight.
 * Bring any 24px stroke icon set (Lucide, Heroicons…) and it will match.
 */
export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
  { size, label, className, style, children, strokeWidth = 2, ...rest },
  ref,
) {
  return (
    <svg
      ref={ref}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
      className={cx('lm-icon', className)}
      style={size !== undefined ? { ...style, ['--lm-icon-size' as string]: typeof size === 'number' ? `${size}px` : size } : style}
      {...rest}
    >
      {children}
    </svg>
  );
});

const make = (name: string, paths: ReactNode) => {
  const C = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
    <Icon ref={ref} {...props}>
      {paths}
    </Icon>
  ));
  C.displayName = name;
  return C;
};

export const ChevronRightIcon = make('ChevronRightIcon', <path d="M9 5l7 7-7 7" />);
export const ChevronLeftIcon = make('ChevronLeftIcon', <path d="M15 5l-7 7 7 7" />);
export const ChevronDownIcon = make('ChevronDownIcon', <path d="M5 9l7 7 7-7" />);
export const ChevronUpDownIcon = make('ChevronUpDownIcon', <path d="M7 9.5l5-5 5 5M7 14.5l5 5 5-5" />);
export const CheckIcon = make('CheckIcon', <path d="M4.5 12.5l5 5L19.5 7" />);
export const CloseIcon = make('CloseIcon', <path d="M6 6l12 12M18 6L6 18" />);
export const PlusIcon = make('PlusIcon', <path d="M12 5v14M5 12h14" />);
export const MinusIcon = make('MinusIcon', <path d="M5 12h14" />);
export const SearchIcon = make(
  'SearchIcon',
  <>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="M15.5 15.5L20 20" />
  </>,
);
export const InfoIcon = make(
  'InfoIcon',
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5.5M12 7.6v.1" />
  </>,
);
export const CheckCircleIcon = make(
  'CheckCircleIcon',
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12.3l2.7 2.7L16 9.5" />
  </>,
);
export const AlertIcon = make(
  'AlertIcon',
  <>
    <path d="M10.3 4.2L2.8 17.5A2 2 0 0 0 4.5 20.5h15a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0z" />
    <path d="M12 9.5v4M12 17v.1" />
  </>,
);
export const XCircleIcon = make(
  'XCircleIcon',
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.2 9.2l5.6 5.6M14.8 9.2l-5.6 5.6" />
  </>,
);
export const EyeIcon = make(
  'EyeIcon',
  <>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
    <circle cx="12" cy="12" r="3" />
  </>,
);
export const EyeOffIcon = make(
  'EyeOffIcon',
  <>
    <path d="M10.6 5.6A9.7 9.7 0 0 1 12 5.5C18 5.5 21.5 12 21.5 12a17 17 0 0 1-2.9 3.6M6.4 6.9C3.9 8.6 2.5 12 2.5 12S6 18.5 12 18.5c1.7 0 3.2-.5 4.5-1.2" />
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2M3 3l18 18" />
  </>,
);
export const UploadIcon = make('UploadIcon', <path d="M12 16V4M7 9l5-5 5 5M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />);
export const MoreIcon = make(
  'MoreIcon',
  <>
    <circle cx="5.5" cy="12" r="1.2" fill="currentColor" />
    <circle cx="12" cy="12" r="1.2" fill="currentColor" />
    <circle cx="18.5" cy="12" r="1.2" fill="currentColor" />
  </>,
);
export const FileIcon = make(
  'FileIcon',
  <>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5" />
  </>,
);
