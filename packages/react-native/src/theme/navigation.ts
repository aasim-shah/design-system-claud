import type { LumenTheme } from './ThemeProvider.js';

/**
 * Adapter for React Navigation's `<NavigationContainer theme={...}>`.
 *
 *   const theme = useTheme();
 *   <NavigationContainer theme={navigationTheme(theme)}>
 */
export function navigationTheme(theme: LumenTheme) {
  const c = theme.colors;
  return {
    dark: theme.scheme === 'dark',
    colors: {
      primary: c.accent.default,
      background: c.background.grouped,
      card: c.background.primary,
      text: c.label.primary,
      border: c.separator.default,
      notification: c.danger.default,
    },
    fonts: {
      regular: { fontFamily: 'System', fontWeight: '400' as const },
      medium: { fontFamily: 'System', fontWeight: '500' as const },
      bold: { fontFamily: 'System', fontWeight: '600' as const },
      heavy: { fontFamily: 'System', fontWeight: '700' as const },
    },
  };
}
