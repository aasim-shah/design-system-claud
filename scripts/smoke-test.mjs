// Fast sanity checks that run without a browser or a simulator:
//  1. tokens: every semantic role exists in both schemes; key pairs meet contrast.
//  2. web: every component server-renders (Next.js SSR safety).
import assert from 'node:assert/strict';
import { createElement as h } from 'react';
import { renderToString } from 'react-dom/server';
import * as T from '@lumen/tokens';
import * as UI from '@lumen/react';
import * as Icons from '@lumen/icons';

let passed = 0;
const test = (name, fn) => {
  try {
    fn();
    passed++;
  } catch (e) {
    console.error(`✗ ${name}\n  ${e.message}`);
    process.exitCode = 1;
  }
};

/* ---------- tokens ---------- */
const keys = (o, p = '') =>
  Object.entries(o).flatMap(([k, v]) => (typeof v === 'object' ? keys(v, `${p}${k}.`) : [`${p}${k}`]));

test('light & dark define the same semantic roles', () => {
  assert.deepEqual(keys(T.semantic.light).sort(), keys(T.semantic.dark).sort());
});

for (const scheme of ['light', 'dark']) {
  const c = T.semantic[scheme];
  test(`${scheme}: label on background ≥ 7:1`, () => {
    assert.ok(T.contrastRatio(c.label.primary, c.background.primary) >= 7);
  });
  for (const intent of ['accent', 'danger', 'info']) {
    test(`${scheme}: text on filled ${intent} ≥ 3:1 (large/bold UI text)`, () => {
      const r = T.contrastRatio(c[intent].on, c[intent].default);
      assert.ok(r >= 3, `ratio ${r.toFixed(2)}`);
    });
  }
}

test('brand accent derivation', () => {
  const a = T.intentFrom('#5E5CE6', 'light');
  assert.equal(a.default, '#5E5CE6');
  assert.match(a.subtle, /^rgba\(94, 92, 230, 0\.12\)$/);
  assert.equal(a.on, '#FFFFFF');
  assert.equal(T.intentFrom('#FFD60A', 'dark').on, '#000000');
});

test('css output contains light, dark & media blocks', () => {
  const css = T.createThemeCss({ accent: '#FF2D55' });
  assert.ok(css.includes('--lm-color-accent: #FF2D55'));
  assert.ok(css.includes('[data-theme="dark"]'));
  assert.ok(css.includes('@media (prefers-color-scheme: dark)'));
});

const { default: preset } = await import('@lumen/tokens/tailwind');
test('tailwind preset maps to CSS variables', () => {
  assert.equal(preset.theme.extend.colors.accent.DEFAULT, 'var(--lm-color-accent)');
});

/* ---------- web components (SSR) ---------- */
const noop = () => {};
const cases = {
  Text: h(UI.Text, { variant: 'title1' }, 'Hello'),
  Stack: h(UI.HStack, { gap: 4 }, h(UI.VStack, null, 'a')),
  Button: h(UI.Button, { variant: 'tinted', loading: true }, 'Save'),
  ButtonLink: h(UI.Button, { href: '/x' }, 'Go'),
  IconButton: h(UI.IconButton, { label: 'Add', icon: h(UI.PlusIcon) }),
  TextField: h(UI.TextField, { label: 'Name', error: 'Required', clearable: true, defaultValue: 'x' }),
  SearchField: h(UI.SearchField),
  TextArea: h(UI.TextArea, { label: 'Notes' }),
  Select: h(UI.Select, { label: 'Pick', options: [{ value: 'a', label: 'A' }] }),
  Switch: h(UI.Switch, { defaultChecked: true, 'aria-label': 'x' }),
  Checkbox: h(UI.Checkbox, { label: 'Agree', description: 'desc' }),
  Radio: h(UI.RadioGroup, { defaultValue: 'a' }, h(UI.Radio, { value: 'a', label: 'A' })),
  Segmented: h(UI.SegmentedControl, { options: [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }], defaultValue: 'b' }),
  Slider: h(UI.Slider, { defaultValue: 30 }),
  Card: h(UI.Card, { onClick: noop }, 'c'),
  List: h(UI.ListSection, { header: 'H', footer: 'F' }, h(UI.List, null, h(UI.ListItem, { title: 'Row', detail: 'On', onClick: noop }), h(UI.ListItem, { title: 'Row 2', selected: true }))),
  Badge: h(UI.Badge, { count: 120 }),
  Avatar: h(UI.Avatar, { name: 'Jane Appleseed', status: true }),
  Divider: h(UI.Divider),
  Spinner: h(UI.Spinner),
  Progress: h(UI.Progress, { value: 40 }),
  Skeleton: h(UI.Skeleton, { shape: 'text' }),
  NavigationBar: h(UI.NavigationBar, { title: 'T', largeTitle: 'Large' }),
  Dialog: h(UI.Dialog, { open: false, onClose: noop, title: 'x' }),
  Sheet: h(UI.Sheet, { open: false, onClose: noop, title: 'x' }),
  Form: h(UI.Form, null, h(UI.FormSection, { title: 'A', description: 'B' }, h(UI.FormRow, null, h(UI.TextField, { label: 'x' }))), h(UI.FormActions, null, 'go')),
  Breadcrumbs: h(UI.Breadcrumbs, { items: [{ label: 'A', href: '/' }, { label: 'B', href: '/' }, { label: 'C', href: '/' }, { label: 'D', href: '/' }, { label: 'E' }], maxItems: 3 }),
  Tabs: h(UI.Tabs, { items: [{ value: 'a', label: 'A', content: 'pa' }, { value: 'b', label: 'B', content: 'pb' }], defaultValue: 'b' }),
  Pagination: h(UI.Pagination, { page: 5, pageCount: 20, onPageChange: noop }),
  TabBar: h(UI.TabBar, { value: 'a', items: [{ value: 'a', label: 'A', icon: 'i', badge: 2 }] }),
  Sidebar: h(UI.Sidebar, { value: 'a', sections: [{ heading: 'H', items: [{ value: 'a', label: 'A', count: 3 }] }] }),
  Accordion: h(UI.Accordion, { items: [{ value: 'a', title: 'T', content: 'C' }], defaultValue: ['a'] }),
  Menu: h(UI.Menu, { trigger: (p) => h('button', p, 'm'), items: [{ label: 'A' }, { type: 'separator' }] }),
  Tooltip: h(UI.Tooltip, { content: 'tip' }, h('button', null, 'b')),
  ActionSheet: h(UI.ActionSheet, { open: false, onClose: noop, actions: [{ label: 'A' }] }),
  Alert: h(UI.Alert, { tone: 'warning', title: 'T', onDismiss: noop }, 'body'),
  EmptyState: h(UI.EmptyState, { title: 'Empty', description: 'D' }),
  Kbd: h(UI.Kbd, null, 'K'),
  Table: h(UI.Table, { columns: [{ key: 'a', header: 'A' }], rows: [{ a: 1 }], rowKey: (r) => r.a }),
  Steps: h(UI.Steps, { steps: [{ label: 'A' }, { label: 'B' }, { label: 'C' }], current: 1 }),
  Chip: h(UI.ChipGroup, null, h(UI.Chip, { selected: true, onSelectedChange: noop }, 'A'), h(UI.Chip, { onRemove: noop }, 'B')),
  Stepper: h(UI.Stepper, { label: 'Qty', defaultValue: 2 }),
  PinInput: h(UI.PinInput, { length: 6, groupSize: 3, defaultValue: '12' }),
  PasswordField: h(UI.PasswordField, { label: 'Password', showStrength: true, defaultValue: 'Abc12345!' }),
  FileDrop: h(UI.FileDrop, { label: 'Upload', hint: 'PNG' }),
  IconCircle: h(UI.IconCircle, { icon: h(UI.WifiIcon), variant: 'tinted', color: 'red' }),
  AllIcons: h('div', null, ...Icons.iconNames.map((n) => h(UI.LumenIcon, { key: n, name: n }))),
  Providers: h(UI.ThemeProvider, { accent: '#FF2D55' }, h(UI.ToastProvider, null, 'app')),
};

for (const [name, el] of Object.entries(cases)) {
  test(`SSR <${name}>`, () => {
    const html = renderToString(el);
    assert.ok(html.length > 0);
  });
}

test('pagination collapses long ranges', () => {
  assert.deepEqual(UI.pageRange(5, 20), [1, 'gap', 4, 5, 6, 'gap', 20]);
  assert.deepEqual(UI.pageRange(2, 5), [1, 2, 3, 4, 5]);
  assert.deepEqual(UI.pageRange(4, 10), [1, 2, 3, 4, 5, 'gap', 10]);
});

test('password strength scoring', () => {
  assert.equal(UI.passwordStrength('abc'), 0);
  assert.equal(UI.passwordStrength('Abcdefgh12!?xyz'), 4);
});

test('specs cover the component set', () => {
  assert.ok(T.componentSpecs.length >= 35);
  assert.ok(T.spacingUsage.every((r) => r.use.length > 0));
});

test('every icon is categorised exactly once and exported as a component', () => {
  const listed = Object.values(Icons.iconCategories).flat();
  assert.equal(listed.length, Icons.iconNames.length);
  assert.deepEqual([...listed].sort(), [...Icons.iconNames].sort());
  for (const n of Icons.iconNames) {
    const name = n.replace(/(^|-)(\w)/g, (_, __, c) => c.toUpperCase()) + 'Icon';
    assert.ok(UI[name], `missing export ${name}`);
  }
});

test('SSR markup details', () => {
  assert.match(renderToString(cases.Breadcrumbs), /aria-current="page"/);
  assert.match(renderToString(cases.Breadcrumbs), /…/);
  assert.match(renderToString(cases.Steps), /data-state="complete"/);
  assert.match(renderToString(cases.Badge), />99\+</);
  assert.match(renderToString(cases.Avatar), />JA</);
  assert.match(renderToString(cases.Segmented), /--lm-seg-index:1/);
  assert.match(renderToString(cases.Providers), /--lm-color-accent: #FF2D55/);
});

console.log(process.exitCode ? `\n${passed} passed, some failed` : `✓ ${passed} checks passed`);
