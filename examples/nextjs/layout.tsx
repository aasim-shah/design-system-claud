// app/layout.tsx — Next.js App Router
import '@lumen/react/styles.css';
import type { ReactNode } from 'react';
import { ThemeProvider, ThemeScript, ToastProvider } from '@lumen/react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Applies the saved light/dark choice before first paint (no flash). */}
        <ThemeScript />
      </head>
      <body>
        {/* Both providers are optional. Without them Lumen simply follows the OS theme. */}
        <ThemeProvider accent="#5E5CE6">
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
