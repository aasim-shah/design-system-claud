'use client';

import { forwardRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { size as sizes } from '@lumen/tokens';
import { cx, vars } from '../utils.js';

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  src?: string;
  /** Used for alt text and initials fallback. */
  name?: string;
  size?: keyof typeof sizes.avatar | number;
  shape?: 'circle' | 'rounded';
  /** Background for the initials fallback (any CSS color / gradient). */
  color?: string;
  /** Presence dot. */
  status?: boolean | string;
  fallback?: ReactNode;
}

export function initials(name = ''): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '';
  const first = parts[0][0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { src, name, size = 'md', shape = 'circle', color, status, fallback, className, style, ...rest },
  ref,
) {
  const [failed, setFailed] = useState(false);
  const px = typeof size === 'number' ? size : sizes.avatar[size];
  const avatar = (
    <span
      ref={status ? undefined : ref}
      role="img"
      aria-label={name}
      className={cx('lm-avatar', className)}
      data-shape={shape === 'rounded' ? 'rounded' : undefined}
      style={vars(status ? undefined : style, { '--lm-avatar-size': `${px}px`, '--lm-avatar-bg': color })}
      {...(status ? {} : rest)}
    >
      {src && !failed ? (
        <img className="lm-avatar__img" src={src} alt="" onError={() => setFailed(true)} />
      ) : (
        fallback ?? initials(name)
      )}
    </span>
  );
  if (!status) return avatar;
  return (
    <span ref={ref} className="lm-avatar-wrap" style={vars(style, { '--lm-avatar-size': `${px}px` })} {...rest}>
      {avatar}
      <span
        className="lm-avatar__status"
        style={typeof status === 'string' ? { background: status } : undefined}
        aria-hidden
      />
    </span>
  );
});

export function AvatarGroup({ children, className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cx('lm-avatar-group', className)} {...rest}>
      {children}
    </div>
  );
}
