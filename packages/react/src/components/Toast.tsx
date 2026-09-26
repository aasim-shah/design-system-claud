'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { flag } from '../utils.js';
import { AlertIcon, CheckCircleIcon, InfoIcon, XCircleIcon } from './Icon.js';

export type ToastTone = 'neutral' | 'success' | 'danger' | 'warning' | 'info';

export interface ToastOptions {
  title: ReactNode;
  description?: ReactNode;
  tone?: ToastTone;
  /** Custom leading icon (overrides the tone icon). */
  icon?: ReactNode;
  /** Inline action, e.g. `<Button variant="plain" size="sm">Undo</Button>`. */
  action?: ReactNode;
  /** ms before auto-dismiss. `Infinity` to keep. @default 3200 */
  duration?: number;
}

interface ToastItem extends ToastOptions {
  id: number;
  closing?: boolean;
}

interface ToastApi {
  show: (options: ToastOptions | string) => number;
  success: (title: ReactNode, options?: Omit<ToastOptions, 'title' | 'tone'>) => number;
  error: (title: ReactNode, options?: Omit<ToastOptions, 'title' | 'tone'>) => number;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

const toneIcon: Record<ToastTone, ReactNode> = {
  neutral: null,
  success: <CheckCircleIcon />,
  danger: <XCircleIcon />,
  warning: <AlertIcon />,
  info: <InfoIcon />,
};

export interface ToastProviderProps {
  children: ReactNode;
  position?: 'top' | 'bottom';
  /** Max toasts visible at once. @default 3 */
  limit?: number;
}

export function ToastProvider({ children, position = 'top', limit = 3 }: ToastProviderProps) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const counter = useRef(0);
  const timers = useRef(new Map<number, number>());

  useEffect(() => {
    setMounted(true);
    const t = timers.current;
    return () => t.forEach((id) => window.clearTimeout(id));
  }, []);

  const remove = useCallback((id: number) => {
    setItems((list) => list.filter((t) => t.id !== id));
  }, []);

  const dismiss = useCallback(
    (id: number) => {
      window.clearTimeout(timers.current.get(id));
      timers.current.delete(id);
      setItems((list) => list.map((t) => (t.id === id ? { ...t, closing: true } : t)));
      window.setTimeout(() => remove(id), 260);
    },
    [remove],
  );

  const show = useCallback(
    (opts: ToastOptions | string) => {
      const options = typeof opts === 'string' ? { title: opts } : opts;
      const id = ++counter.current;
      setItems((list) => [...list, { ...options, id }].slice(-limit));
      const duration = options.duration ?? 3200;
      if (Number.isFinite(duration)) timers.current.set(id, window.setTimeout(() => dismiss(id), duration));
      return id;
    },
    [dismiss, limit],
  );

  const api = useMemo<ToastApi>(
    () => ({
      show,
      dismiss,
      success: (title, o) => show({ ...o, title, tone: 'success' }),
      error: (title, o) => show({ ...o, title, tone: 'danger' }),
    }),
    [show, dismiss],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      {mounted &&
        createPortal(
          <div className="lm-toaster" data-position={position} role="region" aria-label="Notifications">
            {items.map((t) => {
              const tone = t.tone ?? 'neutral';
              const icon = t.icon ?? toneIcon[tone];
              return (
                <div
                  key={t.id}
                  className="lm-toast"
                  role={tone === 'danger' ? 'alert' : 'status'}
                  aria-live={tone === 'danger' ? 'assertive' : 'polite'}
                  data-tone={tone}
                  data-closing={flag(t.closing)}
                  onClick={() => dismiss(t.id)}
                >
                  {icon && <span className="lm-toast__icon">{icon}</span>}
                  <span className="lm-toast__text">
                    <span>{t.title}</span>
                    {t.description && <span className="lm-toast__description">{t.description}</span>}
                  </span>
                  {t.action && (
                    <span className="lm-toast__action" onClick={(e) => e.stopPropagation()}>
                      {t.action}
                    </span>
                  )}
                </div>
              );
            })}
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  );
}

/** `const toast = useToast(); toast.success('Saved')` */
export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('[lumen] useToast() must be used inside <ToastProvider>.');
  return ctx;
}
