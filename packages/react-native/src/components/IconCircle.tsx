import { type ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider.js';

const sizes = { xs: 24, sm: 28, md: 32, lg: 44, xl: 56 };

export interface IconCircleProps {
  /** Receives the glyph color and size, e.g. (c, s) => <WifiIcon color={c} size={s} /> */
  icon: (color: string, size: number) => ReactNode;
  size?: keyof typeof sizes;
  variant?: 'soft' | 'solid' | 'outline' | 'tinted';
  /** Used by `solid` and `tinted`. */
  color?: string;
  style?: StyleProp<ViewStyle>;
}

/** The signature Lumen icon container: a circle holding a rounded glyph. */
export function IconCircle({ icon, size = 'md', variant = 'soft', color, style }: IconCircleProps) {
  const { colors } = useTheme();
  const d = sizes[size];
  const tint = color ?? colors.accent.default;
  const bg =
    variant === 'solid' ? tint : variant === 'outline' ? 'transparent' : variant === 'tinted' ? withAlpha(tint, 0.14) : colors.fill.tertiary;
  const fg = variant === 'solid' ? colors.accent.on : variant === 'tinted' ? tint : colors.label.primary;
  return (
    <View
      style={[
        {
          width: d,
          height: d,
          borderRadius: d / 2,
          backgroundColor: bg,
          borderWidth: variant === 'outline' ? 1 : 0,
          borderColor: colors.separator.default,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      {icon(fg, Math.round(d * (size === 'xl' ? 0.46 : 0.56)))}
    </View>
  );
}

function withAlpha(color: string, a: number) {
  const m = /^#([0-9a-f]{6})$/i.exec(color);
  if (!m) return color;
  const n = parseInt(m[1], 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}
