/**
 * Lumen Rounded — the icon language of the design system.
 *
 * Drawn on a 24×24 grid with a 1.75 stroke, round caps & joins, generous
 * 2–3.5 corner radii and small filled dots as a signature detail. Every
 * icon is described once here as plain data and rendered by the React
 * (`@lumen/icons/react`) and React Native (`@lumen/icons/native`) entries.
 */

export type IconNode =
  | ['path', { d: string }]
  | ['circle', { cx: number; cy: number; r: number; fill?: boolean }]
  | ['rect', { x: number; y: number; width: number; height: number; rx: number }];

const p = (d: string): IconNode => ['path', { d }];
const c = (cx: number, cy: number, r: number, fill = false): IconNode => ['circle', { cx, cy, r, fill }];
const dot = (cx: number, cy: number, r = 1.1): IconNode => c(cx, cy, r, true);
const r = (x: number, y: number, width: number, height: number, rx: number): IconNode => ['rect', { x, y, width, height, rx }];

export const icons = {
  /* Navigation & chrome */
  home: [p('M4 10.5l7.3-5.9a1.1 1.1 0 0 1 1.4 0L20 10.5'), p('M6 9v9.5A1.5 1.5 0 0 0 7.5 20h9a1.5 1.5 0 0 0 1.5-1.5V9'), p('M10 20v-4a2 2 0 0 1 4 0v4')],
  search: [c(11, 11, 6.5), p('M16 16l4 4')],
  bell: [p('M5 17.5h14l-1.5-2V11a5.5 5.5 0 0 0-11 0v4.5z'), p('M10 20.5a2.2 2.2 0 0 0 4 0')],
  user: [c(12, 8.5, 3.75), p('M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5')],
  users: [c(9.5, 9, 3.25), p('M3.5 19.5c.6-3 3-4.75 6-4.75s5.4 1.75 6 4.75'), p('M15.5 5.9a3.25 3.25 0 0 1 0 6.2'), p('M17.5 14.9c1.6.6 2.7 2 3 4.1')],
  settings: [p('M4 7h9.5M18.5 7H20M4 17h1.5M10.5 17H20'), c(16, 7, 2.5), c(8, 17, 2.5)],
  menu: [p('M4.5 7h15M4.5 12h15M4.5 17h9')],
  sidebar: [r(3.5, 4.5, 17, 15, 3.5), p('M9.5 4.5v15')],
  grid: [r(4, 4, 6.5, 6.5, 2), r(13.5, 4, 6.5, 6.5, 2), r(4, 13.5, 6.5, 6.5, 2), r(13.5, 13.5, 6.5, 6.5, 3.25)],
  'list-bullets': [p('M9 6.5h11M9 12h11M9 17.5h11'), dot(4.75, 6.5), dot(4.75, 12), dot(4.75, 17.5)],
  'chevron-right': [p('M9.5 5.5L16 12l-6.5 6.5')],
  'chevron-left': [p('M14.5 5.5L8 12l6.5 6.5')],
  'chevron-down': [p('M5.5 9.5L12 16l6.5-6.5')],
  'chevron-up': [p('M5.5 14.5L12 8l6.5 6.5')],
  'chevron-up-down': [p('M8 9.5l4-4 4 4M8 14.5l4 4 4-4')],
  'arrow-right': [p('M4.5 12h15M13.5 6l6 6-6 6')],
  'arrow-left': [p('M19.5 12h-15M10.5 6l-6 6 6 6')],
  'arrow-up': [p('M12 19.5v-15M6 10.5l6-6 6 6')],
  'arrow-down': [p('M12 4.5v15M6 13.5l6 6 6-6')],
  'arrow-up-right': [p('M7 17L17 7M8.5 7H17v8.5')],
  external: [p('M13.5 4.5h6v6M19.5 4.5l-8 8'), p('M17.5 14v3.5a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2H10')],
  logout: [p('M14.5 4.5H7a2.5 2.5 0 0 0-2.5 2.5v10A2.5 2.5 0 0 0 7 19.5h7.5'), p('M10.5 12h10M17 8.5l3.5 3.5-3.5 3.5')],

  /* Actions */
  plus: [p('M12 5v14M5 12h14')],
  minus: [p('M5 12h14')],
  close: [p('M6.5 6.5l11 11M17.5 6.5l-11 11')],
  check: [p('M5 12.5l4.5 4.5L19 7.5')],
  edit: [p('M4.5 19.5l.9-4 10-10a2.1 2.1 0 0 1 3 3l-10 10z'), p('M13.5 7.5l3 3')],
  trash: [p('M4.5 7h15'), p('M9.5 7V5.5A1.5 1.5 0 0 1 11 4h2a1.5 1.5 0 0 1 1.5 1.5V7'), p('M6.5 7l.8 11.6A1.5 1.5 0 0 0 8.8 20h6.4a1.5 1.5 0 0 0 1.5-1.4L17.5 7'), p('M10.5 11v5M13.5 11v5')],
  copy: [r(8.5, 8.5, 11, 11, 3), p('M15.5 8.5v-2a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2')],
  share: [p('M12 14.5V4M8 7.5l4-4 4 4'), p('M8 10.5H7a2 2 0 0 0-2 2V18a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5.5a2 2 0 0 0-2-2h-1')],
  download: [p('M12 4v11M7.5 10.5L12 15l4.5-4.5'), p('M5 19.5h14')],
  upload: [p('M12 15V4M7.5 8.5L12 4l4.5 4.5'), p('M5 19.5h14')],
  link: [p('M10 14a4 4 0 0 0 5.66 0l2.83-2.83a4 4 0 0 0-5.66-5.66L11.5 6.8'), p('M14 10a4 4 0 0 0-5.66 0L5.5 12.84a4 4 0 0 0 5.66 5.66l1.34-1.34')],
  more: [dot(6, 12, 1.4), dot(12, 12, 1.4), dot(18, 12, 1.4)],
  'more-vertical': [dot(12, 6, 1.4), dot(12, 12, 1.4), dot(12, 18, 1.4)],
  filter: [p('M4.5 6.5h15M7.5 12h9M10.5 17.5h3')],
  sort: [p('M7 5v14M4 16l3 3 3-3M17 19V5M14 8l3-3 3 3')],
  refresh: [p('M19.5 12a7.5 7.5 0 1 1-2.2-5.3'), p('M19.5 4.5v4h-4')],
  send: [p('M20.5 3.5L10 14'), p('M20.5 3.5l-6.5 17-4-6.5-6.5-4z')],
  bolt: [p('M13 3.5L5.5 13.5H12l-1 7 7.5-10H12z')],
  sparkle: [p('M11 3.5c.6 4.3 2.2 5.9 6.5 6.5-4.3.6-5.9 2.2-6.5 6.5-.6-4.3-2.2-5.9-6.5-6.5 4.3-.6 5.9-2.2 6.5-6.5z'), dot(18.5, 18.5, 1.3)],

  /* Objects */
  mail: [r(3.5, 5.5, 17, 13, 3.5), p('M4.5 8l6.3 4.4a2 2 0 0 0 2.4 0L19.5 8')],
  phone: [p('M6.2 4h2.3l1.5 4-2 1.3a10 10 0 0 0 6.7 6.7l1.3-2 4 1.5v2.3a2.2 2.2 0 0 1-2.4 2.2C10.6 19.4 4.6 13.4 4 6.4A2.2 2.2 0 0 1 6.2 4z')],
  message: [p('M20 11.5c0 4.1-3.6 7.5-8 7.5a8.6 8.6 0 0 1-3.3-.6L4.5 19.5l1.2-3.4A7.2 7.2 0 0 1 4 11.5C4 7.4 7.6 4 12 4s8 3.4 8 7.5z'), dot(8.5, 11.5, 1), dot(12, 11.5, 1), dot(15.5, 11.5, 1)],
  calendar: [r(3.5, 5, 17, 15, 3.5), p('M3.5 10h17M8 3v4M16 3v4'), dot(8.5, 14.5)],
  clock: [c(12, 12, 8.5), p('M12 7.5V12l3 2')],
  camera: [p('M4 9a2 2 0 0 1 2-2h1.8l1.3-2h5.8l1.3 2H18a2 2 0 0 1 2 2v8.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z'), c(12, 13, 3.5)],
  image: [r(3.5, 4.5, 17, 15, 3.5), dot(9, 9.5, 1.6), p('M4 17l4.5-4.5a1.5 1.5 0 0 1 2.1 0L15 17l1.4-1.4a1.5 1.5 0 0 1 2.1 0l1.5 1.5')],
  video: [r(3.5, 6, 12, 12, 3), p('M15.5 10.5L20.5 8v8l-5-2.5')],
  mic: [r(9, 3.5, 6, 11, 3), p('M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v2.5')],
  play: [p('M7.5 5.2v13.6a1 1 0 0 0 1.5.9l10.7-6.8a1 1 0 0 0 0-1.8L9 4.3a1 1 0 0 0-1.5.9z')],
  pause: [r(6.5, 5, 3.5, 14, 1.5), r(14, 5, 3.5, 14, 1.5)],
  file: [p('M13.5 3.5H8A2.5 2.5 0 0 0 5.5 6v12A2.5 2.5 0 0 0 8 20.5h8a2.5 2.5 0 0 0 2.5-2.5V8.5z'), p('M13.5 3.5V7A1.5 1.5 0 0 0 15 8.5h3.5')],
  folder: [p('M3.5 7.5A2.5 2.5 0 0 1 6 5h3.2a2 2 0 0 1 1.5.7L12 7.3h6a2.5 2.5 0 0 1 2.5 2.5v7.7a2.5 2.5 0 0 1-2.5 2.5H6a2.5 2.5 0 0 1-2.5-2.5z')],
  inbox: [p('M3.5 13.5h4.3a1 1 0 0 1 .9.6l.6 1.3a1 1 0 0 0 .9.6h3.6a1 1 0 0 0 .9-.6l.6-1.3a1 1 0 0 1 .9-.6h4.3'), p('M6.7 5h10.6a2 2 0 0 1 1.9 1.4l1.3 4.6V17a2.5 2.5 0 0 1-2.5 2.5h-12A2.5 2.5 0 0 1 3.5 17v-6l1.3-4.6A2 2 0 0 1 6.7 5z')],
  archive: [r(3.5, 4.5, 17, 4.5, 2), p('M5 9v8.5A2.5 2.5 0 0 0 7.5 20h9a2.5 2.5 0 0 0 2.5-2.5V9'), p('M10 13h4')],
  bookmark: [p('M7.5 3.5h9a2 2 0 0 1 2 2V20L12 16l-6.5 4V5.5a2 2 0 0 1 2-2z')],
  heart: [p('M12 19.5s-7.5-4.4-7.5-10A4.3 4.3 0 0 1 12 6.8a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10-7.5 10z')],
  star: [p('M12 3.8l2.4 5 5.4.7-4 3.8 1 5.4L12 16.1l-4.8 2.6 1-5.4-4-3.8 5.4-.7z')],
  tag: [p('M3.5 11.2V5.5a2 2 0 0 1 2-2h5.7a2 2 0 0 1 1.4.6l7.6 7.6a2 2 0 0 1 0 2.8l-5.7 5.7a2 2 0 0 1-2.8 0l-7.6-7.6a2 2 0 0 1-.6-1.4z'), dot(8, 8, 1.4)],
  flag: [p('M5.5 20.5v-16M5.5 4.5h11l-2 4 2 4h-11')],
  gift: [r(4, 8, 16, 4, 1.5), p('M5.5 12v6a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-6M12 8v12'), p('M12 8C10.5 4 7 4 7 6s3 2 5 2c2 0 5 0 5-2s-3.5-2-5 2z')],
  cart: [p('M3.5 4.5h2l2 10.5A1.5 1.5 0 0 0 9 16.2h8.2a1.5 1.5 0 0 0 1.5-1.1l1.5-6.6H6.6'), dot(9.5, 19.5, 1.3), dot(17, 19.5, 1.3)],
  bag: [p('M5.5 8h13l-.9 10.7a2 2 0 0 1-2 1.8H8.4a2 2 0 0 1-2-1.8z'), p('M9 10.5V7a3 3 0 0 1 6 0v3.5')],
  'credit-card': [r(3, 5.5, 18, 13, 3), p('M3 10h18M7 14.5h3')],
  chart: [p('M5.5 19v-5.5M10 19V5.5M14.5 19v-8M19 19V9')],
  globe: [c(12, 12, 8.5), p('M3.5 12h17'), p('M12 3.5c2.3 2.3 3.5 5.2 3.5 8.5s-1.2 6.2-3.5 8.5c-2.3-2.3-3.5-5.2-3.5-8.5s1.2-6.2 3.5-8.5z')],
  'map-pin': [p('M12 20.5s-6.5-5.4-6.5-10.5a6.5 6.5 0 0 1 13 0c0 5.1-6.5 10.5-6.5 10.5z'), c(12, 10, 2.2)],
  lock: [r(5, 10.5, 14, 10, 3), p('M8 10.5V8a4 4 0 0 1 8 0v2.5'), dot(12, 15.5, 1.3)],
  unlock: [r(5, 10.5, 14, 10, 3), p('M8 10.5V8a4 4 0 0 1 7.7-1.5'), dot(12, 15.5, 1.3)],
  key: [c(8, 15.5, 4), p('M11 12.5L19.5 4M16 7.5l2.5 2.5')],
  shield: [p('M12 3.5l7 2.8v5.2c0 4.5-3 7.8-7 9-4-1.2-7-4.5-7-9V6.3z'), p('M9 12l2 2 4-4')],
  eye: [p('M2.5 12c2-4.3 5.3-6.5 9.5-6.5s7.5 2.2 9.5 6.5c-2 4.3-5.3 6.5-9.5 6.5S4.5 16.3 2.5 12z'), c(12, 12, 3)],
  'eye-off': [p('M4 4l16 16'), p('M9.9 5.8a10 10 0 0 1 2.1-.3c4.2 0 7.5 2.2 9.5 6.5a13 13 0 0 1-2.8 3.9'), p('M16.2 17.4a9.6 9.6 0 0 1-4.2 1.1c-4.2 0-7.5-2.2-9.5-6.5a13 13 0 0 1 3.4-4.3'), p('M10 10a3 3 0 0 0 4.1 4.1')],

  /* Device & system */
  wifi: [p('M3 9.3a13 13 0 0 1 18 0'), p('M6 12.6a8.6 8.6 0 0 1 12 0'), p('M9 15.8a4.3 4.3 0 0 1 6 0'), dot(12, 19, 1.3)],
  bluetooth: [p('M7 7.5l10 9-5 4v-17l5 4-10 9')],
  battery: [r(3, 7.5, 16, 9, 3), p('M21.5 10.5v3M6.5 10.5v3M9.5 10.5v3')],
  moon: [p('M19.5 14.5a8 8 0 0 1-10-10 8 8 0 1 0 10 10z')],
  sun: [c(12, 12, 4), p('M12 3v1.5M12 19.5V21M3 12h1.5M19.5 12H21M5.6 5.6l1.1 1.1M17.3 17.3l1.1 1.1M5.6 18.4l1.1-1.1M17.3 6.7l1.1-1.1')],
  cloud: [p('M7 18.5a4.5 4.5 0 0 1-.6-9A6 6 0 0 1 18 10a4.3 4.3 0 0 1-.5 8.5z')],

  /* Status */
  info: [c(12, 12, 8.5), p('M12 11v5'), dot(12, 7.9)],
  help: [c(12, 12, 8.5), p('M9.7 9.5a2.4 2.4 0 1 1 3.4 2.2c-.7.4-1.1.9-1.1 1.8'), dot(12, 16.6, 1)],
  alert: [p('M10.3 4.7L3.2 17a2 2 0 0 0 1.7 3h14.2a2 2 0 0 0 1.7-3L13.7 4.7a2 2 0 0 0-3.4 0z'), p('M12 9.5v4'), dot(12, 16.8)],
  'check-circle': [c(12, 12, 8.5), p('M8.5 12.3l2.3 2.3 4.7-4.8')],
  'x-circle': [c(12, 12, 8.5), p('M9.5 9.5l5 5M14.5 9.5l-5 5')],
} satisfies Record<string, IconNode[]>;

export type IconName = keyof typeof icons;

export const iconNames = Object.keys(icons) as IconName[];

/** Default stroke for the set. Small sizes (≤16) read better at 2. */
export const ICON_STROKE = 1.75;

export const iconCategories: Record<string, IconName[]> = {
  Navigation: ['home', 'search', 'bell', 'user', 'users', 'settings', 'menu', 'sidebar', 'grid', 'list-bullets', 'chevron-right', 'chevron-left', 'chevron-down', 'chevron-up', 'chevron-up-down', 'arrow-right', 'arrow-left', 'arrow-up', 'arrow-down', 'arrow-up-right', 'external', 'logout'],
  Actions: ['plus', 'minus', 'close', 'check', 'edit', 'trash', 'copy', 'share', 'download', 'upload', 'link', 'more', 'more-vertical', 'filter', 'sort', 'refresh', 'send', 'bolt', 'sparkle'],
  Objects: ['mail', 'phone', 'message', 'calendar', 'clock', 'camera', 'image', 'video', 'mic', 'play', 'pause', 'file', 'folder', 'inbox', 'archive', 'bookmark', 'heart', 'star', 'tag', 'flag', 'gift', 'cart', 'bag', 'credit-card', 'chart', 'globe', 'map-pin', 'lock', 'unlock', 'key', 'shield', 'eye', 'eye-off'],
  System: ['wifi', 'bluetooth', 'battery', 'moon', 'sun', 'cloud', 'info', 'help', 'alert', 'check-circle', 'x-circle'],
};
