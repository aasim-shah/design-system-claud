import { View, type StyleProp, type ViewStyle } from 'react-native';

/**
 * Dependency-free UI glyphs (no react-native-svg needed), drawn on the same
 * 24px grid as Lumen Rounded: every stroke is a pill with round ends, so
 * joins and tips stay soft. For the full icon set use `@lumen/icons/native`.
 */
export type GlyphName = 'chevron-right' | 'chevron-left' | 'chevron-down' | 'check' | 'close' | 'plus' | 'minus' | 'search';

export interface GlyphProps {
  name: GlyphName;
  size?: number;
  color: string;
  /** Stroke thickness in points. @default size / 12 (2px on the 24 grid) */
  weight?: number;
  style?: StyleProp<ViewStyle>;
}

type Pt = [number, number];

/** Polylines on the 24×24 grid, matching the web icons. */
const shapes: Record<Exclude<GlyphName, 'search'>, Pt[][]> = {
  'chevron-right': [[[9.5, 5.5], [15.8, 12], [9.5, 18.5]]],
  'chevron-left': [[[14.5, 5.5], [8.2, 12], [14.5, 18.5]]],
  'chevron-down': [[[5.5, 9.5], [12, 15.8], [18.5, 9.5]]],
  check: [[[5, 12.5], [9.5, 17], [19, 7.5]]],
  close: [[[6.5, 6.5], [17.5, 17.5]], [[17.5, 6.5], [6.5, 17.5]]],
  plus: [[[12, 5], [12, 19]], [[5, 12], [19, 12]]],
  minus: [[[5, 12], [19, 12]]],
};

/** One straight stroke from a to b with fully rounded ends. */
function Segment({ a, b, k, w, color }: { a: Pt; b: Pt; k: number; w: number; color: string }) {
  const dx = (b[0] - a[0]) * k;
  const dy = (b[1] - a[1]) * k;
  const len = Math.hypot(dx, dy) + w;
  const cx = ((a[0] + b[0]) / 2) * k;
  const cy = ((a[1] + b[1]) / 2) * k;
  return (
    <View
      style={{
        position: 'absolute',
        left: cx - len / 2,
        top: cy - w / 2,
        width: len,
        height: w,
        borderRadius: w / 2,
        backgroundColor: color,
        transform: [{ rotate: `${Math.atan2(dy, dx)}rad` }],
      }}
    />
  );
}

export function Glyph({ name, size = 20, color, weight, style }: GlyphProps) {
  const k = size / 24;
  const w = weight ?? size / 12;
  const box: ViewStyle = { width: size, height: size };

  if (name === 'search') {
    const r = 6.5 * k;
    return (
      <View style={[box, style]}>
        <View
          style={{
            position: 'absolute',
            left: 11 * k - r,
            top: 11 * k - r,
            width: r * 2,
            height: r * 2,
            borderRadius: r,
            borderWidth: w,
            borderColor: color,
          }}
        />
        <Segment a={[16, 16]} b={[20, 20]} k={k} w={w} color={color} />
      </View>
    );
  }

  return (
    <View style={[box, style]}>
      {shapes[name].flatMap((line, i) =>
        line.slice(1).map((p, j) => <Segment key={`${i}-${j}`} a={line[j]} b={p} k={k} w={w} color={color} />),
      )}
    </View>
  );
}
