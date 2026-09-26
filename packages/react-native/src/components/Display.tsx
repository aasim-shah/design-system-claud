import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  Image,
  StyleSheet,
  View,
  type DimensionValue,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { size as sizes } from '@lumen/tokens';
import { useTheme } from '../theme/ThemeProvider.js';
import { Text } from './Text.js';

/* ------------------------------------------------------------------ Badge */

export interface BadgeProps {
  children?: ReactNode;
  tone?: 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  variant?: 'subtle' | 'solid';
  size?: 'sm' | 'md';
  dot?: boolean;
  count?: number;
  max?: number;
  style?: StyleProp<ViewStyle>;
}

export function Badge({ children, tone = 'accent', variant = 'subtle', size = 'md', dot, count, max = 99, style }: BadgeProps) {
  const { colors } = useTheme();
  const intent =
    tone === 'neutral'
      ? {
          default: variant === 'solid' ? colors.label.primary : colors.label.secondary,
          subtle: colors.fill.tertiary,
          on: colors.background.primary,
        }
      : colors[tone];
  const fg = variant === 'solid' ? intent.on : intent.default;
  const H = size === 'sm' ? 18 : 22;
  const content = typeof count === 'number' ? (count > max ? `${max}+` : String(count)) : children;
  return (
    <View
      style={[
        {
          height: H,
          minWidth: H,
          paddingHorizontal: size === 'sm' ? 6 : 8,
          borderRadius: H / 2,
          backgroundColor: variant === 'solid' ? intent.default : intent.subtle,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'flex-start',
          gap: 4,
        },
        style,
      ]}
    >
      {dot && <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: fg }} />}
      {typeof content === 'string' || typeof content === 'number' ? (
        <Text variant={size === 'sm' ? 'caption2' : 'caption1'} weight="semibold" tabular style={{ color: fg }}>
          {content}
        </Text>
      ) : (
        content
      )}
    </View>
  );
}

/* ----------------------------------------------------------------- Avatar */

export interface AvatarProps {
  source?: { uri: string } | number;
  name?: string;
  size?: keyof typeof sizes.avatar | number;
  shape?: 'circle' | 'rounded';
  color?: string;
  status?: boolean | string;
  style?: StyleProp<ViewStyle>;
}

export function initials(name = ''): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '';
  return ((parts[0][0] ?? '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
}

export function Avatar({ source, name, size = 'md', shape = 'circle', color, status, style }: AvatarProps) {
  const { colors } = useTheme();
  const [failed, setFailed] = useState(false);
  const px = typeof size === 'number' ? size : sizes.avatar[size];
  const r = shape === 'rounded' ? px * 0.225 : px / 2;
  const dot = Math.max(8, px * 0.28);
  return (
    <View style={[{ width: px, height: px }, style]} accessibilityRole="image" accessibilityLabel={name}>
      <View
        style={{
          width: px,
          height: px,
          borderRadius: r,
          overflow: 'hidden',
          backgroundColor: color ?? '#9A9FAA',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {source && !failed ? (
          <Image source={source} style={{ width: px, height: px }} onError={() => setFailed(true)} />
        ) : (
          <Text style={{ color: '#FFFFFF', fontSize: px * 0.4, lineHeight: px * 0.5, fontWeight: '600' }}>{initials(name)}</Text>
        )}
      </View>
      {status && (
        <View
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: dot,
            height: dot,
            borderRadius: dot / 2,
            borderWidth: 2,
            borderColor: colors.background.primary,
            backgroundColor: typeof status === 'string' ? status : colors.success.default,
          }}
        />
      )}
    </View>
  );
}

/* ---------------------------------------------------------------- Divider */

export function Divider({ vertical, inset = 0, style }: { vertical?: boolean; inset?: number; style?: StyleProp<ViewStyle> }) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        vertical
          ? { width: StyleSheet.hairlineWidth, alignSelf: 'stretch' }
          : { height: StyleSheet.hairlineWidth, alignSelf: 'stretch', marginLeft: inset },
        { backgroundColor: colors.separator.default },
        style,
      ]}
    />
  );
}

/* ---------------------------------------------------------------- Spinner */

export function Spinner({ size = 'md', color, style }: { size?: 'sm' | 'md' | 'lg'; color?: string; style?: StyleProp<ViewStyle> }) {
  const { colors } = useTheme();
  return (
    <ActivityIndicator
      size={size === 'lg' ? 'large' : 'small'}
      color={color ?? colors.label.secondary}
      style={[size === 'sm' && { transform: [{ scale: 0.8 }] }, style]}
    />
  );
}

/* --------------------------------------------------------------- Progress */

export interface ProgressProps {
  /** 0–100. Omit for indeterminate. */
  value?: number;
  size?: 'md' | 'lg';
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export function Progress({ value, size = 'md', color, style }: ProgressProps) {
  const { colors } = useTheme();
  const [width, setWidth] = useState(0);
  const anim = useRef(new Animated.Value(value ?? 0)).current;
  const loop = useRef(new Animated.Value(0)).current;
  const H = size === 'lg' ? 8 : 4;
  const indeterminate = value === undefined;

  useEffect(() => {
    if (indeterminate) {
      const a = Animated.loop(
        Animated.timing(loop, { toValue: 1, duration: 1300, easing: Easing.bezier(0.25, 0.1, 0.25, 1), useNativeDriver: true }),
      );
      a.start();
      return () => a.stop();
    }
    Animated.timing(anim, { toValue: Math.min(100, Math.max(0, value)), duration: 360, useNativeDriver: false }).start();
  }, [value, indeterminate, anim, loop]);

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={indeterminate ? undefined : { min: 0, max: 100, now: Math.round(value) }}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      style={[{ height: H, borderRadius: H / 2, backgroundColor: colors.fill.primary, overflow: 'hidden' }, style]}
    >
      {indeterminate ? (
        <Animated.View
          style={{
            width: '35%',
            height: H,
            borderRadius: H / 2,
            backgroundColor: color ?? colors.accent.default,
            transform: [{ translateX: loop.interpolate({ inputRange: [0, 1], outputRange: [-width * 0.35, width] }) }],
          }}
        />
      ) : (
        <Animated.View
          style={{
            height: H,
            borderRadius: H / 2,
            backgroundColor: color ?? colors.accent.default,
            width: anim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
          }}
        />
      )}
    </View>
  );
}

/* --------------------------------------------------------------- Skeleton */

export interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  shape?: 'rect' | 'text' | 'circle';
  style?: StyleProp<ViewStyle>;
}

export function Skeleton({ width = '100%', height, shape = 'rect', style }: SkeletonProps) {
  const { colors } = useTheme();
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const a = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.45, duration: 800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
      ]),
    );
    a.start();
    return () => a.stop();
  }, [pulse]);
  const h = height ?? (shape === 'text' ? 12 : shape === 'circle' ? width : 16);
  return (
    <Animated.View
      style={[
        {
          width,
          height: h,
          opacity: pulse,
          borderRadius: shape === 'circle' ? 999 : shape === 'text' ? 4 : 8,
          backgroundColor: colors.fill.tertiary,
          marginVertical: shape === 'text' ? 3 : 0,
        },
        style,
      ]}
    />
  );
}
