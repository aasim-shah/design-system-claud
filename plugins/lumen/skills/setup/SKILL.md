---
name: setup
description: Install or update the Lumen design system (@lumen/tokens, @lumen/icons, @lumen/react, @lumen/react-native) in a Next.js, React (Vite/CRA/Remix) or React Native / Expo project, and wire it in with the right brand color. Use this whenever the user wants to add Lumen to an app, start a new app "with our design system", switch an app's brand color, or update Lumen to the latest version, and whenever you are about to build UI with Lumen in a project whose package.json has no @lumen/* dependency yet.
---

# Set up Lumen in a project

Lumen isn't published to npm. This skill builds it from its GitHub repo and installs it as local
tarballs in `vendor/lumen/`. That gives every project a pinned, reproducible copy, and it works the
same with npm, pnpm, yarn and bun.

## 1. Gather the three inputs

- **App directory**: the folder with the app's `package.json`. In a monorepo, it's the app, not the root.
- **Platform**: detected from dependencies (`next` → next, `expo`/`react-native` → native, `react` →
  react). Pass `--platform` only if detection is wrong.
- **Brand**: `graphite` (monochrome, the default) or `orange`, `blue`, `indigo`, `green`, `teal`,
  `pink`, `red`, `purple`. If the user named a color, map it to the closest preset. If they gave a
  hex that no preset matches, install with `graphite` and set `accent="#hex"` on the provider
  afterwards. Don't ask when the user already said which color they want. Otherwise, a one-line
  question is fine, because the brand is the app's identity.

## 2. Run the installer

```bash
node <this skill's directory>/scripts/install.mjs --target <app dir> --brand <brand>
```

Useful flags:
- `--source <path>` uses a local checkout of the Lumen repo instead of cloning GitHub.
- `--ref <branch>` pins a branch.
- `--dry-run` prints the steps without running them.

The script:
1. Clones the repo into a temp folder.
2. Runs `npm ci` and builds the tokens, icons and platform packages.
3. Packs the packages into `vendor/lumen/`.
4. Installs them with the project's package manager, pinning `@lumen/*` to those tarballs.
5. Installs `react-native-svg` for React Native.

It never edits source files. It prints the snippet to add instead.

If it fails, read the error it prints. It's usually the project's own dependency conflict or a
missing git credential for a private repo. Fix that and re-run. Re-running is also how you update Lumen.

## 3. Wire it into the app

Make the smallest edit that fits the project's existing structure.

**Next.js (App Router)**, in `app/layout.tsx`:
```tsx
import '@lumen/react/styles.css';
import { ThemeScript, ToastProvider } from '@lumen/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-brand="orange" suppressHydrationWarning>
      <head><ThemeScript /></head>
      <body><ToastProvider>{children}</ToastProvider></body>
    </html>
  );
}
```
- Omit `data-brand` for graphite.
- `ThemeScript` applies a saved light/dark choice before first paint.
- Add `<ThemeProvider>` from `@lumen/react` only if the app needs an in-app appearance toggle or a custom `accent`.
- For the Pages Router, import the CSS in `pages/_app.tsx`. Set `data-brand` on `<Html>` in `pages/_document.tsx`.

**React (Vite, CRA, Remix)**:
- Import `@lumen/react/styles.css` once in the entry file.
- Set the brand with `<html data-brand="…">` in `index.html`.
- Wrap the app in `<ToastProvider>`.

**React Native / Expo**, in the root component:
```tsx
import { ThemeProvider, ToastProvider } from '@lumen/react-native';

<ThemeProvider brand="orange">
  <ToastProvider>{/* navigation */}</ToastProvider>
</ThemeProvider>
```
With React Navigation, also pass `theme={navigationTheme(useTheme())}` to `NavigationContainer`,
from inside the provider.

**Tailwind (optional):** if the project already uses Tailwind, add `presets: [require('@lumen/tokens/tailwind').default]`
(or the ESM import) to the config. Utilities like `bg-background-grouped`, `text-label-secondary`
and `rounded-xl` then map to Lumen tokens and follow dark mode and the brand.

## 4. Verify

- Run the project's typecheck and build (or `expo start` for native) and fix anything the wiring broke.
- Render one Lumen component on an existing page as a smoke test, for example a `<Button>`.
- Tell the user to commit `vendor/lumen/*.tgz` and the lockfile, so CI and teammates get the same build.

Then continue with the user's actual UI request, following the `design-system` skill.
