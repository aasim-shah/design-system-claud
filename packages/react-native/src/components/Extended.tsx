import { useEffect, useRef, useState, type ComponentRef, type ReactNode } from 'react';
import {
  Animated,
  Easing,
  LayoutAnimation,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { motion } from '@lumen/tokens';
import { useTheme } from '../theme/ThemeProvider.js';
import { Badge } from './Display.js';
import { Glyph } from './Glyph.js';
import { usePresence } from './Overlay.js';
import { Text } from './Text.js';
import { TextField, type TextFieldProps } from './TextField.js';

const animateLayout = () =>
  LayoutAnimation.configureNext(LayoutAnimation.create(motion.duration.base, 'easeInEaseOut', 'opacity'));

/* ------------------------------------------------------------ FormSection */

export interface FormSectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** A titled group of fields with consistent 16pt rhythm. */
export function FormSection({ title, description, children, style }: FormSectionProps) {
  return (
    <View style={[{ gap: 16 }, style]}>
      {(title || description) && (
        <View style={{ gap: 4 }}>
          {title && <Text variant="headline" accessibilityRole="header">{title}</Text>}
          {description && <Text variant="subheadline" color="secondary">{description}</Text>}
        </View>
      )}
      {children}
    </View>
  );
}

/* -------------------------------------------------------------- Accordion */

export interface AccordionItem {
  value: string;
  title: string;
  content: ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  type?: 'single' | 'multiple';
  defaultValue?: string[];
  style?: StyleProp<ViewStyle>;
}

export function Accordion({ items, type = 'single', defaultValue = [], style }: AccordionProps) {
  const { colors } = useTheme();
  const [open, setOpen] = useState<string[]>(defaultValue);
  return (
    <View style={style}>
      {items.map((item) => {
        const isOpen = open.includes(item.value);
        return (
          <View key={item.value} style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.separator.default }}>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ expanded: isOpen }}
              onPress={() => {
                animateLayout();
                setOpen(
                  isOpen ? open.filter((v) => v !== item.value) : type === 'single' ? [item.value] : [...open, item.value],
                );
              }}
              style={({ pressed }) => ({ minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, opacity: pressed ? 0.6 : 1 })}
            >
              <Text weight="medium" style={{ flex: 1 }}>{item.title}</Text>
              <Glyph name="chevron-down" size={14} weight={2} color={colors.label.tertiary} style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }} />
            </Pressable>
            {isOpen && (
              <View style={{ paddingBottom: 16 }}>
                {typeof item.content === 'string' ? <Text variant="subheadline" color="secondary">{item.content}</Text> : item.content}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

/* ------------------------------------------------------------------ Alert */

export interface AlertProps {
  tone?: 'neutral' | 'success' | 'warning' | 'danger';
  title?: string;
  children?: ReactNode;
  actions?: ReactNode;
  onDismiss?: () => void;
  style?: StyleProp<ViewStyle>;
}

/** Inline banner. Only the status dot carries color. */
export function Alert({ tone = 'neutral', title, children, actions, onDismiss, style }: AlertProps) {
  const { colors, radius } = useTheme();
  const dot = tone === 'neutral' ? colors.label.secondary : colors[tone].default;
  return (
    <View
      accessibilityRole={tone === 'danger' || tone === 'warning' ? 'alert' : 'summary'}
      style={[
        {
          flexDirection: 'row',
          gap: 12,
          padding: 16,
          borderRadius: radius.lg,
          backgroundColor: colors.fill.quaternary,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.separator.default,
        },
        style,
      ]}
    >
      <View style={{ width: 8, height: 8, borderRadius: 4, marginTop: 6, backgroundColor: dot }} />
      <View style={{ flex: 1, gap: 2 }}>
        {title && <Text variant="subheadline" weight="semibold">{title}</Text>}
        {typeof children === 'string' ? <Text variant="subheadline" color="secondary">{children}</Text> : children}
        {actions && <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>{actions}</View>}
      </View>
      {onDismiss && (
        <Pressable accessibilityRole="button" accessibilityLabel="Dismiss" hitSlop={10} onPress={onDismiss}>
          <Glyph name="close" size={12} weight={1.8} color={colors.label.secondary} />
        </Pressable>
      )}
    </View>
  );
}

/* ------------------------------------------------------------- EmptyState */

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  actions?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function EmptyState({ icon, title, description, actions, style }: EmptyStateProps) {
  const { colors } = useTheme();
  return (
    <View style={[{ alignItems: 'center', gap: 12, paddingVertical: 40, paddingHorizontal: 24 }, style]}>
      {icon && (
        <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: colors.fill.tertiary, alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
          {icon}
        </View>
      )}
      <Text variant="title3" align="center">{title}</Text>
      {description && <Text variant="subheadline" color="secondary" align="center">{description}</Text>}
      {actions && <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>{actions}</View>}
    </View>
  );
}

/* ------------------------------------------------------------------- Chip */

export interface ChipProps {
  label: string;
  selected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  onRemove?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Chip({ label, selected, onSelectedChange, onRemove, disabled, style }: ChipProps) {
  const { colors, opacity } = useTheme();
  const on = !!selected;
  const fg = on ? colors.accent.on : colors.label.primary;
  return (
    <Pressable
      accessibilityRole={onRemove ? 'text' : 'button'}
      accessibilityState={{ selected: on, disabled }}
      disabled={disabled || (!onSelectedChange && !onRemove)}
      onPress={() => (onRemove ? onRemove() : onSelectedChange?.(!on))}
      style={({ pressed }) => [
        {
          height: 32,
          paddingHorizontal: 12,
          borderRadius: 16,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          alignSelf: 'flex-start',
          backgroundColor: on ? colors.accent.default : onRemove ? colors.fill.tertiary : colors.background.primary,
          borderWidth: on || onRemove ? 0 : 1,
          borderColor: colors.separator.default,
          opacity: disabled ? opacity.disabled : pressed ? 0.7 : 1,
          transform: [{ scale: pressed ? 0.96 : 1 }],
        },
        style,
      ]}
    >
      {on && <Glyph name="check" size={12} weight={1.8} color={fg} />}
      <Text variant="subheadline" weight="medium" style={{ color: fg }}>{label}</Text>
      {onRemove && <Glyph name="close" size={10} weight={1.6} color={colors.label.secondary} />}
    </Pressable>
  );
}

export function ChipGroup({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, style]}>{children}</View>;
}

/* ---------------------------------------------------------------- Stepper */

export interface StepperProps {
  value?: number;
  defaultValue?: number;
  onValueChange?: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label: string;
  style?: StyleProp<ViewStyle>;
}

export function Stepper({ value, defaultValue = 0, onValueChange, min = 0, max = Infinity, step = 1, label, style }: StepperProps) {
  const { colors, radius } = useTheme();
  const [inner, setInner] = useState(defaultValue);
  const v = value ?? inner;
  const set = (n: number) => {
    const c = Math.min(max, Math.max(min, n));
    if (value === undefined) setInner(c);
    onValueChange?.(c);
  };
  const btn = (dir: 1 | -1) => {
    const disabled = dir < 0 ? v <= min : v >= max;
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${dir < 0 ? 'Decrease' : 'Increase'} ${label}`}
        disabled={disabled}
        onPress={() => set(v + dir * step)}
        style={({ pressed }) => ({ width: 44, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: radius.md, backgroundColor: pressed ? colors.fill.secondary : 'transparent' })}
      >
        <Glyph name={dir < 0 ? 'minus' : 'plus'} size={14} weight={2} color={disabled ? colors.label.quaternary : colors.label.primary} />
      </Pressable>
    );
  };
  return (
    <View
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityValue={{ now: v }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(e) => set(v + (e.nativeEvent.actionName === 'increment' ? step : -step))}
      style={[{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', borderRadius: radius.md, backgroundColor: colors.fill.tertiary }, style]}
    >
      {btn(-1)}
      <View style={{ minWidth: 36, paddingHorizontal: 4, borderLeftWidth: StyleSheet.hairlineWidth, borderRightWidth: StyleSheet.hairlineWidth, borderColor: colors.separator.default }}>
        <Text weight="medium" tabular align="center">{v}</Text>
      </View>
      {btn(1)}
    </View>
  );
}

/* ------------------------------------------------------------------ Steps */

export function Steps({ steps, current, style }: { steps: string[]; current: number; style?: StyleProp<ViewStyle> }) {
  const { colors } = useTheme();
  return (
    <View style={[{ flexDirection: 'row' }, style]}>
      {steps.map((label, i) => {
        const state = i < current ? 'complete' : i === current ? 'current' : 'upcoming';
        return (
          <View key={i} style={{ flex: 1, alignItems: 'center', gap: 8 }} accessibilityState={{ selected: state === 'current' }}>
            {i > 0 && (
              <View
                style={{
                  position: 'absolute',
                  top: 13,
                  right: '50%',
                  left: '-50%',
                  marginHorizontal: 20,
                  height: 1.5,
                  backgroundColor: i <= current ? colors.label.primary : colors.separator.default,
                }}
              />
            )}
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: state === 'complete' ? colors.accent.default : 'transparent',
                borderWidth: state === 'complete' ? 0 : 1.5,
                borderColor: state === 'current' ? colors.label.primary : colors.separator.default,
              }}
            >
              {state === 'complete' ? (
                <Glyph name="check" size={13} weight={2} color={colors.accent.on} />
              ) : (
                <Text variant="footnote" weight="semibold" color={state === 'current' ? 'primary' : 'tertiary'}>{i + 1}</Text>
              )}
            </View>
            <Text variant="footnote" weight="medium" color={state === 'current' ? 'primary' : 'secondary'} numberOfLines={1}>
              {label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

/* --------------------------------------------------------------- PinInput */

export interface PinInputProps {
  length?: number;
  value?: string;
  onValueChange?: (v: string) => void;
  onComplete?: (v: string) => void;
  mask?: boolean;
  error?: string;
  autoFocus?: boolean;
}

/** OTP / PIN entry. One hidden input drives the cells, so autofill from SMS works. */
export function PinInput({ length = 6, value, onValueChange, onComplete, mask, error, autoFocus }: PinInputProps) {
  const { colors, radius } = useTheme();
  const [inner, setInner] = useState('');
  const [focused, setFocused] = useState(false);
  const input = useRef<ComponentRef<typeof TextInput>>(null);
  const v = value ?? inner;
  return (
    <View style={{ gap: 6 }}>
      <Pressable onPress={() => input.current?.focus()} style={{ flexDirection: 'row', gap: 8 }} accessible={false}>
        {Array.from({ length }, (_, i) => {
          const active = focused && (i === v.length || (i === length - 1 && v.length === length));
          return (
            <View
              key={i}
              style={{
                width: 46,
                height: 54,
                borderRadius: radius.md,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: active ? colors.background.primary : colors.fill.tertiary,
                borderWidth: 1.5,
                borderColor: error ? colors.danger.default : active ? colors.accent.default : 'transparent',
              }}
            >
              <Text variant="title2">{v[i] ? (mask ? '•' : v[i]) : ''}</Text>
            </View>
          );
        })}
      </Pressable>
      <TextInput
        ref={input}
        value={v}
        autoFocus={autoFocus}
        maxLength={length}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete={Platform.OS === 'android' ? 'sms-otp' : 'one-time-code'}
        caretHidden
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChangeText={(t) => {
          const clean = t.replace(/[^0-9]/g, '').slice(0, length);
          if (value === undefined) setInner(clean);
          onValueChange?.(clean);
          if (clean.length === length) onComplete?.(clean);
        }}
        accessibilityLabel="Verification code"
        style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }}
      />
      {error && <Text variant="footnote" color="danger" style={{ paddingHorizontal: 4 }}>{error}</Text>}
    </View>
  );
}

/* ---------------------------------------------------------- PasswordField */

export function PasswordField(props: Omit<TextFieldProps, 'secureTextEntry' | 'trailing'>) {
  const [visible, setVisible] = useState(false);
  return (
    <TextField
      autoCapitalize="none"
      autoCorrect={false}
      textContentType="password"
      autoComplete="password"
      {...props}
      secureTextEntry={!visible}
      trailing={
        <Pressable accessibilityRole="button" hitSlop={8} onPress={() => setVisible((x) => !x)}>
          <Text variant="subheadline" weight="medium" color="secondary">{visible ? 'Hide' : 'Show'}</Text>
        </Pressable>
      }
    />
  );
}

/* ------------------------------------------------------------ ActionSheet */

export interface ActionSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  actions: { label: string; onSelect?: () => void; destructive?: boolean }[];
  cancelLabel?: string;
  bottomInset?: number;
}

export function ActionSheet({ open, onClose, title, message, actions, cancelLabel = 'Cancel', bottomInset = Platform.OS === 'ios' ? 34 : 12 }: ActionSheetProps) {
  const { colors, radius } = useTheme();
  const y = useRef(new Animated.Value(400)).current;
  const fade = useRef(new Animated.Value(0)).current;
  const mounted = usePresence(
    open,
    () => Animated.parallel([
      Animated.spring(y, { toValue: 0, ...motion.spring.gentle, useNativeDriver: true }),
      Animated.timing(fade, { toValue: 1, duration: motion.duration.base, useNativeDriver: true }),
    ]),
    () => Animated.parallel([
      Animated.timing(y, { toValue: 400, duration: motion.duration.base, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      Animated.timing(fade, { toValue: 0, duration: motion.duration.base, useNativeDriver: true }),
    ]),
  );
  if (!mounted) return null;

  const row = (label: string, onPress: () => void, opts: { destructive?: boolean; cancel?: boolean; first?: boolean } = {}) => (
    <Pressable
      key={label}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 56,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: pressed ? colors.fill.tertiary : 'transparent',
        borderTopWidth: opts.first ? 0 : StyleSheet.hairlineWidth,
        borderColor: colors.separator.default,
      })}
    >
      <Text
        variant="title3"
        weight={opts.cancel ? 'semibold' : 'regular'}
        style={{ color: opts.destructive ? colors.danger.default : colors.accent.default }}
      >
        {label}
      </Text>
    </Pressable>
  );

  const group = { borderRadius: radius.lg, backgroundColor: colors.background.elevated, overflow: 'hidden' as const };

  return (
    <Modal transparent visible statusBarTranslucent animationType="none" onRequestClose={onClose}>
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: colors.scrim, opacity: fade }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Dismiss" />
      </Animated.View>
      <View style={{ flex: 1, justifyContent: 'flex-end', paddingHorizontal: 8, paddingBottom: bottomInset }} pointerEvents="box-none">
        <Animated.View style={{ gap: 8, transform: [{ translateY: y }] }} accessibilityViewIsModal>
          <View style={group}>
            {(title || message) && (
              <View style={{ padding: 16, paddingBottom: 12, alignItems: 'center', gap: 2 }}>
                {title && <Text variant="footnote" weight="semibold" color="secondary" align="center">{title}</Text>}
                {message && <Text variant="footnote" color="secondary" align="center">{message}</Text>}
              </View>
            )}
            {actions.map((a, i) =>
              row(a.label, () => { a.onSelect?.(); onClose(); }, { destructive: a.destructive, first: i === 0 && !title && !message }),
            )}
          </View>
          <View style={group}>{row(cancelLabel, onClose, { cancel: true, first: true })}</View>
        </Animated.View>
      </View>
    </Modal>
  );
}

/* ----------------------------------------------------------------- TabBar */

export interface TabBarItem {
  value: string;
  label: string;
  icon: (color: string) => ReactNode;
  badge?: number;
}

export interface TabBarProps {
  items: TabBarItem[];
  value: string;
  onValueChange: (v: string) => void;
  bottomInset?: number;
  style?: StyleProp<ViewStyle>;
}

/** Bottom tab bar (use React Navigation's `tabBar` prop to plug it in). */
export function TabBar({ items, value, onValueChange, bottomInset = Platform.OS === 'ios' ? 28 : 8, style }: TabBarProps) {
  const { colors } = useTheme();
  return (
    <View
      accessibilityRole="tabbar"
      style={[
        {
          flexDirection: 'row',
          paddingTop: 6,
          paddingBottom: bottomInset,
          backgroundColor: colors.background.primary,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderColor: colors.separator.default,
        },
        style,
      ]}
    >
      {items.map((t) => {
        const on = t.value === value;
        const c = on ? colors.label.primary : colors.label.tertiary;
        return (
          <Pressable
            key={t.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            accessibilityLabel={t.label}
            onPress={() => onValueChange(t.value)}
            style={{ flex: 1, alignItems: 'center', gap: 2, paddingVertical: 4 }}
          >
            <View>
              {t.icon(c)}
              {!!t.badge && <Badge variant="solid" tone="danger" size="sm" count={t.badge} style={{ position: 'absolute', top: -4, left: 14 }} />}
            </View>
            <Text style={{ fontSize: 10, lineHeight: 12, fontWeight: '500', color: c }}>{t.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/* ------------------------------------------------------------------- Tabs */

export interface TabsProps {
  items: { value: string; label: string }[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  /** Scrollable when there are many tabs. */
  scrollable?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Underline tabs with an animated indicator. */
export function Tabs({ items, value, defaultValue, onValueChange, scrollable, style }: TabsProps) {
  const { colors } = useTheme();
  const [inner, setInner] = useState(defaultValue ?? items[0]?.value);
  const current = value ?? inner;
  const layouts = useRef<Record<string, { x: number; width: number }>>({});
  const x = useRef(new Animated.Value(0)).current;
  const w = useRef(new Animated.Value(0)).current;
  const [ready, setReady] = useState(false);

  const moveTo = (v: string | undefined, animate = true) => {
    const l = v ? layouts.current[v] : undefined;
    if (!l) return;
    if (!animate) {
      x.setValue(l.x);
      w.setValue(l.width);
      return;
    }
    Animated.parallel([
      Animated.spring(x, { toValue: l.x, ...motion.spring.smooth, useNativeDriver: false }),
      Animated.spring(w, { toValue: l.width, ...motion.spring.smooth, useNativeDriver: false }),
    ]).start();
  };

  useEffect(() => {
    if (ready) moveTo(current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, ready]);

  const Row = scrollable ? ScrollView : View;
  return (
    <View style={[{ borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.separator.default }, style]}>
      <Row
        {...(scrollable ? { horizontal: true, showsHorizontalScrollIndicator: false } : {})}
        style={scrollable ? undefined : { flexDirection: 'row' }}
        contentContainerStyle={scrollable ? { gap: 24 } : undefined}
      >
        <View style={{ flexDirection: 'row', gap: 24 }} accessibilityRole="tablist">
          {items.map((t) => {
            const on = t.value === current;
            return (
              <Pressable
                key={t.value}
                accessibilityRole="tab"
                accessibilityState={{ selected: on }}
                onLayout={(e) => {
                  layouts.current[t.value] = e.nativeEvent.layout;
                  if (Object.keys(layouts.current).length === items.length && !ready) {
                    moveTo(current, false);
                    setReady(true);
                  }
                }}
                onPress={() => {
                  if (value === undefined) setInner(t.value);
                  onValueChange?.(t.value);
                }}
                style={{ height: 44, justifyContent: 'center' }}
              >
                <Text variant="subheadline" weight="medium" color={on ? 'primary' : 'secondary'}>{t.label}</Text>
              </Pressable>
            );
          })}
        </View>
        <Animated.View style={{ position: 'absolute', bottom: 0, left: x, width: w, height: 2, borderRadius: 1, backgroundColor: colors.label.primary }} />
      </Row>
    </View>
  );
}

/* ------------------------------------------------------------ Breadcrumbs */

export function Breadcrumbs({ items, style }: { items: { label: string; onPress?: () => void }[]; style?: StyleProp<ViewStyle> }) {
  const { colors } = useTheme();
  return (
    <View style={[{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 4 }, style]} accessibilityRole="none">
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Pressable disabled={last || !item.onPress} onPress={item.onPress} accessibilityRole={last ? 'text' : 'link'} hitSlop={6}>
              <Text variant="subheadline" weight={last ? 'medium' : 'regular'} color={last ? 'primary' : 'secondary'} numberOfLines={1}>
                {item.label}
              </Text>
            </Pressable>
            {!last && <Glyph name="chevron-right" size={10} weight={1.6} color={colors.label.tertiary} />}
          </View>
        );
      })}
    </View>
  );
}

