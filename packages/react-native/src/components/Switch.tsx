import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, type StyleProp, type ViewStyle } from 'react-native';
import { motion } from '@lumen/tokens';
import { useTheme } from '../theme/ThemeProvider.js';

export interface SwitchProps {
  value?: boolean;
  defaultValue?: boolean;
  onValueChange?: (value: boolean) => void;
  /** `success` (green) or `accent`. @default 'success' */
  tone?: 'success' | 'accent';
  size?: 'sm' | 'md';
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

/** Pixel-consistent switch on iOS and Android (51×31, stretchy thumb). */
export function Switch({
  value,
  defaultValue = false,
  onValueChange,
  tone = 'success',
  size = 'md',
  disabled,
  accessibilityLabel,
  style,
}: SwitchProps) {
  const { colors, opacity } = useTheme();
  const [inner, setInner] = useState(defaultValue);
  const on = value ?? inner;
  const progress = useRef(new Animated.Value(on ? 1 : 0)).current;
  const stretch = useRef(new Animated.Value(0)).current;

  const W = size === 'sm' ? 40 : 51;
  const H = size === 'sm' ? 24 : 31;
  const pad = 2;
  const thumb = H - pad * 2;
  const extra = 6;

  useEffect(() => {
    Animated.spring(progress, { toValue: on ? 1 : 0, ...motion.spring.smooth, useNativeDriver: false }).start();
  }, [on, progress]);

  const toggle = () => {
    if (value === undefined) setInner(!on);
    onValueChange?.(!on);
  };

  const stretchTo = (v: number) =>
    Animated.timing(stretch, { toValue: v, duration: motion.duration.fast, useNativeDriver: false }).start();

  const width = stretch.interpolate({ inputRange: [0, 1], outputRange: [thumb, thumb + extra] });
  const travel = W - thumb - pad * 2;
  const left = Animated.add(
    progress.interpolate({ inputRange: [0, 1], outputRange: [pad, pad + travel] }),
    Animated.multiply(Animated.multiply(stretch, progress), -extra),
  );

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: on, disabled }}
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      onPress={toggle}
      onPressIn={() => stretchTo(1)}
      onPressOut={() => stretchTo(0)}
      hitSlop={8}
      style={[{ opacity: disabled ? opacity.disabled : 1 }, style]}
    >
      <Animated.View
        style={{
          width: W,
          height: H,
          borderRadius: H / 2,
          backgroundColor: progress.interpolate({
            inputRange: [0, 1],
            outputRange: [colors.fill.primary, tone === 'accent' ? colors.accent.default : colors.success.default],
          }),
        }}
      >
        <Animated.View
          style={{
            position: 'absolute',
            top: pad,
            left,
            width,
            height: thumb,
            borderRadius: thumb / 2,
            backgroundColor: '#FFFFFF',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 3,
          }}
        />
      </Animated.View>
    </Pressable>
  );
}
