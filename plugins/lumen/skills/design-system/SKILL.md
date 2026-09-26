---
name: design-system
description: Build screens, pages, components and forms with the Lumen design system — calm, minimal, iOS-like UI for Next.js, React and React Native (@lumen/react, @lumen/react-native, @lumen/tokens, @lumen/icons). Use this whenever you create or change any UI in a project that depends on @lumen/*, and whenever the user asks for clean / minimal / Apple-style UI, a settings screen, sign-in or checkout form, dashboard, list, modal, bottom sheet, tab bar, or "use our design system", even if they don't say "Lumen". Covers component choice, tokens, spacing, radius, rounded icons, brand colors, dark mode and accessibility.
---

# Building UI with Lumen

Lumen is a monochrome-first design system. Ink on paper. One brand accent. Soft, rounded shapes.
Every value comes from tokens. Pages built with it look calm because of what's left out. Every
extra color, border, shadow or font size competes with the content, so add them only when they
carry meaning.

**Before writing UI:**
- If the project's `package.json` has no `@lumen/*` dependency, follow the `setup` skill first.
- Check which package applies: `@lumen/react` on the web (Next.js, React), `@lumen/react-native` for React Native and Expo.
- Exact props live in the installed type definitions: `node_modules/@lumen/react/dist/**/*.d.ts` or
  `node_modules/@lumen/react-native/dist/**/*.d.ts`. Read the relevant `.d.ts` file when unsure. It's the source of truth.

## The rules, and why

1. **Reach for a Lumen component before writing markup.** Components already handle dark mode, the
   brand color, focus rings, 44pt touch targets, loading and disabled states. Hand-rolled
   versions usually miss several of those. Use the chooser below.
2. **Use tokens, never raw values.**
   - Colors: `var(--lm-color-*)` on the web, `theme.colors.*` on native.
   - Spacing: `Stack gap={4}` or `var(--lm-space-4)`.
   - Radius: `var(--lm-radius-*)`. Motion: `var(--lm-duration-*)`.

   A raw hex breaks dark mode and brand switching. A raw `13px` breaks the rhythm.
3. **Color means something.**
   - The accent (brand) marks the primary action and the selection.
   - `success`, `warning` and `danger` are for status only.
   - Everything else is label, background, fill and separator.

   Don't color icons, headings or backgrounds decoratively.
4. **One `filled` button per view** for the main action. Secondary actions use `gray`, `tinted`,
   `outline` or `plain`, in decreasing order of emphasis. Destructive actions use `tone="danger"`.
   Actions repeated on every card or row (such as "Add to cart" in a product grid) aren't the
   page's main action. Use `tinted` or `gray` for them, so a wall of filled buttons doesn't drown out
   what matters. Keep `filled` for the one action the page exists for (checkout, save, create).
5. **Type comes from the scale.**
   - Use `Text variant="…"`: largeTitle, title1–3, headline, body, callout, subheadline, footnote, caption1–2.
   - Body text is 17. Show hierarchy with `color="secondary"` before making text smaller.
   - Use one `largeTitle` or `title1` per screen.
6. **Space on the 4pt grid, with `gap` on parents.**
   - Label to field: 6. Between fields: 16 (`gap={4}`). Between form sections: 24. Between page groups: 32.
   - Between page sections: 48 on mobile, 64 on desktop.
   - Page gutters: 16 on phones, 24 on tablets, 32 on desktop.
   - Readable width is 680px, and the page container is 1080px.
7. **Everything is rounded, nothing is sharp.**
   - Cards: 24. List groups: 20. Inputs: 10. Buttons: 12. Small buttons, chips and badges are capsules.
   - Nested corners: inner radius = outer radius − padding.
   - Icons come only from Lumen Rounded (`@lumen/react` re-exports them; RN uses `@lumen/icons/native`).
     Put an icon that needs a background in an `IconCircle`, never a square tile.
8. **Every data view has four states.** Loading (`Skeleton` or `Spinner`), empty (`EmptyState`
   with a next action), error (`Alert tone="danger"` or a toast) and loaded. Keep layouts stable
   between them.
9. **Accessibility is part of the design.**
   - Give every `IconButton` a `label` and every field a `label` (or `aria-label`).
   - Errors say how to fix the problem: "Enter an email like name@company.com".
   - Keep native semantics: `<Button href>` for navigation and `<Button>` for actions.

## Component chooser

| Need | Web (`@lumen/react`) | Native (`@lumen/react-native`) |
| --- | --- | --- |
| Text | `Text` | `Text` |
| Layout | `VStack`, `HStack`, `Stack` (gap on 4pt grid) | same |
| Actions | `Button`, `IconButton` | same |
| Text entry | `TextField`, `PasswordField`, `SearchField`, `TextArea`, `Select`, `PinInput` | `TextField`, `PasswordField`, `SearchField`, `PinInput` |
| Choices | `Switch`, `Checkbox`, `RadioGroup`+`Radio`, `SegmentedControl`, `Chip`/`ChipGroup`, `Slider`, `Stepper` | `Switch`, `Checkbox`, `RadioGroup`, `SegmentedControl`, `Chip`/`ChipGroup`, `Stepper` |
| Form structure | `Form`, `FormSection`, `FormRow`, `FormActions`, `FileDrop` | `FormSection` |
| Settings-style rows | `ListSection` › `List` › `ListItem` (+ `ListIcon`) | same |
| Surfaces | `Card` (elevated · filled · grouped · outlined) | `Card` |
| Status | `Badge`, `Alert`, `Progress`, `Spinner`, `Skeleton`, `EmptyState` | same |
| Identity | `Avatar`, `AvatarGroup`, `IconCircle` | `Avatar`, `IconCircle` |
| Navigation | `NavigationBar`, `Sidebar`, `Breadcrumbs`, `Tabs`, `Pagination`, `TabBar`, `Steps` | `TabBar`, `Tabs`, `Breadcrumbs`, `Steps` (+ React Navigation with `navigationTheme`) |
| Overlays | `Dialog` (alert: `align="center"`), `Sheet`, `ActionSheet`, `Menu`, `Popover`, `Tooltip`, `useToast` | `Dialog`, `Sheet`, `ActionSheet`, `useToast` |
| Data | `Table` (+ row `Menu`), `Accordion`, `Kbd` | `Accordion` |

Per-component props and short examples:
- Web: `references/components-web.md`
- Native: `references/components-native.md`
- Full screen recipes (settings, auth, dashboard, list/detail, mobile tabs, and the empty, loading and error states): `references/patterns.md`

## Styling what components don't cover

- **Web:** plain CSS or CSS Modules with Lumen variables, for example:
  ```css
  .panel { padding: var(--lm-space-6); border-radius: 24px; background: var(--lm-color-background-grouped-secondary); }
  ```
  - With Tailwind, use the preset utilities (`bg-background-grouped`, `text-label-secondary`, `rounded-xl`, `gap-4`, `text-headline`).
  - Useful variables:
    - Backgrounds: `--lm-color-background-{primary|secondary|grouped|grouped-secondary|elevated}`
    - Text: `--lm-color-label-{primary|secondary|tertiary}`
    - Fills: `--lm-color-fill-{primary..quaternary}`
    - Separator: `--lm-color-separator`
    - Accent: `--lm-color-accent`, `-accent-subtle`, `-accent-on`
    - Shadows: `--lm-shadow-{1..4}`
- **Native:** use `const theme = useTheme()` or `makeStyles((t) => ({ … }))`. Use `theme.colors`,
  `theme.spacing`, `theme.radius`, `theme.elevation.native(level, theme.scheme)` and `textStyle('body')`.
- Full measurements (spacing usage, margins, radius per role, borders, elevation, states, motion,
  layers, per-component sizes): `references/specs.md`.
- The icon list, 85 names in the `PascalCaseIcon` form such as `ArrowRightIcon`: `references/icons.md`.

## Brand and appearance

- **Brand:** one per app.
  - Next.js / web: `<html data-brand="orange">`. Any element can carry `data-brand` to scope a brand to that part of the page.
  - React / React Native: `<ThemeProvider brand="orange">`.
  - For a custom color: `<ThemeProvider accent="#hex">`.
  - Presets: graphite (default), orange, blue, indigo, green, teal, pink, red, purple.
- **Dark mode is automatic.** Never write separate dark styles. Use tokens and it follows.
  - Web: force a scheme with `data-theme="dark|light"` or `useTheme().setPreference(...)`.
  - Native: `useTheme().setPreference(...)`.

## Next.js notes

- Interactive components are client components and already carry `'use client'`. Presentational
  ones (`Text`, `Stack`, `Card`, `Badge`, `List`, `Alert`, `EmptyState`) work in Server Components.
- Page files that pass handlers (`onClick`, `onValueChange`) must be client components.
- Import `@lumen/react/styles.css` once, in the root layout.

## Before you finish

Check:
- No raw hex colors or ad-hoc font sizes, and no one-off margins where `gap` would do.
- One primary (`filled`) action per view.
- Empty, loading and error states exist.
- Icons come from Lumen Rounded, and icon backgrounds are circles.
- It works in dark mode and at phone width (≈390px) without horizontal scroll.
- Run the project's typecheck.
