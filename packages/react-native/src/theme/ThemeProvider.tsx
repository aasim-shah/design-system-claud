import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { createTheme, type ColorScheme, type Theme, type ThemeOverrides } from '@lumen/tokens';

export type ColorSchemePreference = ColorScheme | 'system';

export interface LumenTheme extends Theme {
  preference: ColorSchemePreference;
  setPreference: (p: ColorSchemePreference) => void;
}

const ThemeContext = createContext<LumenTheme | null>(null);

export interface ThemeProviderProps extends ThemeOverrides {
  children: ReactNode;
  /** Follow the OS by default. */
  defaultScheme?: ColorSchemePreference;
  /** Controlled preference (e.g. loaded from AsyncStorage). */
  scheme?: ColorSchemePreference;
  onSchemeChange?: (p: ColorSchemePreference) => void;
}

/**
 * Provides the resolved Lumen theme. Follows the system appearance and
 * re-renders automatically when the user switches light / dark.
 */
export function ThemeProvider({
  children,
  defaultScheme = 'system',
  scheme: controlled,
  onSchemeChange,
  accent,
  colors,
}: ThemeProviderProps) {
  const system = useColorScheme();
  const [inner, setInner] = useState<ColorSchemePreference>(defaultScheme);
  const preference = controlled ?? inner;
  const resolved: ColorScheme = preference === 'system' ? (system === 'dark' ? 'dark' : 'light') : preference;

  const value = useMemo<LumenTheme>(
    () => ({
      ...createTheme(resolved, { accent, colors }),
      preference,
      setPreference: (p) => {
        if (controlled === undefined) setInner(p);
        onSchemeChange?.(p);
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [resolved, preference, controlled, onSchemeChange, JSON.stringify(accent), JSON.stringify(colors)],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

const fallback: Record<ColorScheme, LumenTheme> = {
  light: { ...createTheme('light'), preference: 'system', setPreference: () => {} },
  dark: { ...createTheme('dark'), preference: 'system', setPreference: () => {} },
};

/** Access the current theme. Works without a provider (follows the OS). */
export function useTheme(): LumenTheme {
  const ctx = useContext(ThemeContext);
  const system = useColorScheme();
  return ctx ?? fallback[system === 'dark' ? 'dark' : 'light'];
}

/**
 * Memoised, theme-aware StyleSheet factory.
 *
 *   const useStyles = makeStyles((t) => ({ box: { backgroundColor: t.colors.background.primary } }));
 *   const styles = useStyles();
 */
export function makeStyles<T>(factory: (theme: LumenTheme) => T): () => T {
  return function useStyles() {
    const theme = useTheme();
    return useMemo(() => factory(theme), [theme]);
  };
}
