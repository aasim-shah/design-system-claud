import { forwardRef, type ForwardRefExoticComponent, type RefAttributes, type SVGProps } from 'react';
import { icons, ICON_STROKE, type IconName, type IconNode } from './data.js';

export interface IconProps extends SVGProps<SVGSVGElement> {
  /** Any CSS length. Defaults to 1.15em so icons scale with the text beside them. */
  size?: number | string;
  /** Accessible label. Omit for decorative icons (they get aria-hidden). */
  label?: string;
}

const cx = (...v: (string | undefined | false)[]) => v.filter(Boolean).join(' ');

/**
 * Base <svg> for Lumen icons, or for your own 24px stroke paths:
 *   <Icon><path d="…" /></Icon>
 */
export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
  { size, label, className, style, children, strokeWidth = ICON_STROKE, ...rest },
  ref,
) {
  return (
    <svg
      ref={ref}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
      focusable="false"
      className={cx('lm-icon', className)}
      style={size !== undefined ? { ...style, ['--lm-icon-size' as string]: typeof size === 'number' ? `${size}px` : size } : style}
      {...rest}
    >
      {children}
    </svg>
  );
});

export function renderNodes(nodes: readonly IconNode[]) {
  return nodes.map(([tag, attrs], i) => {
    if (tag === 'path') return <path key={i} d={attrs.d} />;
    if (tag === 'circle')
      return <circle key={i} cx={attrs.cx} cy={attrs.cy} r={attrs.r} fill={attrs.fill ? 'currentColor' : undefined} stroke={attrs.fill ? 'none' : undefined} />;
    return <rect key={i} x={attrs.x} y={attrs.y} width={attrs.width} height={attrs.height} rx={attrs.rx} />;
  });
}

export type LumenIconComponent = ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;

export function createIcon(name: IconName): LumenIconComponent {
  const C = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
    <Icon ref={ref} data-icon={name} {...props}>
      {renderNodes(icons[name] as readonly IconNode[])}
    </Icon>
  ));
  C.displayName = name.replace(/(^|-)(\w)/g, (_, __, ch: string) => ch.toUpperCase()) + 'Icon';
  return C;
}

/** Render any icon by name: <LumenIcon name="home" /> */
export const LumenIcon = forwardRef<SVGSVGElement, IconProps & { name: IconName }>(function LumenIcon({ name, ...props }, ref) {
  return (
    <Icon ref={ref} data-icon={name} {...props}>
      {renderNodes(icons[name] as readonly IconNode[])}
    </Icon>
  );
});

export { icons, iconNames, iconCategories, ICON_STROKE, type IconName } from './data.js';

export const HomeIcon = createIcon('home');
export const SearchIcon = createIcon('search');
export const BellIcon = createIcon('bell');
export const UserIcon = createIcon('user');
export const UsersIcon = createIcon('users');
export const SettingsIcon = createIcon('settings');
export const MenuIcon = createIcon('menu');
export const SidebarIcon = createIcon('sidebar');
export const GridIcon = createIcon('grid');
export const ListBulletsIcon = createIcon('list-bullets');
export const ChevronRightIcon = createIcon('chevron-right');
export const ChevronLeftIcon = createIcon('chevron-left');
export const ChevronDownIcon = createIcon('chevron-down');
export const ChevronUpIcon = createIcon('chevron-up');
export const ChevronUpDownIcon = createIcon('chevron-up-down');
export const ArrowRightIcon = createIcon('arrow-right');
export const ArrowLeftIcon = createIcon('arrow-left');
export const ArrowUpIcon = createIcon('arrow-up');
export const ArrowDownIcon = createIcon('arrow-down');
export const ArrowUpRightIcon = createIcon('arrow-up-right');
export const ExternalIcon = createIcon('external');
export const LogoutIcon = createIcon('logout');
export const PlusIcon = createIcon('plus');
export const MinusIcon = createIcon('minus');
export const CloseIcon = createIcon('close');
export const CheckIcon = createIcon('check');
export const EditIcon = createIcon('edit');
export const TrashIcon = createIcon('trash');
export const CopyIcon = createIcon('copy');
export const ShareIcon = createIcon('share');
export const DownloadIcon = createIcon('download');
export const UploadIcon = createIcon('upload');
export const LinkIcon = createIcon('link');
export const MoreIcon = createIcon('more');
export const MoreVerticalIcon = createIcon('more-vertical');
export const FilterIcon = createIcon('filter');
export const SortIcon = createIcon('sort');
export const RefreshIcon = createIcon('refresh');
export const SendIcon = createIcon('send');
export const BoltIcon = createIcon('bolt');
export const SparkleIcon = createIcon('sparkle');
export const MailIcon = createIcon('mail');
export const PhoneIcon = createIcon('phone');
export const MessageIcon = createIcon('message');
export const CalendarIcon = createIcon('calendar');
export const ClockIcon = createIcon('clock');
export const CameraIcon = createIcon('camera');
export const ImageIcon = createIcon('image');
export const VideoIcon = createIcon('video');
export const MicIcon = createIcon('mic');
export const PlayIcon = createIcon('play');
export const PauseIcon = createIcon('pause');
export const FileIcon = createIcon('file');
export const FolderIcon = createIcon('folder');
export const InboxIcon = createIcon('inbox');
export const ArchiveIcon = createIcon('archive');
export const BookmarkIcon = createIcon('bookmark');
export const HeartIcon = createIcon('heart');
export const StarIcon = createIcon('star');
export const TagIcon = createIcon('tag');
export const FlagIcon = createIcon('flag');
export const GiftIcon = createIcon('gift');
export const CartIcon = createIcon('cart');
export const BagIcon = createIcon('bag');
export const CreditCardIcon = createIcon('credit-card');
export const ChartIcon = createIcon('chart');
export const GlobeIcon = createIcon('globe');
export const MapPinIcon = createIcon('map-pin');
export const LockIcon = createIcon('lock');
export const UnlockIcon = createIcon('unlock');
export const KeyIcon = createIcon('key');
export const ShieldIcon = createIcon('shield');
export const EyeIcon = createIcon('eye');
export const EyeOffIcon = createIcon('eye-off');
export const WifiIcon = createIcon('wifi');
export const BluetoothIcon = createIcon('bluetooth');
export const BatteryIcon = createIcon('battery');
export const MoonIcon = createIcon('moon');
export const SunIcon = createIcon('sun');
export const CloudIcon = createIcon('cloud');
export const InfoIcon = createIcon('info');
export const HelpIcon = createIcon('help');
export const AlertIcon = createIcon('alert');
export const CheckCircleIcon = createIcon('check-circle');
export const XCircleIcon = createIcon('x-circle');