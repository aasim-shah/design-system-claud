/**
 * React Native entry. Requires `react-native-svg` (Expo: `npx expo install react-native-svg`).
 *
 *   import { HomeIcon } from '@lumen/icons/native';
 *   <HomeIcon size={22} color={theme.colors.label.primary} />
 */
import { memo, type NamedExoticComponent } from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import type { StyleProp, ViewStyle } from 'react-native';
import { icons, ICON_STROKE, type IconName, type IconNode } from './data.js';

export interface NativeIconProps {
  /** @default 24 */
  size?: number;
  /** @default '#000' — pass a theme color, e.g. theme.colors.label.primary */
  color?: string;
  strokeWidth?: number;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

function renderNodes(nodes: readonly IconNode[], color: string) {
  return nodes.map(([tag, a], i) => {
    if (tag === 'path') return <Path key={i} d={a.d} />;
    if (tag === 'circle') return <Circle key={i} cx={a.cx} cy={a.cy} r={a.r} fill={a.fill ? color : 'none'} stroke={a.fill ? 'none' : color} />;
    return <Rect key={i} x={a.x} y={a.y} width={a.width} height={a.height} rx={a.rx} />;
  });
}

export function NativeIcon({
  name,
  size = 24,
  color = '#000000',
  strokeWidth = ICON_STROKE,
  accessibilityLabel,
  style,
}: NativeIconProps & { name: IconName }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      accessibilityLabel={accessibilityLabel}
      accessible={!!accessibilityLabel}
      style={style}
    >
      {renderNodes(icons[name] as readonly IconNode[], color)}
    </Svg>
  );
}

export function createNativeIcon(name: IconName): NamedExoticComponent<NativeIconProps> {
  const C = memo((props: NativeIconProps) => <NativeIcon name={name} {...props} />);
  C.displayName = name.replace(/(^|-)(\w)/g, (_, __, ch: string) => ch.toUpperCase()) + 'Icon';
  return C;
}

export { icons, iconNames, iconCategories, ICON_STROKE, type IconName } from './data.js';

export const HomeIcon = createNativeIcon('home');
export const SearchIcon = createNativeIcon('search');
export const BellIcon = createNativeIcon('bell');
export const UserIcon = createNativeIcon('user');
export const UsersIcon = createNativeIcon('users');
export const SettingsIcon = createNativeIcon('settings');
export const MenuIcon = createNativeIcon('menu');
export const SidebarIcon = createNativeIcon('sidebar');
export const GridIcon = createNativeIcon('grid');
export const ListBulletsIcon = createNativeIcon('list-bullets');
export const ChevronRightIcon = createNativeIcon('chevron-right');
export const ChevronLeftIcon = createNativeIcon('chevron-left');
export const ChevronDownIcon = createNativeIcon('chevron-down');
export const ChevronUpIcon = createNativeIcon('chevron-up');
export const ChevronUpDownIcon = createNativeIcon('chevron-up-down');
export const ArrowRightIcon = createNativeIcon('arrow-right');
export const ArrowLeftIcon = createNativeIcon('arrow-left');
export const ArrowUpIcon = createNativeIcon('arrow-up');
export const ArrowDownIcon = createNativeIcon('arrow-down');
export const ArrowUpRightIcon = createNativeIcon('arrow-up-right');
export const ExternalIcon = createNativeIcon('external');
export const LogoutIcon = createNativeIcon('logout');
export const PlusIcon = createNativeIcon('plus');
export const MinusIcon = createNativeIcon('minus');
export const CloseIcon = createNativeIcon('close');
export const CheckIcon = createNativeIcon('check');
export const EditIcon = createNativeIcon('edit');
export const TrashIcon = createNativeIcon('trash');
export const CopyIcon = createNativeIcon('copy');
export const ShareIcon = createNativeIcon('share');
export const DownloadIcon = createNativeIcon('download');
export const UploadIcon = createNativeIcon('upload');
export const LinkIcon = createNativeIcon('link');
export const MoreIcon = createNativeIcon('more');
export const MoreVerticalIcon = createNativeIcon('more-vertical');
export const FilterIcon = createNativeIcon('filter');
export const SortIcon = createNativeIcon('sort');
export const RefreshIcon = createNativeIcon('refresh');
export const SendIcon = createNativeIcon('send');
export const BoltIcon = createNativeIcon('bolt');
export const SparkleIcon = createNativeIcon('sparkle');
export const MailIcon = createNativeIcon('mail');
export const PhoneIcon = createNativeIcon('phone');
export const MessageIcon = createNativeIcon('message');
export const CalendarIcon = createNativeIcon('calendar');
export const ClockIcon = createNativeIcon('clock');
export const CameraIcon = createNativeIcon('camera');
export const ImageIcon = createNativeIcon('image');
export const VideoIcon = createNativeIcon('video');
export const MicIcon = createNativeIcon('mic');
export const PlayIcon = createNativeIcon('play');
export const PauseIcon = createNativeIcon('pause');
export const FileIcon = createNativeIcon('file');
export const FolderIcon = createNativeIcon('folder');
export const InboxIcon = createNativeIcon('inbox');
export const ArchiveIcon = createNativeIcon('archive');
export const BookmarkIcon = createNativeIcon('bookmark');
export const HeartIcon = createNativeIcon('heart');
export const StarIcon = createNativeIcon('star');
export const TagIcon = createNativeIcon('tag');
export const FlagIcon = createNativeIcon('flag');
export const GiftIcon = createNativeIcon('gift');
export const CartIcon = createNativeIcon('cart');
export const BagIcon = createNativeIcon('bag');
export const CreditCardIcon = createNativeIcon('credit-card');
export const ChartIcon = createNativeIcon('chart');
export const GlobeIcon = createNativeIcon('globe');
export const MapPinIcon = createNativeIcon('map-pin');
export const LockIcon = createNativeIcon('lock');
export const UnlockIcon = createNativeIcon('unlock');
export const KeyIcon = createNativeIcon('key');
export const ShieldIcon = createNativeIcon('shield');
export const EyeIcon = createNativeIcon('eye');
export const EyeOffIcon = createNativeIcon('eye-off');
export const WifiIcon = createNativeIcon('wifi');
export const BluetoothIcon = createNativeIcon('bluetooth');
export const BatteryIcon = createNativeIcon('battery');
export const MoonIcon = createNativeIcon('moon');
export const SunIcon = createNativeIcon('sun');
export const CloudIcon = createNativeIcon('cloud');
export const InfoIcon = createNativeIcon('info');
export const HelpIcon = createNativeIcon('help');
export const AlertIcon = createNativeIcon('alert');
export const CheckCircleIcon = createNativeIcon('check-circle');
export const XCircleIcon = createNativeIcon('x-circle');