import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Animated, Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import { motion } from '@lumen/tokens';
import { useTheme } from '../theme/ThemeProvider.js';
import { Glyph } from './Glyph.js';
import { Text } from './Text.js';

export interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: ReactNode;
  description?: ReactNode;
  /** `circle` works great for to-do style lists. */
  shape?: 'square' | 'circle';
  /** Render as a radio (circle with dot). */
  radio?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Checkbox({
  checked,
  defaultChecked = false,
  onCheckedChange,
  label,
  description,
  shape = 'square',
  radio,
  disabled,
  style,
}: CheckboxProps) {
  const { colors, opacity } = useTheme();
  const [inner, setInner] = useState(defaultChecked);
  const on = checked ?? inner;
  const anim = useRef(new Animated.Value(on ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(anim, { toValue: on ? 1 : 0, ...motion.spring.snappy, useNativeDriver: true }).start();
  }, [on, anim]);

  const toggle = () => {
    const next = radio ? true : !on;
    if (checked === undefined) setInner(next);
    onCheckedChange?.(next);
  };

  const round = radio || shape === 'circle';

  return (
    <Pressable
      accessibilityRole={radio ? 'radio' : 'checkbox'}
      accessibilityState={{ checked: on, disabled }}
      disabled={disabled}
      onPress={toggle}
      hitSlop={6}
      style={[{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, opacity: disabled ? opacity.disabled : 1 }, style]}
    >
      <View
        style={{
          width: 22,
          height: 22,
          marginTop: 0,
          borderRadius: round ? 11 : 7,
          borderWidth: on ? 0 : 1.5,
          borderColor: colors.label.tertiary,
          backgroundColor: on ? colors.accent.default : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Animated.View style={{ transform: [{ scale: anim }], opacity: anim }}>
          {radio ? (
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent.on }} />
          ) : (
            <Glyph name="check" size={14} weight={2.2} color={colors.accent.on} />
          )}
        </Animated.View>
      </View>
      {(label || description) && (
        <View style={{ flex: 1, gap: 2 }}>
          {typeof label === 'string' ? <Text>{label}</Text> : label}
          {typeof description === 'string' ? (
            <Text variant="footnote" color="secondary">
              {description}
            </Text>
          ) : (
            description
          )}
        </View>
      )}
    </Pressable>
  );
}

export interface RadioGroupProps<T extends string> {
  options: ReadonlyArray<{ value: T; label: ReactNode; description?: ReactNode; disabled?: boolean }>;
  value?: T;
  defaultValue?: T;
  onValueChange?: (value: T) => void;
  direction?: 'row' | 'column';
  style?: StyleProp<ViewStyle>;
}

export function RadioGroup<T extends string>({ options, value, defaultValue, onValueChange, direction = 'column', style }: RadioGroupProps<T>) {
  const [inner, setInner] = useState<T | undefined>(defaultValue);
  const current = value ?? inner;
  return (
    <View accessibilityRole="radiogroup" style={[{ flexDirection: direction, gap: direction === 'row' ? 20 : 12, flexWrap: 'wrap' }, style]}>
      {options.map((o) => (
        <Checkbox
          key={o.value}
          radio
          label={o.label}
          description={o.description}
          disabled={o.disabled}
          checked={current === o.value}
          onCheckedChange={() => {
            if (value === undefined) setInner(o.value);
            onValueChange?.(o.value);
          }}
        />
      ))}
    </View>
  );
}
