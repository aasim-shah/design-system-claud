import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Animated, Platform, Pressable, StatusBar, View } from 'react-native';
import { elevation, motion } from '@lumen/tokens';
import { useTheme } from '../theme/ThemeProvider.js';
import { Glyph } from './Glyph.js';
import { Text } from './Text.js';

export type ToastTone = 'neutral' | 'success' | 'danger' | 'warning' | 'info';

export interface ToastOptions {
  title: string;
  description?: string;
  tone?: ToastTone;
  icon?: ReactNode;
  /** ms. @default 3200 */
  duration?: number;
}

interface ToastApi {
  show: (o: ToastOptions | string) => void;
  success: (title: string, o?: Omit<ToastOptions, 'title' | 'tone'>) => void;
  error: (title: string, o?: Omit<ToastOptions, 'title' | 'tone'>) => void;
  dismiss: () => void;
}

const ToastContext = createContext<ToastApi | null>(null);

export interface ToastProviderProps {
  children: ReactNode;
  /** Distance from the top edge (safe-area). @default 54 on iOS */
  topInset?: number;
}

/** One-at-a-time, HUD-style pill that drops in from the top. */
export function ToastProvider({ children, topInset }: ToastProviderProps) {
  const theme = useTheme();
  const { colors, scheme } = theme;
  const [toast, setToast] = useState<ToastOptions | null>(null);
  const y = useRef(new Animated.Value(-120)).current;
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const top = topInset ?? (Platform.OS === 'ios' ? 54 : (StatusBar.currentHeight ?? 24) + 8);

  const dismiss = useCallback(() => {
    clearTimeout(timer.current);
    Animated.timing(y, { toValue: -120, duration: motion.duration.base, useNativeDriver: true }).start(({ finished }) => {
      if (finished) setToast(null);
    });
  }, [y]);

  const show = useCallback(
    (o: ToastOptions | string) => {
      const opts = typeof o === 'string' ? { title: o } : o;
      clearTimeout(timer.current);
      setToast(opts);
      y.setValue(-120);
      Animated.spring(y, { toValue: 0, ...motion.spring.smooth, useNativeDriver: true }).start();
      timer.current = setTimeout(dismiss, opts.duration ?? 3200);
    },
    [y, dismiss],
  );

  useEffect(() => () => clearTimeout(timer.current), []);

  const api = useMemo<ToastApi>(
    () => ({
      show,
      dismiss,
      success: (title, o) => show({ ...o, title, tone: 'success' }),
      error: (title, o) => show({ ...o, title, tone: 'danger' }),
    }),
    [show, dismiss],
  );

  const toneColor: Record<ToastTone, string> = {
    neutral: colors.label.primary,
    success: colors.success.default,
    danger: colors.danger.default,
    warning: colors.warning.default,
    info: colors.accent.default,
  };

  const tone = toast?.tone ?? 'neutral';
  const icon =
    toast?.icon ??
    (tone === 'success' ? (
      <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: toneColor.success, alignItems: 'center', justifyContent: 'center' }}>
        <Glyph name="check" size={12} weight={2} color={theme.palette.white} />
      </View>
    ) : tone === 'danger' ? (
      <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: toneColor.danger, alignItems: 'center', justifyContent: 'center' }}>
        <Glyph name="close" size={11} weight={2} color={theme.palette.white} />
      </View>
    ) : null);

  return (
    <ToastContext.Provider value={api}>
      {children}
      {toast && (
        <Animated.View
          pointerEvents="box-none"
          style={{ position: 'absolute', top, left: 16, right: 16, alignItems: 'center', transform: [{ translateY: y }] }}
        >
          <Pressable
            onPress={dismiss}
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              minHeight: 48,
              maxWidth: 420,
              paddingLeft: icon ? 14 : 20,
              paddingRight: 20,
              paddingVertical: 8,
              borderRadius: 999,
              backgroundColor: colors.background.elevated,
              borderWidth: scheme === 'dark' ? 0.5 : 0,
              borderColor: colors.separator.default,
              ...elevation.native(3, scheme),
            }}
          >
            {icon}
            <View style={{ flexShrink: 1 }}>
              <Text variant="subheadline" weight="semibold" numberOfLines={2}>
                {toast.title}
              </Text>
              {toast.description && (
                <Text variant="footnote" color="secondary" numberOfLines={2}>
                  {toast.description}
                </Text>
              )}
            </View>
          </Pressable>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('[lumen] useToast() must be used inside <ToastProvider>.');
  return ctx;
}
