/**
 * Usage rules & component measurements.
 *
 * Tokens say *what values exist*; specs say *where each one goes*.
 * This file feeds the showcase "Specs" section and docs/SPECS.md, so the
 * documentation can never drift from the numbers the components use.
 */

import { spacing, radius, size, breakpoints, zIndex, opacity } from './layout.js';
import { duration } from './motion.js';

export interface UsageRow {
  token: string;
  value: string;
  use: string;
}

/** When to reach for each step of the 4pt spacing scale. */
export const spacingUsage: UsageRow[] = [
  { token: 'space-0.5', value: `${spacing[0.5]}px`, use: 'Optical nudges: icon baseline alignment, subtitle under a title.' },
  { token: 'space-1', value: `${spacing[1]}px`, use: 'Icon ↔ text inside chips and small buttons; label inset from field edge.' },
  { token: 'space-1.5', value: `${spacing[1.5]}px`, use: 'Label → control, control → help text. Items inside a menu.' },
  { token: 'space-2', value: `${spacing[2]}px`, use: 'Between tightly related items: buttons in a group, chips, avatar ↔ name.' },
  { token: 'space-3', value: `${spacing[3]}px`, use: 'Inside rows: icon tile ↔ text, checkbox ↔ label. Small card padding.' },
  { token: 'space-4', value: `${spacing[4]}px`, use: 'The default. Field → field, row padding, phone page gutter, alert padding.' },
  { token: 'space-5', value: `${spacing[5]}px`, use: 'Card padding. Button horizontal padding (md).' },
  { token: 'space-6', value: `${spacing[6]}px`, use: 'Form section → section, dialog padding, tablet gutter.' },
  { token: 'space-8', value: `${spacing[8]}px`, use: 'Between groups on a screen (list sections, card rows). Desktop gutter.' },
  { token: 'space-10', value: `${spacing[10]}px`, use: 'Section heading → its content.' },
  { token: 'space-12', value: `${spacing[12]}px`, use: 'Between major blocks inside a page section. Mobile section spacing.' },
  { token: 'space-16', value: `${spacing[16]}px`, use: 'Between page sections on desktop.' },
  { token: 'space-24', value: `${spacing[24]}px`, use: 'Hero / landing top and bottom padding.' },
];

const breakpointUse: Record<keyof typeof breakpoints, string> = {
  sm: 'Large phones, landscape. Forms go from 1 to 2 columns.',
  md: 'Tablets portrait. Show more columns in grids.',
  lg: 'Tablets landscape / laptops. Sidebar appears.',
  xl: 'Desktop. Max container width is reached.',
};

/** Page-level layout rules. */
export const layoutRules: UsageRow[] = [
  { token: 'gutter · phone', value: `${spacing[4]}px`, use: 'Side margin under 640px. Never let content touch the screen edge.' },
  { token: 'gutter · tablet', value: `${spacing[6]}px`, use: '640–1024px.' },
  { token: 'gutter · desktop', value: `${spacing[8]}px`, use: 'Above 1024px, around a centered container.' },
  { token: 'max-content', value: `${size.maxContentWidth}px`, use: 'Container width for app pages and marketing sections.' },
  { token: 'max-readable', value: `${size.maxReadableWidth}px`, use: 'Articles, forms and settings: about 65 characters per line.' },
  { token: 'grid', value: '12 col · 16/24px gap', use: '16px gap under 1024px, 24px above. Collapse to 1 column on phones.' },
  { token: 'section spacing', value: `${spacing[12]}–${spacing[16]}px`, use: '48px on phones, 64px on desktop between page sections.' },
  { token: 'navigation bar', value: '52px (web) · 44pt (iOS)', use: 'Sticky, translucent. Large title adds 34pt type below it.' },
  { token: 'tab bar', value: '49pt + safe area', use: 'Bottom navigation, 3–5 items. Icons 24, labels 10pt.' },
  { token: 'sidebar', value: '240–280px', use: 'Desktop navigation. Hide behind a menu button under 1024px.' },
  { token: 'touch target', value: `${size.control.md}pt min`, use: 'Every tappable thing. Pad small visuals with hitSlop / padding.' },
  ...Object.entries(breakpoints).map(([k, v]) => ({ token: `breakpoint · ${k}`, value: `${v}px`, use: breakpointUse[k as keyof typeof breakpoints] })),
];

/** Corner radius per role. Nested corners: inner = outer − padding. */
export const radiusUsage: UsageRow[] = [
  { token: 'radius-xs', value: `${radius.xs}px`, use: 'Keyboard keys, tiny tags, checkbox (7px).' },
  { token: 'radius-sm', value: `${radius.sm}px`, use: 'Menu items, tooltips, small inputs, skeleton blocks.' },
  { token: 'radius-md', value: `${radius.md}px`, use: 'Inputs, list groups, segmented control, pagination, stepper.' },
  { token: 'radius-lg', value: `${radius.lg}px`, use: 'Large buttons, alerts, popovers & menus, tables, action sheets, dropzones.' },
  { token: 'radius-xl', value: `${radius.xl}px`, use: 'Cards and demo panels.' },
  { token: 'radius-2xl', value: `${radius['2xl']}px`, use: 'Dialogs, bottom sheets, large cards.' },
  { token: 'radius-full', value: '9999px', use: 'Switches, chips, badges, avatars, small (sm) buttons, toasts, progress.' },
  { token: 'button · md', value: '12px', use: 'Default button. Capsule shape available for hero actions.' },
];

/** Borders, separators and focus. */
export const borderRules: UsageRow[] = [
  { token: 'hairline', value: `${size.hairline}px (1px on 1× screens)`, use: 'List separators, table rows, section dividers.' },
  { token: 'separator inset', value: '16px · 57px with icon', use: 'Row separators start where the text starts, never at the edge.' },
  { token: 'outline', value: '1px separator color', use: 'Outline buttons, outlined cards, chips. Never darker than the separator.' },
  { token: 'input ring', value: '1.5px accent + 4px halo', use: 'Focused inputs. Errors swap the accent for danger.' },
  { token: 'focus ring', value: '3–4px focus color, 2px offset', use: 'Keyboard focus only (:focus-visible), on every interactive element.' },
];

/** Shadow level per surface. */
export const elevationUsage: UsageRow[] = [
  { token: 'shadow-0', value: 'none', use: 'Anything on the page itself: lists, filled cards, inputs.' },
  { token: 'shadow-1', value: '1–3px', use: 'Small raised details: thumbs, dropzone icon, logo.' },
  { token: 'shadow-2', value: '8–16px', use: 'Elevated cards.' },
  { token: 'shadow-3', value: '24px', use: 'Popovers, menus, toasts, action sheets. Also card hover.' },
  { token: 'shadow-4', value: '48px', use: 'Dialogs and bottom sheets.' },
];

/** Interaction states. */
export const stateRules: UsageRow[] = [
  { token: 'hover', value: `opacity ${opacity.hover} or fill-quaternary`, use: 'Pointer devices only (@media (hover: hover)).' },
  { token: 'pressed', value: 'scale 0.97 + pressed color', use: 'Buttons, cards (0.985), chips (0.96). Instant on press-in, spring back.' },
  { token: 'focus', value: 'focus ring', use: 'Visible on keyboard focus, hidden for mouse clicks.' },
  { token: 'selected', value: 'accent fill / checkmark', use: 'Chips, segmented thumb, list checkmark, current page.' },
  { token: 'disabled', value: `opacity ${opacity.disabled}`, use: 'Not focusable, cursor not-allowed. Explain why nearby if it isn’t obvious.' },
  { token: 'error', value: 'danger ring + message', use: 'Message says how to fix it: “Enter an email like name@company.com.”' },
  { token: 'loading', value: 'spinner / skeleton', use: 'Keep the button size; skeletons match the final layout.' },
];

/** Motion usage. */
export const motionUsage: UsageRow[] = [
  { token: 'instant', value: `${duration.instant}ms`, use: 'Press feedback, row highlight.' },
  { token: 'fast', value: `${duration.fast}ms`, use: 'Hover, color changes, small toggles.' },
  { token: 'base', value: `${duration.base}ms`, use: 'Most transitions, exits.' },
  { token: 'slow', value: `${duration.slow}ms`, use: 'Thumbs sliding, dialogs entering, accordions.' },
  { token: 'slower', value: `${duration.slower}ms`, use: 'Sheets and toasts entering.' },
  { token: 'reduce motion', value: '≈0ms', use: 'All animation collapses when the user asks for reduced motion.' },
];

/** Stacking order. */
export const zIndexUsage: UsageRow[] = Object.entries(zIndex).map(([k, v]) => ({
  token: `z-${k}`,
  value: String(v),
  use: (
    {
      base: 'Page content.',
      raised: 'Overlapping content inside the page (avatar groups, badges).',
      sticky: 'Navigation bar, tab bar, sticky headers.',
      overlay: 'Popovers and menus.',
      modal: 'Dialogs and sheets (native <dialog> uses the top layer).',
      toast: 'Toasts, above everything interactive.',
      tooltip: 'Tooltips.',
    } as Record<string, string>
  )[k],
}));

export interface ComponentSpec {
  component: string;
  height: string;
  padding: string;
  radius: string;
  type: string;
  notes: string;
}

/** Exact measurements per component (web & native share them). */
export const componentSpecs: ComponentSpec[] = [
  { component: 'Button · sm', height: '32', padding: '0 12', radius: 'full', type: 'Subheadline 15 · 600', notes: 'Icon 16, gap 4.' },
  { component: 'Button · md', height: '44', padding: '0 20', radius: '12', type: 'Headline 17 · 600', notes: 'Default. Icon 18, gap 8. Plain: padding 0 8.' },
  { component: 'Button · lg', height: '52', padding: '0 24', radius: '14', type: 'Headline 17 · 600', notes: 'Primary call to action, full-width on phones.' },
  { component: 'Icon button', height: '32 / 44 / 52', padding: '—', radius: 'full', type: '—', notes: 'Square, icon 1.2em. Always has a label.' },
  { component: 'Text field', height: '44 (32 / 52)', padding: '0 12 (8 / 16)', radius: '10 (8 / 14)', type: 'Body 17', notes: 'Label 15 · 500 above, 6 gap. Help text 13 below.' },
  { component: 'Search field', height: '36', padding: '0 8', radius: '10', type: 'Body 17', notes: 'Magnifier 16, gap 6, clear button 18.' },
  { component: 'Text area', height: 'min 88', padding: '10 12', radius: '10', type: 'Body 17', notes: 'Vertical resize only.' },
  { component: 'Select', height: '44', padding: '0 36 0 12', radius: '10', type: 'Body 17', notes: 'Up-down chevron 14 at 12 from the right.' },
  { component: 'Password field', height: '44', padding: '0 12', radius: '10', type: 'Body 17', notes: 'Show/hide button trailing. Strength bar 3 tall.' },
  { component: 'PIN input', height: '56', padding: '—', radius: '10', type: 'Title 2 · 600', notes: 'Cells 48 wide, gap 8, separator 10×2.' },
  { component: 'Switch', height: '31 (24)', padding: '2', radius: 'full', type: '—', notes: '51×31, thumb 27. Stretches 6 while pressed.' },
  { component: 'Checkbox / radio', height: '22', padding: '—', radius: '7 / full', type: 'Body 17', notes: 'Border 1.5, label gap 12, check 14.' },
  { component: 'Segmented control', height: '32 (40)', padding: '2', radius: '9 (thumb 7)', type: 'Footnote 13 · 500', notes: 'Equal-width segments, thumb shadow level 1.' },
  { component: 'Slider', height: '28', padding: '—', radius: 'full', type: '—', notes: 'Track 4, thumb 28.' },
  { component: 'Stepper', height: '36', padding: '—', radius: '10', type: 'Body 17 · 500', notes: 'Buttons 44 wide, value min 36.' },
  { component: 'Chip', height: '32', padding: '0 12', radius: 'full', type: 'Subheadline 15 · 500', notes: 'Gap 8 between chips. Selected = accent fill.' },
  { component: 'Badge', height: '22 (18)', padding: '0 8 (0 6)', radius: 'full', type: 'Caption 12 · 600', notes: 'Dot 6. Count bubble min-width = height.' },
  { component: 'Avatar', height: '24 / 32 / 40 / 56 / 80', padding: '—', radius: 'full · 22.5%', type: 'Initials 40% of size', notes: 'Status dot 28% with 2px ring.' },
  { component: 'List row', height: 'min 44', padding: '8 16', radius: 'group 10', type: 'Body 17', notes: 'Icon tile 29 (r 7), gap 12, chevron 14. Section header 13 uppercase.' },
  { component: 'Card', height: '—', padding: '20 (12 / 32)', radius: '20 (14 / 28)', type: '—', notes: 'Elevated = shadow 2 + hairline. Hover lifts 2px.' },
  { component: 'Alert', height: '—', padding: '16', radius: '14', type: 'Subheadline 15', notes: 'Icon 20, gap 12. Only the icon carries color.' },
  { component: 'Table', height: 'header 40 · row 52', padding: '0 16', radius: 'wrap 14', type: 'Subheadline 15', notes: 'Header 13 · 500 secondary. Tabular numbers, amounts right-aligned.' },
  { component: 'Tabs', height: '44', padding: '0 · gap 24', radius: 'indicator 2', type: 'Subheadline 15 · 500', notes: 'Indicator 2px, label color on selection.' },
  { component: 'Breadcrumbs', height: '20', padding: '—', radius: '—', type: 'Subheadline 15', notes: 'Chevron 12, gap 4. Collapses middle after 4 items.' },
  { component: 'Pagination', height: '36', padding: '0 8', radius: '10', type: 'Subheadline 15 · 500', notes: 'Gap 4, current page = accent fill.' },
  { component: 'Steps', height: 'marker 28', padding: '—', radius: 'full', type: 'Footnote 13 · 500', notes: 'Connector 1.5 with 20 clearance each side.' },
  { component: 'Sidebar item', height: '36', padding: '0 12', radius: '10', type: 'Subheadline 15 · 500', notes: 'Icon 18, gap 12, sections 20 apart.' },
  { component: 'Tab bar', height: '49 + safe area', padding: '6 8', radius: '—', type: '10 · 500', notes: 'Icon 24, label gap 2. Selected = primary label color.' },
  { component: 'Navigation bar', height: '52', padding: '0 16', radius: '—', type: 'Headline 17 · 600', notes: 'Material + 20px blur. Large title 34 · 700.' },
  { component: 'Menu / popover', height: 'item 36', padding: '6 (item 0 12)', radius: '14 (items 8)', type: 'Subheadline 15', notes: 'Min width 200, 6 from trigger, 12 from viewport edge.' },
  { component: 'Tooltip', height: '—', padding: '6 10', radius: '8', type: 'Footnote 13 · 500', notes: 'Inverse colors, 8 from target, 350ms delay.' },
  { component: 'Toast', height: 'min 48', padding: '8 20 8 16', radius: 'full', type: 'Subheadline 15 · 500', notes: 'Top center, 16 from edge. 3.2s default.' },
  { component: 'Dialog', height: '—', padding: '24', radius: '28', type: 'Title 3 · 600 / Subheadline 15', notes: 'Width 420 (alert 320). Actions gap 8.' },
  { component: 'Bottom sheet', height: 'max 92%', padding: 'header 8 16 · body 0 20 24', radius: '28 top', type: 'Headline 17', notes: 'Grabber 36×5. Centered card (540) on desktop.' },
  { component: 'Action sheet', height: 'row 56', padding: 'inset 8', radius: '14', type: 'Title 3 20', notes: 'Cancel in its own group, 8 above, semibold.' },
  { component: 'Empty state', height: '—', padding: '40 16', radius: 'icon full', type: 'Title 3 / Subheadline', notes: 'Icon circle 56, max width 360, centered.' },
  { component: 'File drop', height: '—', padding: '32 16', radius: '14', type: 'Subheadline 15 · 600', notes: 'Dashed 1.5 border, icon 44.' },
  { component: 'Progress / spinner', height: '4 (8) · 16/20/32', padding: '—', radius: 'full', type: '—', notes: 'Spinner has 8 spokes and steps at 0.9s.' },
];
