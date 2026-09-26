import { View, type StyleProp, type ViewStyle } from 'react-native';

/**
 * Dependency-free UI glyphs drawn with Views (no react-native-svg needed).
 * For a full icon set, pair Lumen with SF Symbols (expo-symbols) or any
 * 24px stroke set (lucide-react-native) at strokeWidth 2.
 */
export type GlyphName = 'chevron-right' | 'chevron-left' | 'chevron-down' | 'check' | 'close' | 'plus' | 'minus' | 'search';

export interface GlyphProps {
  name: GlyphName;
  size?: number;
  color: string;
  /** Stroke thickness. @default size / 9 */
  weight?: number;
  style?: StyleProp<ViewStyle>;
}

export function Glyph({ name, size = 20, color, weight, style }: GlyphProps) {
  const w = weight ?? Math.max(1.5, size / 9);
  const box: ViewStyle = { width: size, height: size, alignItems: 'center', justifyContent: 'center' };
  const bar = (rotate: string, length = size * 0.8): ViewStyle => ({
    position: 'absolute',
    width: length,
    height: w,
    borderRadius: w,
    backgroundColor: color,
    transform: [{ rotate }],
  });

  switch (name) {
    case 'chevron-right':
    case 'chevron-left':
    case 'chevron-down': {
      const s = size * 0.46;
      const rotate = name === 'chevron-right' ? '45deg' : name === 'chevron-left' ? '-135deg' : '135deg';
      const shift =
        name === 'chevron-right'
          ? { translateX: -s * 0.2 }
          : name === 'chevron-left'
            ? { translateX: s * 0.2 }
            : { translateY: -s * 0.2 };
      return (
        <View style={[box, style]}>
          <View
            style={{
              width: s,
              height: s,
              borderTopWidth: w,
              borderRightWidth: w,
              borderColor: color,
              borderTopRightRadius: w / 2,
              transform: [shift as never, { rotate }],
            }}
          />
        </View>
      );
    }
    case 'check':
      return (
        <View style={[box, style]}>
          <View
            style={{
              width: size * 0.3,
              height: size * 0.58,
              borderBottomWidth: w,
              borderRightWidth: w,
              borderColor: color,
              borderBottomRightRadius: w / 2,
              transform: [{ translateY: -size * 0.06 }, { rotate: '45deg' }],
            }}
          />
        </View>
      );
    case 'close':
      return (
        <View style={[box, style]}>
          <View style={bar('45deg', size * 0.75)} />
          <View style={bar('-45deg', size * 0.75)} />
        </View>
      );
    case 'plus':
      return (
        <View style={[box, style]}>
          <View style={bar('0deg', size * 0.72)} />
          <View style={bar('90deg', size * 0.72)} />
        </View>
      );
    case 'minus':
      return (
        <View style={[box, style]}>
          <View style={bar('0deg', size * 0.72)} />
        </View>
      );
    case 'search': {
      const r = size * 0.56;
      return (
        <View style={[box, style]}>
          <View
            style={{
              position: 'absolute',
              top: size * 0.1,
              left: size * 0.1,
              width: r,
              height: r,
              borderRadius: r / 2,
              borderWidth: w,
              borderColor: color,
            }}
          />
          <View
            style={{
              position: 'absolute',
              width: size * 0.32,
              height: w,
              borderRadius: w,
              backgroundColor: color,
              right: size * 0.06,
              bottom: size * 0.2,
              transform: [{ rotate: '45deg' }],
            }}
          />
        </View>
      );
    }
  }
}
