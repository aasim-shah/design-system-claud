import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';
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
        <Text variant="footnote" color="secondary" style={{ paddingHorizontal: 16, paddingBottom: 6, textTransform: 'uppercase' }}>
          {header}
        </Text>
      )}
      {children}
      {footer && (
        <Text variant="footnote" color="secondary" style={{ paddingHorizontal: 16, paddingTop: 6 }}>
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
  const { colors, radius } = useTheme();
  const rows = Children.toArray(children).filter(isValidElement) as ReactElement<ListItemProps>[];
  return (
    <View
      style={[
        {
          borderRadius: variant === 'plain' ? 0 : radius.md,
          overflow: 'hidden',
          backgroundColor:
            variant === 'plain' ? 'transparent' : variant === 'filled' ? colors.background.secondary : colors.background.groupedSecondary,
        },
        style,
      ]}
    >
      {rows.map((row, i) => cloneElement(row, { separator: i > 0 }))}
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
}: ListItemProps) {
  const { colors, palette, opacity } = useTheme();
  const showChevron = chevron ?? (!!onPress && selected === undefined && !destructive);
  const inset = leading ? 16 + 29 + 12 : 16;

  return (
    <Pressable
      disabled={!onPress || disabled}
      onPress={onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityState={{ selected, disabled }}
      style={({ pressed }) => ({
        minHeight: 44,
        paddingHorizontal: 16,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: pressed ? palette.gray4 : 'transparent',
        opacity: disabled ? opacity.disabled : 1,
      })}
    >
      {separator && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
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
  /** Tile color. Defaults to the accent. */
  color?: string;
}

/** Rounded, colored icon tile for list rows (29×29, like iOS Settings). */
export function ListIcon({ children, color }: ListIconProps) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        width: 29,
        height: 29,
        borderRadius: 7,
        backgroundColor: color ?? colors.accent.default,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </View>
  );
}
