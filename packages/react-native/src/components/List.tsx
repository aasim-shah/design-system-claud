import { Children, cloneElement, isValidElement, useState, type ReactElement, type ReactNode } from 'react';

const LIST_PAD = 6;
const LIST_RADIUS = 20;
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider.js';
import { Glyph } from './Glyph.js';
import { Text } from './Text.js';

export interface ListSectionProps {
  header?: string;
  footer?: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Titled group of rows for settings-style screens. */
export function ListSection({ header, footer, children, style }: ListSectionProps) {
  return (
    <View style={style}>
      {header && (
        <Text variant="footnote" weight="medium" color="secondary" style={{ paddingHorizontal: 20, paddingBottom: 8, textTransform: 'uppercase', letterSpacing: 0.3 }}>
          {header}
        </Text>
      )}
      {children}
      {footer && (
        <Text variant="footnote" color="secondary" style={{ paddingHorizontal: 20, paddingTop: 8 }}>
          {footer}
        </Text>
      )}
    </View>
  );
}

export interface ListProps {
  children: ReactNode;
  /** inset (rounded group) · filled · plain (edge to edge). @default 'inset' */
  variant?: 'inset' | 'filled' | 'plain';
  style?: StyleProp<ViewStyle>;
}

export function List({ children, variant = 'inset', style }: ListProps) {
  const { colors } = useTheme();
  const rows = Children.toArray(children).filter(isValidElement) as ReactElement<ListItemProps>[];
  const plain = variant === 'plain';
  return (
    <View
      style={[
        {
          // Padded card: rows float inside with their own rounded highlight.
          padding: plain ? 0 : LIST_PAD,
          borderRadius: plain ? 0 : LIST_RADIUS,
          backgroundColor:
            variant === 'plain' ? 'transparent' : variant === 'filled' ? colors.background.secondary : colors.background.groupedSecondary,
        },
        style,
      ]}
    >
      {rows.map((row, i) => cloneElement(row, { separator: i > 0, rounded: !plain }))}
    </View>
  );
}

export interface ListItemProps {
  title: ReactNode;
  subtitle?: ReactNode;
  leading?: ReactNode;
  detail?: ReactNode;
  trailing?: ReactNode;
  /** Disclosure chevron. Defaults to true when `onPress` is set. */
  chevron?: boolean;
  selected?: boolean;
  destructive?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  /** @internal injected by <List> */
  separator?: boolean;
  /** @internal injected by <List> */
  rounded?: boolean;
}

export function ListItem({
  title,
  subtitle,
  leading,
  detail,
  trailing,
  chevron,
  selected,
  destructive,
  disabled,
  onPress,
  separator,
  rounded = true,
}: ListItemProps) {
  const { colors, opacity } = useTheme();
  const [pressed, setPressed] = useState(false);
  const showChevron = chevron ?? (!!onPress && selected === undefined && !destructive);
  const inset = leading ? 12 + 32 + 12 : 12;

  return (
    <Pressable
      disabled={!onPress || disabled}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityState={{ selected, disabled }}
      style={{
        minHeight: 52,
        paddingHorizontal: 12,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderRadius: rounded ? LIST_RADIUS - LIST_PAD : 0,
        backgroundColor: pressed ? colors.fill.tertiary : 'transparent',
        opacity: disabled ? opacity.disabled : 1,
      }}
    >
      {separator && !pressed && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            right: 12,
            left: inset,
            height: StyleSheet.hairlineWidth,
            backgroundColor: colors.separator.default,
          }}
        />
      )}
      {leading}
      <View style={{ flex: 1, paddingVertical: 3 }}>
        {typeof title === 'string' ? (
          <Text color={destructive ? 'danger' : 'primary'} numberOfLines={1}>
            {title}
          </Text>
        ) : (
          title
        )}
        {typeof subtitle === 'string' ? (
          <Text variant="subheadline" color="secondary" numberOfLines={2}>
            {subtitle}
          </Text>
        ) : (
          subtitle
        )}
      </View>
      {detail !== undefined &&
        (typeof detail === 'string' ? (
          <Text color="secondary" numberOfLines={1} style={{ maxWidth: '50%' }}>
            {detail}
          </Text>
        ) : (
          detail
        ))}
      {trailing}
      {selected && <Glyph name="check" size={18} weight={2.2} color={colors.accent.default} />}
      {showChevron && <Glyph name="chevron-right" size={14} weight={2} color={colors.label.tertiary} style={{ marginRight: -4 }} />}
    </Pressable>
  );
}

export interface ListIconProps {
  children: ReactNode;
  /** Optional tile color. Neutral gray by default — pair a colored tile with a white glyph. */
  color?: string;
}

/** Circular icon tile for list rows (32×32). Neutral by default. */
export function ListIcon({ children, color }: ListIconProps) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: color ?? colors.fill.tertiary,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </View>
  );
}
