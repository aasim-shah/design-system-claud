// app/layout.tsx — Next.js App Router
import '@lumen/react/styles.css';
import type { ReactNode } from 'react';
import { ThemeProvider, ThemeScript, ToastProvider } from '@lumen/react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-brand="orange" suppressHydrationWarning>
      <head>
        {/* Applies the saved light/dark choice before first paint (no flash). */}
        <ThemeScript />
      </head>
      <body>
        {/* Both providers are optional. Without them Lumen follows the OS theme; data-brand on <html> sets the app color. */}
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
