import { type ReactNode } from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { size as sizes, type IntentColor } from '@lumen/tokens';
import { useTheme, type LumenTheme } from '../theme/ThemeProvider.js';
import { usePress } from '../theme/usePress.js';
import { Text } from './Text.js';

export type ButtonVariant = 'filled' | 'tinted' | 'gray' | 'plain' | 'outline';
export type ButtonTone = 'accent' | 'neutral' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  children?: ReactNode;
  /** filled → tinted → gray → outline → plain. @default 'filled' */
  variant?: ButtonVariant;
  /** @default 'accent' */
  tone?: ButtonTone;
  /** @default 'md' (44pt) */
  size?: ButtonSize;
  shape?: 'rounded' | 'capsule';
  fullWidth?: boolean;
  loading?: boolean;
  /** Render function receives the foreground color so icons match. */
  leadingIcon?: ReactNode | ((color: string) => ReactNode);
  trailingIcon?: ReactNode | ((color: string) => ReactNode);
  style?: StyleProp<ViewStyle>;
}

function toneColors(t: LumenTheme, tone: ButtonTone): IntentColor {
  const c = t.colors;
  if (tone === 'neutral')
    return { default: c.label.primary, pressed: c.label.secondary, subtle: c.fill.tertiary, on: c.background.primary };
  return c[tone];
}

export function resolveButtonColors(t: LumenTheme, variant: ButtonVariant, tone: ButtonTone, pressed: boolean) {
  const c = toneColors(t, tone);
  switch (variant) {
    case 'filled':
      return { bg: pressed ? c.pressed : c.default, fg: c.on, border: undefined };
    case 'tinted':
      return { bg: c.subtle, fg: c.default, border: undefined, dim: pressed };
    case 'gray':
      return { bg: pressed ? t.colors.fill.secondary : t.colors.fill.tertiary, fg: c.default, border: undefined };
    case 'outline':
      return { bg: pressed ? t.colors.fill.quaternary : 'transparent', fg: c.default, border: t.colors.separator.default };
    case 'plain':
      return { bg: 'transparent', fg: c.default, border: undefined, dim: pressed };
  }
}

const metrics = {
  sm: { height: sizes.control.sm, px: 12, radius: 999, text: 'subheadline' as const, gap: 4 },
  md: { height: sizes.control.md, px: 20, radius: 12, text: 'headline' as const, gap: 8 },
  lg: { height: sizes.control.lg, px: 24, radius: 14, text: 'headline' as const, gap: 8 },
};

export function Button({
  children,
  variant = 'filled',
  tone = 'accent',
  size = 'md',
  shape,
  fullWidth,
  loading,
  leadingIcon,
  trailingIcon,
  disabled,
  style,
  onPress,
  ...rest
}: ButtonProps) {
  const theme = useTheme();
  const press = usePress();
  const m = metrics[size];
  const col = resolveButtonColors(theme, variant, tone, press.pressed);
  const render = (n: ButtonProps['leadingIcon']) => (typeof n === 'function' ? n(col.fg) : n);
  const isDisabled = disabled || loading;

  return (
    <Animated.View
      style={[
        { transform: [{ scale: press.scale }], opacity: disabled ? theme.opacity.disabled : col.dim ? theme.opacity.pressed : 1 },
        fullWidth ? { alignSelf: 'stretch' } : { alignSelf: 'flex-start' },
        style,
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: !!isDisabled, busy: !!loading }}
        disabled={isDisabled}
        onPress={onPress}
        onPressIn={press.onPressIn}
        onPressOut={press.onPressOut}
        hitSlop={size === 'sm' ? 6 : undefined}
        style={{
          height: m.height,
          paddingHorizontal: variant === 'plain' ? 8 : m.px,
          borderRadius: shape === 'capsule' ? 999 : m.radius,
          backgroundColor: col.bg,
          borderWidth: col.border ? 1 : 0,
          borderColor: col.border,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: m.gap,
        }}
        {...rest}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: m.gap, opacity: loading ? 0 : 1 }}>
          {render(leadingIcon)}
          {children !== undefined && children !== null && (
            <Text variant={m.text} weight="semibold" style={{ color: col.fg }} numberOfLines={1}>
              {children}
            </Text>
          )}
          {render(trailingIcon)}
        </View>
        {loading && <ActivityIndicator color={col.fg} style={{ position: 'absolute' }} />}
      </Pressable>
    </Animated.View>
  );
}

export interface IconButtonProps extends Omit<ButtonProps, 'children' | 'leadingIcon' | 'trailingIcon' | 'fullWidth' | 'shape'> {
  /** Required accessibility label. */
  label: string;
  icon: ReactNode | ((color: string) => ReactNode);
}

/** Circular icon-only button. */
export function IconButton({ label, icon, variant = 'gray', tone = 'accent', size = 'md', disabled, style, ...rest }: IconButtonProps) {
  const theme = useTheme();
  const press = usePress(0.92);
  const d = metrics[size].height;
  const col = resolveButtonColors(theme, variant, tone, press.pressed);
  return (
    <Animated.View
      style={[
        { transform: [{ scale: press.scale }], opacity: disabled ? theme.opacity.disabled : col.dim ? theme.opacity.pressed : 1 },
        style,
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        disabled={disabled}
        onPressIn={press.onPressIn}
        onPressOut={press.onPressOut}
        hitSlop={8}
        style={{
          width: d,
          height: d,
          borderRadius: d / 2,
          backgroundColor: col.bg,
          borderWidth: col.border ? 1 : 0,
          borderColor: col.border,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        {...rest}
      >
        {typeof icon === 'function' ? icon(col.fg) : icon}
      </Pressable>
    </Animated.View>
  );
}
