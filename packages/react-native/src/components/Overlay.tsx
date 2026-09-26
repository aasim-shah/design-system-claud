import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { elevation, motion } from '@lumen/tokens';
import { useTheme } from '../theme/ThemeProvider.js';
import { IconButton } from './Button.js';
import { Glyph } from './Glyph.js';
import { Text } from './Text.js';

/** Keeps a Modal mounted until its exit animation has finished. */
export function usePresence(open: boolean, enter: () => Animated.CompositeAnimation, exit: () => Animated.CompositeAnimation) {
  const [mounted, setMounted] = useState(open);
  useEffect(() => {
    if (open) {
      setMounted(true);
      enter().start();
    } else if (mounted) {
      exit().start(({ finished }) => finished && setMounted(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  return mounted;
}

/* ------------------------------------------------------------------ Sheet */

export interface SheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  headerLeading?: ReactNode;
  /** Defaults to a close button. Pass `null` to hide. */
  headerTrailing?: ReactNode;
  children?: ReactNode;
  /** Swipe down / tap backdrop to dismiss. @default true */
  dismissible?: boolean;
  /** Max height as a fraction of the screen. @default 0.92 */
  maxHeight?: number;
  /** Bottom padding (e.g. safe-area inset). @default 34 on iOS */
  bottomInset?: number;
  contentStyle?: StyleProp<ViewStyle>;
}

export function Sheet({
  open,
  onClose,
  title,
  headerLeading,
  headerTrailing,
  children,
  dismissible = true,
  maxHeight = 0.92,
  bottomInset = Platform.OS === 'ios' ? 34 : 16,
  contentStyle,
}: SheetProps) {
  const { colors, radius, scheme } = useTheme();
  const screen = Dimensions.get('window').height;
  const y = useRef(new Animated.Value(screen)).current;
  const fade = useRef(new Animated.Value(0)).current;

  const mounted = usePresence(
    open,
    () =>
      Animated.parallel([
        Animated.spring(y, { toValue: 0, ...motion.spring.gentle, useNativeDriver: true }),
        Animated.timing(fade, { toValue: 1, duration: motion.duration.slow, useNativeDriver: true }),
      ]),
    () =>
      Animated.parallel([
        Animated.timing(y, { toValue: screen, duration: motion.duration.base, easing: Easing.bezier(...motion.easing.accelerate), useNativeDriver: true }),
        Animated.timing(fade, { toValue: 0, duration: motion.duration.base, useNativeDriver: true }),
      ]),
  );

  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Swipe the header down to dismiss.
  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => dismissible && g.dy > 6 && Math.abs(g.dy) > Math.abs(g.dx),
      onPanResponderMove: (_, g) => y.setValue(Math.max(0, g.dy)),
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120 || g.vy > 1.1) onCloseRef.current();
        else Animated.spring(y, { toValue: 0, ...motion.spring.smooth, useNativeDriver: true }).start();
      },
    }),
  ).current;

  if (!mounted) return null;

  return (
    <Modal transparent visible statusBarTranslucent animationType="none" onRequestClose={onClose}>
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: colors.scrim, opacity: fade }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={dismissible ? onClose : undefined} accessibilityLabel="Dismiss" />
      </Animated.View>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, justifyContent: 'flex-end' }} pointerEvents="box-none">
        <Animated.View
          accessibilityViewIsModal
          style={{
            maxHeight: screen * maxHeight,
            borderTopLeftRadius: radius['2xl'],
            borderTopRightRadius: radius['2xl'],
            backgroundColor: colors.background.elevated,
            paddingBottom: bottomInset,
            transform: [{ translateY: y }],
            ...elevation.native(4, scheme),
          }}
        >
          <View {...pan.panHandlers}>
            <View style={{ alignItems: 'center', paddingTop: 6 }}>
              <View style={{ width: 36, height: 5, borderRadius: 3, backgroundColor: colors.label.quaternary }} />
            </View>
            <View style={{ minHeight: 52, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 }}>
              <View style={{ flex: 1, alignItems: 'flex-start' }}>{headerLeading}</View>
              {title ? (
                <Text variant="headline" numberOfLines={1} accessibilityRole="header">
                  {title}
                </Text>
              ) : null}
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                {headerTrailing === undefined ? (
                  <IconButton
                    label="Close"
                    size="sm"
                    onPress={onClose}
                    icon={<Glyph name="close" size={12} weight={2} color={colors.label.secondary} />}
                  />
                ) : (
                  headerTrailing
                )}
              </View>
            </View>
          </View>
          <View style={[{ paddingHorizontal: 20, paddingBottom: 8 }, contentStyle]}>{children}</View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

/* ----------------------------------------------------------------- Dialog */

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: ReactNode;
  /** Buttons. Laid out side by side (2) or stacked (3+). */
  actions?: ReactNode;
  dismissible?: boolean;
}

export function Dialog({ open, onClose, title, description, children, actions, dismissible = true }: DialogProps) {
  const { colors, radius, scheme } = useTheme();
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1.08)).current;

  const mounted = usePresence(
    open,
    () =>
      Animated.parallel([
        Animated.timing(fade, { toValue: 1, duration: motion.duration.base, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, ...motion.spring.snappy, useNativeDriver: true }),
      ]),
    () =>
      Animated.parallel([
        Animated.timing(fade, { toValue: 0, duration: motion.duration.fast, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 0.96, duration: motion.duration.fast, useNativeDriver: true }),
      ]),
  );
  useEffect(() => {
    if (open) scale.setValue(1.08);
  }, [open, scale]);

  if (!mounted) return null;

  const count = Array.isArray(actions) ? actions.length : 1;

  return (
    <Modal transparent visible statusBarTranslucent animationType="none" onRequestClose={onClose}>
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: colors.scrim, opacity: fade }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={dismissible ? onClose : undefined} accessibilityLabel="Dismiss" />
      </Animated.View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }} pointerEvents="box-none">
        <Animated.View
          accessibilityViewIsModal
          style={{
            width: '100%',
            maxWidth: 320,
            borderRadius: radius.xl,
            backgroundColor: colors.background.elevated,
            padding: 20,
            gap: 16,
            opacity: fade,
            transform: [{ scale }],
            ...elevation.native(4, scheme),
          }}
        >
          <View style={{ gap: 6, alignItems: 'center' }}>
            {title && (
              <Text variant="headline" align="center" accessibilityRole="header">
                {title}
              </Text>
            )}
            {description && (
              <Text variant="subheadline" color="secondary" align="center">
                {description}
              </Text>
            )}
          </View>
          {children}
          {actions && <View style={{ flexDirection: count > 2 ? 'column' : 'row', gap: 8 }}>{actions}</View>}
        </Animated.View>
      </View>
    </Modal>
  );
}
