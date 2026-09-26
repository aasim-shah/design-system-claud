# Lumen Design System

**Quiet by design. Clear by default.**

Lumen is a calm, minimal design system inspired by the clarity of iOS. One set of design tokens drives
matching component libraries for **React / Next.js** and **React Native / Expo**, with the same names, props and behaviour on both.

```
packages/
├── icons/          @lumen/icons         Lumen Rounded: 85 soft 24px icons for React (./react) and React Native (./native)
├── tokens/         @lumen/tokens        Colors, type, spacing, radius, elevation, motion → TS, CSS vars, JSON, Tailwind
├── react/          @lumen/react         Web components (Next.js App Router ready, SSR safe, zero runtime CSS-in-JS)
└── react-native/   @lumen/react-native  Native components (no native deps: no SVG, no Reanimated, no safe-area lib)
showcase/           Interactive, single-file docs site built from the real components
examples/           Copy-paste starters for Next.js and Expo
```

---

## Principles

1. **Monochrome first.** Ink on paper. The accent is black (white in dark mode), and color appears only when it carries meaning: success, warning, or a destructive action.
2. **Content first.** Surfaces recede, content leads. Hairlines instead of borders, soft shadows instead of outlines.
3. **One primary action per view.** Button weight goes `filled → tinted → gray → outline → plain`. Use one `filled` per screen.
4. **Semantic, never raw.** Components use roles (`label.secondary`, `background.grouped`), never hex values, so light/dark and re-branding come free.
5. **Comfortable to touch.** Every control is at least 44pt. Spacing sits on a 4pt grid.
6. **Motion explains, never decorates.** Short, physical springs; everything respects *reduce motion*.
7. **Accessible by default.** Real `<button>`, `<dialog>`, `role="switch"`, labelled fields, visible focus rings, WCAG-checked contrast.

---

## Quick start

> The packages build to `packages/*/dist`. Publish them to npm or GitHub Packages under your own scope
> (see [Using it in your apps](#using-it-in-your-apps)), then install them in your apps.

### Next.js (App Router)

```bash
npm i @lumen/react @lumen/tokens
```

```tsx
// app/layout.tsx
import '@lumen/react/styles.css';
import { ThemeProvider, ThemeScript, ToastProvider } from '@lumen/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><ThemeScript /></head>
      <body>
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

```tsx
import { Button, TextField, VStack } from '@lumen/react';

<VStack gap={4}>
  <TextField label="Email" type="email" placeholder="you@example.com" clearable />
  <Button fullWidth size="lg">Continue</Button>
</VStack>
```

Both providers are optional. Without them, Lumen follows the OS light/dark setting using pure CSS.
Interactive components ship with `'use client'`, and presentational ones (`Text`, `Stack`, `Card`, `Badge`…) work in Server Components.

### React (Vite, CRA, Remix…)

Same as above: `import '@lumen/react/styles.css'` once at your entry point.

### React Native / Expo

```bash
npm i @lumen/react-native @lumen/tokens
```

```tsx
import { ThemeProvider, ToastProvider, Button, Text, VStack } from '@lumen/react-native';

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <VStack gap={4} padding={4}>
          <Text variant="largeTitle">Hello</Text>
          <Button onPress={() => {}}>Continue</Button>
        </VStack>
      </ToastProvider>
    </ThemeProvider>
  );
}
```

With React Navigation: `<NavigationContainer theme={navigationTheme(useTheme())}>`.

Full examples: [`examples/nextjs`](examples/nextjs) · [`examples/expo`](examples/expo/App.tsx)

---

## Theming

### Dark mode

| Web | React Native |
| --- | --- |
| Automatic via `prefers-color-scheme`. Force it with `data-theme="dark" \| "light"` or a `.dark` / `.light` class on any ancestor (works with `next-themes`). `useTheme().setPreference('dark' \| 'light' \| 'system')` persists the choice. | Automatic via `useColorScheme()`. `useTheme().setPreference(...)`, or control it with `<ThemeProvider scheme={...}>`. |

### Brand accent in one line (optional)

Out of the box the accent is monochrome. If a product needs a brand color, opt in:

```tsx
<ThemeProvider accent="#007AFF">                       // e.g. iOS blue, same hex for both schemes
<ThemeProvider accent={{ light: '#0066CC', dark: '#2997FF' }}>
```

Pressed, subtle (tinted) and on-accent colors are **derived automatically** (`intentFrom()`), with the
text color on the accent picked for contrast.

Any semantic color can be overridden per scheme:

```tsx
<ThemeProvider colors={{ light: { background: { grouped: '#F5F5F7' } } }}>
```

Web without React? Plain CSS works too:

```css
:root { --lm-color-accent: #FF2D55; --lm-color-accent-pressed: #D70F3B; --lm-color-accent-subtle: rgba(255,45,85,.12); }
```

### Tailwind CSS

```ts
// tailwind.config.ts
import lumen from '@lumen/tokens/tailwind';
export default { presets: [lumen], content: ['./app/**/*.tsx'] };
```

```html
<div class="bg-background-grouped text-label rounded-xl p-4 shadow-2">
  <p class="text-headline">Title</p>
  <p class="text-subheadline text-label-secondary">Every utility maps to a CSS variable, so dark mode just works.</p>
</div>
```

---

## Foundations

> **Full specs:** see [`docs/SPECS.md`](docs/SPECS.md) for spacing usage, page margins and gutters, radius per role, borders and focus, elevation, states, motion, layers, and exact measurements for every component. The same data is exported from `@lumen/tokens` (`spacingUsage`, `layoutRules`, `radiusUsage`, `componentSpecs`…).

### Color roles

| Role | Use for |
| --- | --- |
| `background.primary / secondary / tertiary` | Plain screens and the layers stacked on them |
| `background.grouped / groupedSecondary / groupedTertiary` | Settings-style screens (gray canvas, white cells) |
| `background.elevated` | Cards, popovers, dialogs, sheets |
| `label.primary / secondary / tertiary / quaternary` | Text hierarchy: titles → captions → placeholders → disabled |
| `fill.primary … quaternary` | Translucent fills for tracks, inputs, chips |
| `separator.default / opaque` | Hairlines |
| `material.thin / regular / thick` | Translucent bars used with a backdrop blur |
| `accent` | Primary actions and selection. Black in light mode, white in dark mode, unless you set a brand color |
| `success · warning · danger · info` | Status only. Each has `default`, `pressed`, `subtle`, `on`. `info` is a neutral gray |

A raw palette (`blue`, `red`, `green`, `gray…gray6`, …) is also available as tokens for rare cases like charts or
illustrations. No component uses it by default.

### Type scale

| Variant | Size / line | Weight | Typical use |
| --- | --- | --- | --- |
| `display` | 48 / 52 | Bold | Marketing hero (drops to 34 on phones) |
| `largeTitle` | 34 / 41 | Bold | Screen titles |
| `title1` | 28 / 34 | Bold | Section titles |
| `title2` | 22 / 28 | Bold | Sub-sections |
| `title3` | 20 / 25 | Semibold | Card titles |
| `headline` | 17 / 22 | Semibold | Emphasised body, list titles, buttons |
| `body` | 17 / 22 | Regular | Default reading text |
| `callout` | 16 / 21 | Regular | Secondary paragraphs |
| `subheadline` | 15 / 20 | Regular | Supporting text, field labels |
| `footnote` | 13 / 18 | Regular | Help text, section headers |
| `caption1` / `caption2` | 12 / 16 · 11 / 13 | Regular | Metadata, badges |

The font is SF Pro on Apple devices, with Inter, Segoe UI or Roboto as fallbacks. For the same look everywhere, load
[Inter](https://rsms.me/inter/) on the web; it is already in the font stack.

### Spacing, radius, elevation, motion

- **Spacing** is a 4pt grid: `1=4 · 2=8 · 3=12 · 4=16 · 5=20 · 6=24 · 8=32 · 10=40 · 12=48 · 16=64`. `Stack gap={4}` is 16px.
- **Radius**: `xs 6 · sm 8 · md 10 · lg 14 · xl 20 · 2xl 28 · full`. For nested corners, use `inner = outer − padding`.
- **Elevation** has levels `0–4`, each soft and diffuse. The same token renders as a CSS `box-shadow` or as native shadow/elevation, and shadows are deepened on dark surfaces.
- **Motion**:
  - Durations: `instant 100 · fast 160 · base 240 · slow 360`.
  - Easings: `standard`, `decelerate`, `accelerate`, `emphasized`.
  - Springs: `snappy`, `smooth`, `gentle`.
  - Pressed surfaces scale to `0.97`.

---

## Components

The same component names and props exist on both platforms, where the platform allows.

| Component | Web | Native | Notes |
| --- | :-: | :-: | --- |
| `Text` | ✓ | ✓ | `variant`, `color`, `weight`, `align`, `truncate`/`numberOfLines`, `tabular`, `mono` |
| `Stack` / `HStack` / `VStack` | ✓ | ✓ | `gap` on the 4pt grid, `align`, `justify`, `wrap` |
| `Button` | ✓ | ✓ | `variant` filled·tinted·gray·outline·plain, `tone` accent·neutral·danger·success, `size`, `shape`, `loading`, icons, `href` (web) |
| `IconButton` | ✓ | ✓ | Circular and icon-only. `label` is required for accessibility |
| `TextField` | ✓ | ✓ | `label`, `description`, `error`, `leading`/`trailing`, `clearable` |
| `SearchField` | ✓ | ✓ | Magnifier and clear button |
| `TextArea` · `Select` | ✓ | – | Select wraps the native `<select>`, the best picker on every platform |
| `Switch` | ✓ | ✓ | 51×31 with a thumb that stretches while pressed. Monochrome by default; `tone="success"` gives iOS green |
| `Checkbox` · `Radio` / `RadioGroup` | ✓ | ✓ | Square or circle, indeterminate (web), animated check |
| `SegmentedControl` | ✓ | ✓ | Sliding thumb and arrow-key navigation (web) |
| `Slider` | ✓ | – | Native range input. On RN, use `@react-native-community/slider` with `theme.colors.accent.default` |
| `Card` | ✓ | ✓ | elevated·filled·grouped·outlined. Becomes interactive with `onClick`/`onPress`/`href` |
| `List` · `ListSection` · `ListItem` · `ListIcon` | ✓ | ✓ | Inset grouped rows with neutral icon tiles, detail, chevron, checkmark, destructive, inset hairlines |
| `Badge` | ✓ | ✓ | Tones, subtle/solid, dot, count (`99+`) |
| `Avatar` · `AvatarGroup` | ✓ | ✓ / – | Image with an initials fallback and a status dot |
| `Divider` | ✓ | ✓ | True hairline |
| `Spinner` · `Progress` · `Skeleton` | ✓ | ✓ | 8-spoke activity indicator (native `ActivityIndicator` on RN) |
| `NavigationBar` | ✓ | – | Sticky translucent blur and large title. On RN, use React Navigation with `navigationTheme()` |
| `Dialog` | ✓ | ✓ | Web uses native `<dialog>` (focus trap, Esc, top layer). `align="center"` gives the alert style |
| `Sheet` | ✓ | ✓ | Bottom sheet with a grabber (centered card on desktop). Swipe down to dismiss on RN |
| `ToastProvider` / `useToast` | ✓ | ✓ | `toast.success('Saved')`, `toast.error(...)`, `toast.show({ title, action })` |
| `ThemeProvider` / `useTheme` | ✓ | ✓ | Scheme preference, brand accent, color overrides |
| Icons / `Glyph` | ✓ | ✓ | Web: 24px stroke icons (Lucide-compatible). RN: dependency-free glyphs drawn with Views |

### Extended components

| Component | Web | Native | Notes |
| --- | :-: | :-: | --- |
| `Form` · `FormSection` · `FormRow` · `FormActions` | ✓ | `FormSection` | Consistent form rhythm. Rows stack on phones |
| `PasswordField` | ✓ | ✓ | Show/hide toggle and optional strength meter |
| `PinInput` | ✓ | ✓ | OTP/PIN with auto-advance, paste and SMS autofill (`one-time-code`) |
| `Chip` · `ChipGroup` | ✓ | ✓ | Toggleable filter chips or removable tags |
| `Stepper` | ✓ | ✓ | − value + for small bounded numbers |
| `FileDrop` | ✓ | – | Drag-and-drop or browse, size limit, removable file list |
| `Breadcrumbs` | ✓ | ✓ | Collapses the middle of long paths |
| `Tabs` | ✓ | ✓ | Underline tabs with a sliding indicator and arrow keys |
| `Pagination` | ✓ | – | Smart ellipsis, current page in the accent color |
| `Sidebar` | ✓ | – | Desktop app navigation with sections and counts |
| `TabBar` | ✓ | ✓ | Bottom navigation with badges (plug into React Navigation's `tabBar`) |
| `Steps` | ✓ | ✓ | Wizard progress: complete, current and upcoming |
| `Accordion` | ✓ | ✓ | Single or multiple open, animated height |
| `Menu` · `Popover` | ✓ | – | Anchored, flips above when needed, keyboard navigation. On RN, use `ActionSheet` |
| `Tooltip` | ✓ | – | On hover and focus, for short hints only |
| `ActionSheet` | ✓ | ✓ | iOS-style choices with a separate Cancel |
| `Alert` | ✓ | ✓ | Inline banner. Only the icon carries color |
| `EmptyState` | ✓ | ✓ | Icon, message and next action |
| `Table` | ✓ | – | Hairline rows, tabular numbers, row actions, empty state |
| `Kbd` | ✓ | – | Keyboard shortcut keys |

### Icons

**Lumen Rounded** (`@lumen/icons`) is the system's own icon set: 85 icons on a 24px grid, 2px stroke, with no sharp edges: every tip, arrowhead and corner is curved, and small filled dots are a signature detail. On the web they're re-exported from `@lumen/react` (`<HomeIcon />`, `<LumenIcon name="home" />`). On React Native, import from `@lumen/icons/native` (requires `react-native-svg`). `IconCircle` is the signature container: soft, outline, solid or tinted circles used by list rows, alerts, empty states and more.


Lumen's own icons cover what the components need: chevrons, check, close, plus, search, info and alerts.
For your app icons, use any 24px stroke set at `strokeWidth={2}`, for example [Lucide](https://lucide.dev) (`lucide-react`, `lucide-react-native`).
It will match the system. On iOS, `expo-symbols` gives you real SF Symbols.

---

## Using it in your apps

1. **Rename the scope** (optional). `@lumen` is a placeholder. To use your own npm scope:
   ```bash
   grep -rl "@lumen/" --include=*.{json,ts,tsx,mjs,md} --exclude-dir=node_modules . | xargs sed -i 's#@lumen/#@your-scope/#g'
   ```
2. **Build**: `npm install && npm run build`
3. **Publish**, choosing one of:
   - npm / GitHub Packages: `npm publish -w @lumen/tokens -w @lumen/react -w @lumen/react-native --access public`
   - Monorepo: drop `packages/*` into your app's workspace.
   - Local: `npm pack -w @lumen/react`, then `npm i ../path/lumen-react-0.1.0.tgz`

---

## Development

```bash
npm install
npm run build        # tokens → react → react-native
npm run typecheck    # all packages + examples
npm test             # token contrast checks + SSR render of every web component
npm run showcase     # → showcase/dist/index.html (single self-contained file, open it in a browser)
npm run docs         # regenerate docs/SPECS.md from packages/tokens/src/specs.ts
```

Tokens are the source of truth. Edit `packages/tokens/src/*`, and CSS variables, JSON, Tailwind and both component
libraries all update from the same values.

```
packages/tokens/src
├── colors.ts        palette + semantic roles (light & dark)
├── typography.ts    font stacks & text styles
├── layout.ts        spacing, radius, sizes, breakpoints, z-index, opacity
├── elevation.ts     shadow levels → CSS & native
├── motion.ts        durations, easings, springs
├── theme.ts         createTheme(scheme, { accent, colors })
├── css.ts           → tokens.css (--lm-* custom properties)
└── tailwind.ts      Tailwind preset
```

## License

MIT
