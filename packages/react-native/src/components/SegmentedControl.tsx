import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Animated, Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import { motion } from '@lumen/tokens';
import { useTheme } from '../theme/ThemeProvider.js';
import { Text } from './Text.js';

export interface SegmentedOption<T extends string = string> {
  value: T;
  label: ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps<T extends string = string> {
  options: ReadonlyArray<SegmentedOption<T>>;
  value?: T;
  defaultValue?: T;
  onValueChange?: (value: T) => void;
  size?: 'md' | 'lg';
  style?: StyleProp<ViewStyle>;
}

export function SegmentedControl<T extends string = string>({
  options,
  value,
  defaultValue,
  onValueChange,
  size = 'md',
  style,
}: SegmentedControlProps<T>) {
  const { colors, palette, scheme } = useTheme();
  const [inner, setInner] = useState<T | undefined>(defaultValue ?? options[0]?.value);
  const current = value ?? inner;
  const index = Math.max(0, options.findIndex((o) => o.value === current));
  const [width, setWidth] = useState(0);
  const x = useRef(new Animated.Value(0)).current;
  const segment = width > 0 ? (width - 4) / options.length : 0;

  useEffect(() => {
    Animated.spring(x, { toValue: index * segment, ...motion.spring.smooth, useNativeDriver: true }).start();
  }, [index, segment, x]);

  const H = size === 'lg' ? 40 : 32;

  return (
    <View
      accessibilityRole="tablist"
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      style={[
        { height: H, padding: 2, borderRadius: size === 'lg' ? 11 : 9, backgroundColor: colors.fill.tertiary, flexDirection: 'row' },
        style,
      ]}
    >
      {segment > 0 && (
        <Animated.View
          style={{
            position: 'absolute',
            top: 2,
            left: 2,
            bottom: 2,
            width: segment,
            borderRadius: size === 'lg' ? 9 : 7,
            backgroundColor: colors.thumb,
            transform: [{ translateX: x }],
            shadowColor: palette.black,
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: scheme === 'dark' ? 0 : 0.12,
            shadowRadius: 4,
            elevation: 2,
          }}
        />
      )}
      {options.map((o, i) => {
        const selected = i === index;
        return (
          <Pressable
            key={o.value}
            accessibilityRole="tab"
            accessibilityState={{ selected, disabled: o.disabled }}
            disabled={o.disabled}
            onPress={() => {
              if (value === undefined) setInner(o.value);
              onValueChange?.(o.value);
            }}
            style={({ pressed }) => ({
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 8,
              opacity: o.disabled ? 0.38 : pressed && !selected ? 0.55 : 1,
            })}
          >
            {typeof o.label === 'string' ? (
              <Text variant={size === 'lg' ? 'subheadline' : 'footnote'} weight={selected ? 'semibold' : 'medium'} numberOfLines={1}>
                {o.label}
              </Text>
            ) : (
              o.label
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
