import { type ReactNode } from 'react';
import { Animated, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { elevation, spacing } from '@lumen/tokens';
import { useTheme } from '../theme/ThemeProvider.js';
import { usePress } from '../theme/usePress.js';

export interface CardProps {
  children?: ReactNode;
  /** elevated (shadow) · filled · grouped · outlined. @default 'elevated' */
  variant?: 'elevated' | 'filled' | 'grouped' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

const pad = { none: 0, sm: spacing[3], md: spacing[5], lg: spacing[8] };
const rad = { none: 20, sm: 14, md: 20, lg: 28 };

export function Card({ children, variant = 'elevated', padding = 'md', onPress, accessibilityLabel, style }: CardProps) {
  const theme = useTheme();
  const { colors, scheme } = theme;
  const press = usePress(0.985);

  const surface: ViewStyle = {
    padding: pad[padding],
    borderRadius: rad[padding],
    backgroundColor:
      variant === 'filled'
        ? colors.background.secondary
        : variant === 'grouped'
          ? colors.background.groupedSecondary
          : variant === 'outlined'
            ? 'transparent'
            : colors.background.elevated,
    borderWidth: variant === 'outlined' ? 1 : variant === 'elevated' ? StyleSheet.hairlineWidth : 0,
    borderColor: colors.separator.default,
    ...(variant === 'elevated' ? elevation.native(2, scheme) : null),
  };

  if (!onPress) return <View style={[surface, style]}>{children}</View>;

  return (
    <Animated.View style={[{ transform: [{ scale: press.scale }] }, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        onPressIn={press.onPressIn}
        onPressOut={press.onPressOut}
        style={surface}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}
