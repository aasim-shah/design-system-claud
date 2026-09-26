# Lumen specs

> Generated from the Lumen repo (packages/tokens/src/specs.ts). Values are px on web, pt on iOS, dp on Android.

All values are in px on the web and pt on iOS. On Android they are dp.
Everything sits on a **4pt grid**. Where two values appear, like `44 (32 / 52)`, they are the `md (sm / lg)` sizes.

## Spacing

| Token | Value | Use for |
| --- | --- | --- |
| `space-0.5` | 2px | Optical nudges: icon baseline alignment, subtitle under a title. |
| `space-1` | 4px | Icon ↔ text inside chips and small buttons; label inset from field edge. |
| `space-1.5` | 6px | Label → control, control → help text. Items inside a menu. |
| `space-2` | 8px | Between tightly related items: buttons in a group, chips, avatar ↔ name. |
| `space-3` | 12px | Inside rows: icon tile ↔ text, checkbox ↔ label. Small card padding. |
| `space-4` | 16px | The default. Field → field, row padding, phone page gutter, alert padding. |
| `space-5` | 20px | Card padding. Button horizontal padding (md). |
| `space-6` | 24px | Form section → section, dialog padding, tablet gutter. |
| `space-8` | 32px | Between groups on a screen (list sections, card rows). Desktop gutter. |
| `space-10` | 40px | Section heading → its content. |
| `space-12` | 48px | Between major blocks inside a page section. Mobile section spacing. |
| `space-16` | 64px | Between page sections on desktop. |
| `space-24` | 96px | Hero / landing top and bottom padding. |

**Rules**
- Use `gap` on the parent (`Stack gap={4}`), not margins on children.
- Related things sit closer than unrelated things. A label is 6 from its field, and a field is 16 from the next field.
- Padding inside a component is always less than or equal to the space around it.

## Layout & margins

| Token | Value | Use for |
| --- | --- | --- |
| `gutter · phone` | 16px | Side margin under 640px. Never let content touch the screen edge. |
| `gutter · tablet` | 24px | 640–1024px. |
| `gutter · desktop` | 32px | Above 1024px, around a centered container. |
| `max-content` | 1080px | Container width for app pages and marketing sections. |
| `max-readable` | 680px | Articles, forms and settings: about 65 characters per line. |
| `grid` | 12 col · 16/24px gap | 16px gap under 1024px, 24px above. Collapse to 1 column on phones. |
| `section spacing` | 48–64px | 48px on phones, 64px on desktop between page sections. |
| `navigation bar` | 52px (web) · 44pt (iOS) | Sticky, translucent. Large title adds 34pt type below it. |
| `tab bar` | 49pt + safe area | Bottom navigation, 3–5 items. Icons 24, labels 10pt. |
| `sidebar` | 240–280px | Desktop navigation. Hide behind a menu button under 1024px. |
| `touch target` | 44pt min | Every tappable thing. Pad small visuals with hitSlop / padding. |
| `breakpoint · sm` | 640px | Large phones, landscape. Forms go from 1 to 2 columns. |
| `breakpoint · md` | 768px | Tablets portrait. Show more columns in grids. |
| `breakpoint · lg` | 1024px | Tablets landscape / laptops. Sidebar appears. |
| `breakpoint · xl` | 1280px | Desktop. Max container width is reached. |

## Radius

| Token | Value | Use for |
| --- | --- | --- |
| `radius-xs` | 6px | Keyboard keys, tiny tags, checkbox (7px). |
| `radius-sm` | 8px | Menu items, tooltips, small inputs, skeleton blocks. |
| `radius-md` | 10px | Inputs, list groups, segmented control, pagination, stepper. |
| `radius-lg` | 14px | Large buttons, alerts, popovers & menus, tables, action sheets, dropzones. |
| `radius-xl` | 20px | List groups, alerts, small cards. |
| `card` | 24px | Default cards (32 for large). Inner items: 24 − padding. |
| `radius-2xl` | 28px | Dialogs, bottom sheets, large cards. |
| `radius-full` | 9999px | Switches, chips, badges, avatars, small (sm) buttons, toasts, progress. |
| `button · md` | 12px | Default button. Capsule shape available for hero actions. |

**Nested corners:** inner radius = outer radius − padding. For example, a card with radius 20 and padding 12 holds items with radius 8.

## Typography

| Variant | Size | Line height | Weight | Tracking |
| --- | --- | --- | --- | --- |
| `display` | 48 | 52 | 700 | -0.022em |
| `largeTitle` | 34 | 41 | 700 | -0.016em |
| `title1` | 28 | 34 | 700 | -0.014em |
| `title2` | 22 | 28 | 700 | -0.012em |
| `title3` | 20 | 25 | 600 | -0.01em |
| `headline` | 17 | 22 | 600 | -0.022em |
| `body` | 17 | 22 | 400 | -0.022em |
| `callout` | 16 | 21 | 400 | -0.02em |
| `subheadline` | 15 | 20 | 400 | -0.016em |
| `footnote` | 13 | 18 | 400 | -0.006em |
| `caption1` | 12 | 16 | 400 | 0em |
| `caption2` | 11 | 13 | 400 | 0.006em |

- Body copy is 17. Keep lines under about 65 characters (`max-readable` 680px).
- Use one `largeTitle` or `title1` per screen, and step down one size at a time.
- Secondary text changes color (`label.secondary`), not size. Use at most two sizes per component.

## Borders, separators & focus

| Token | Value | Use for |
| --- | --- | --- |
| `hairline` | 0.5px (1px on 1× screens) | List separators, table rows, section dividers. |
| `separator inset` | 12px · 56px with icon | Row separators start where the text starts and stop 12 before the edge. They hide next to a highlighted row. |
| `outline` | 1px separator color | Outline buttons, outlined cards, chips. Never darker than the separator. |
| `input ring` | 1.5px accent + 4px halo | Focused inputs. Errors swap the accent for danger. |
| `focus ring` | 3–4px focus color, 2px offset | Keyboard focus only (:focus-visible), on every interactive element. |

## Elevation

| Token | Value | Use for |
| --- | --- | --- |
| `shadow-0` | none | Anything on the page itself: lists, filled cards, inputs. |
| `shadow-1` | 1–3px | Small raised details: thumbs, dropzone icon, logo. |
| `shadow-2` | 8–16px | Elevated cards. |
| `shadow-3` | 24px | Popovers, menus, toasts, action sheets. Also card hover. |
| `shadow-4` | 48px | Dialogs and bottom sheets. |

## States

| Token | Value | Use for |
| --- | --- | --- |
| `hover` | opacity 0.85 or fill-quaternary | Pointer devices only (@media (hover: hover)). |
| `pressed` | scale 0.97 + pressed color | Buttons, cards (0.985), chips (0.96). Instant on press-in, spring back. |
| `focus` | focus ring | Visible on keyboard focus, hidden for mouse clicks. |
| `selected` | accent fill / checkmark | Chips, segmented thumb, list checkmark, current page. |
| `disabled` | opacity 0.38 | Not focusable, cursor not-allowed. Explain why nearby if it isn’t obvious. |
| `error` | danger ring + message | Message says how to fix it: “Enter an email like name@company.com.” |
| `loading` | spinner / skeleton | Keep the button size; skeletons match the final layout. |

## Motion

| Token | Value | Use for |
| --- | --- | --- |
| `instant` | 100ms | Press feedback, row highlight. |
| `fast` | 160ms | Hover, color changes, small toggles. |
| `base` | 240ms | Most transitions, exits. |
| `slow` | 360ms | Thumbs sliding, dialogs entering, accordions. |
| `slower` | 500ms | Sheets and toasts entering. |
| `reduce motion` | ≈0ms | All animation collapses when the user asks for reduced motion. |

Springs: `snappy` (buttons, toggles), `smooth` (thumbs, layout) and `gentle` (sheets). Pressed surfaces scale to 0.97.

## Layers

| Token | Value | Use for |
| --- | --- | --- |
| `z-base` | 0 | Page content. |
| `z-raised` | 10 | Overlapping content inside the page (avatar groups, badges). |
| `z-sticky` | 100 | Navigation bar, tab bar, sticky headers. |
| `z-overlay` | 1000 | Popovers and menus. |
| `z-modal` | 1100 | Dialogs and sheets (native <dialog> uses the top layer). |
| `z-toast` | 1200 | Toasts, above everything interactive. |
| `z-tooltip` | 1300 | Tooltips. |

## Components

| Component | Height | Padding | Radius | Type | Notes |
| --- | --- | --- | --- | --- | --- |
| **Icon** | 16 · 18 · 20 · 24 · 28 | — | — | — | Lumen Rounded, 24 grid, stroke 2, round caps and joins, no sharp corners: every tip and bend is curved. |
| **Icon circle** | 24 · 28 · 32 · 44 · 56 | — | full | — | Glyph = 56% of the circle. Soft, outline, solid and tinted (14%) variants. |
| **Button · sm** | 32 | 0 12 | full | Subheadline 15 · 600 | Icon 16, gap 4. |
| **Button · md** | 44 | 0 20 | 12 | Headline 17 · 600 | Default. Icon 18, gap 8. Plain: padding 0 8. |
| **Button · lg** | 52 | 0 24 | 14 | Headline 17 · 600 | Primary call to action, full-width on phones. |
| **Icon button** | 32 / 44 / 52 | — | full | — | Square, icon 1.2em. Always has a label. |
| **Text field** | 44 (32 / 52) | 0 12 (8 / 16) | 10 (8 / 14) | Body 17 | Label 15 · 500 above, 6 gap. Help text 13 below. |
| **Search field** | 36 | 0 8 | 10 | Body 17 | Magnifier 16, gap 6, clear button 18. |
| **Text area** | min 88 | 10 12 | 10 | Body 17 | Vertical resize only. |
| **Select** | 44 | 0 36 0 12 | 10 | Body 17 | Up-down chevron 14 at 12 from the right. |
| **Password field** | 44 | 0 12 | 10 | Body 17 | Show/hide button trailing. Strength bar 3 tall. |
| **PIN input** | 56 | — | 10 | Title 2 · 600 | Cells 48 wide, gap 8, separator 10×2. |
| **Switch** | 31 (24) | 2 | full | — | 51×31, thumb 27. Stretches 6 while pressed. |
| **Checkbox / radio** | 22 | — | 7 / full | Body 17 | Border 1.5, label gap 12, check 14. |
| **Segmented control** | 32 (40) | 2 | 9 (thumb 7) | Footnote 13 · 500 | Equal-width segments, thumb shadow level 1. |
| **Slider** | 28 | — | full | — | Track 4, thumb 28. |
| **Stepper** | 36 | — | 10 | Body 17 · 500 | Buttons 44 wide, value min 36. |
| **Chip** | 32 | 0 12 | full | Subheadline 15 · 500 | Gap 8 between chips. Selected = accent fill. |
| **Badge** | 22 (18) | 0 8 (0 6) | full | Caption 12 · 600 | Dot 6. Count bubble min-width = height. |
| **Avatar** | 24 / 32 / 40 / 56 / 80 | — | full · 22.5% | Initials 40% of size | Status dot 28% with 2px ring. |
| **List group** | — | 6 | 20 | — | A padded card. Rows float inside with a rounded (14) press highlight. |
| **List row** | min 52 | 8 12 | 14 | Body 17 | Icon circle 32 (glyph 18), gap 12, chevron 14. Separators inset 12 each side. Section header 13 · 500 uppercase. |
| **Card** | — | 24 (16 / 32) | 24 (20 / 32) | — | Elevated = shadow 2 + hairline. Hover lifts 2px. |
| **Alert** | — | 16 20 16 16 | 20 | Subheadline 15 | Icon in a 32 tinted circle, gap 12. Only the icon carries color. |
| **Table** | header 40 · row 52 | 0 16 | wrap 14 | Subheadline 15 | Header 13 · 500 secondary. Tabular numbers, amounts right-aligned. |
| **Tabs** | 44 | 0 · gap 24 | indicator 2 | Subheadline 15 · 500 | Indicator 2px, label color on selection. |
| **Breadcrumbs** | 20 | — | — | Subheadline 15 | Chevron 12, gap 4. Collapses middle after 4 items. |
| **Pagination** | 36 | 0 8 | 10 | Subheadline 15 · 500 | Gap 4, current page = accent fill. |
| **Steps** | marker 28 | — | full | Footnote 13 · 500 | Connector 1.5 with 20 clearance each side. |
| **Sidebar item** | 36 | 0 12 | 10 | Subheadline 15 · 500 | Icon 18, gap 12, sections 20 apart. |
| **Tab bar** | 49 + safe area | 6 8 | — | 10 · 500 | Icon 24, label gap 2. Selected = primary label color. |
| **Navigation bar** | 52 | 0 16 | — | Headline 17 · 600 | Material + 20px blur. Large title 34 · 700. |
| **Menu / popover** | item 36 | 6 (item 0 12) | 14 (items 8) | Subheadline 15 | Min width 200, 6 from trigger, 12 from viewport edge. |
| **Tooltip** | — | 6 10 | 8 | Footnote 13 · 500 | Inverse colors, 8 from target, 350ms delay. |
| **Toast** | min 48 | 8 20 8 16 | full | Subheadline 15 · 500 | Top center, 16 from edge. 3.2s default. |
| **Dialog** | — | 24 | 28 | Title 3 · 600 / Subheadline 15 | Width 420 (alert 320). Actions gap 8. |
| **Bottom sheet** | max 92% | header 8 16 · body 0 20 24 | 28 top | Headline 17 | Grabber 36×5. Centered card (540) on desktop. |
| **Action sheet** | row 56 | inset 8 | 14 | Title 3 20 | Cancel in its own group, 8 above, semibold. |
| **Empty state** | — | 40 16 | icon full | Title 3 / Subheadline | Icon circle 56, max width 360, centered. |
| **File drop** | — | 32 16 | 14 | Subheadline 15 · 600 | Dashed 1.5 border, icon 44. |
| **Progress / spinner** | 4 (8) · 16/20/32 | — | full | — | Spinner has 8 spokes and steps at 0.9s. |
