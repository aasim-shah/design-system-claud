'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createThemeCss, type ColorScheme, type ThemeOverrides } from '@lumen/tokens';

export type ColorSchemePreference = ColorScheme | 'system';

interface ThemeContextValue {
  /** What the user chose. */
  preference: ColorSchemePreference;
  /** What is actually rendered. */
  scheme: ColorScheme;
  setPreference: (p: ColorSchemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps extends ThemeOverrides {
  children: ReactNode;
  /** @default 'system' */
  defaultScheme?: ColorSchemePreference;
  /** Controlled preference. */
  scheme?: ColorSchemePreference;
  onSchemeChange?: (p: ColorSchemePreference) => void;
  /** Persist the preference in localStorage under this key. @default 'lumen-scheme' (false to disable) */
  storageKey?: string | false;
}

function systemScheme(): ColorScheme {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Optional. Lumen styles follow the OS appearance with zero JS; add this
 * provider when you want a user-facing light/dark toggle or a brand accent.
 * It sets `data-theme` on <html> so portals (dialogs, toasts) are themed too.
 */
export function ThemeProvider({
  children,
  defaultScheme = 'system',
  scheme: controlled,
  onSchemeChange,
  storageKey = 'lumen-scheme',
  accent,
  colors,
}: ThemeProviderProps) {
  const [inner, setInner] = useState<ColorSchemePreference>(defaultScheme);
  const [system, setSystem] = useState<ColorScheme>('light');
  const preference = controlled ?? inner;

  useEffect(() => {
    if (storageKey && controlled === undefined) {
      try {
        const saved = localStorage.getItem(storageKey) as ColorSchemePreference | null;
        if (saved === 'light' || saved === 'dark' || saved === 'system') setInner(saved);
      } catch {}
    }
    setSystem(systemScheme());
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    const onChange = () => setSystem(systemScheme());
    mq?.addEventListener?.('change', onChange);
    return () => mq?.removeEventListener?.('change', onChange);
  }, [storageKey, controlled]);

  const scheme = preference === 'system' ? system : preference;

  // Only touch data-theme once the user makes an explicit choice, and only
  // remove it again if we were the ones who set it.
  const ownsAttr = useRef(false);
  useEffect(() => {
    const root = document.documentElement;
    if (preference === 'system') {
      if (ownsAttr.current) root.removeAttribute('data-theme');
      ownsAttr.current = false;
    } else {
      root.setAttribute('data-theme', preference);
      ownsAttr.current = true;
    }
  }, [preference]);

  const css = useMemo(
    () => (accent || colors ? createThemeCss({ accent, colors }, { includeStatic: false }) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(accent), JSON.stringify(colors)],
  );

  const value = useMemo<ThemeContextValue>(
    () => ({
      preference,
      scheme,
      setPreference: (p) => {
        if (controlled === undefined) setInner(p);
        if (storageKey) {
          try {
            localStorage.setItem(storageKey, p);
          } catch {}
        }
        onSchemeChange?.(p);
      },
    }),
    [preference, scheme, controlled, storageKey, onSchemeChange],
  );

  return (
    <ThemeContext.Provider value={value}>
      {css && <style data-lumen-theme="" dangerouslySetInnerHTML={{ __html: css }} />}
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return { preference: 'system', scheme: systemScheme(), setPreference: () => {} };
  }
  return ctx;
}

/**
 * Inline script for Next.js `<head>` that applies the saved scheme before
 * first paint (prevents a light→dark flash). Render in app/layout.tsx.
 */
export function ThemeScript({ storageKey = 'lumen-scheme' }: { storageKey?: string }) {
  const code = `try{var s=localStorage.getItem(${JSON.stringify(storageKey)});if(s==='light'||s==='dark')document.documentElement.setAttribute('data-theme',s)}catch(e){}`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
