import { forwardRef, type ComponentRef, type ForwardRefExoticComponent, type RefAttributes } from 'react';
import { Text as RNText, type TextProps as RNTextProps } from 'react-native';
import type { FontWeight, TextVariant } from '@lumen/tokens';
import { useTheme } from '../theme/ThemeProvider.js';
import { fontFamilies, textStyle } from '../theme/typography.js';

export type TextColor = 'primary' | 'secondary' | 'tertiary' | 'accent' | 'success' | 'warning' | 'danger' | 'inverse';

export interface TextProps extends RNTextProps {
  /** @default 'body' */
  variant?: TextVariant;
  /** Semantic color or any color string. @default 'primary' */
  color?: TextColor | (string & {});
  weight?: FontWeight;
  align?: 'left' | 'center' | 'right' | 'auto';
  tabular?: boolean;
  mono?: boolean;
}

export const Text: ForwardRefExoticComponent<TextProps & RefAttributes<ComponentRef<typeof RNText>>> = forwardRef<ComponentRef<typeof RNText>, TextProps>(function Text(
  { variant = 'body', color = 'primary', weight, align, tabular, mono, style, maxFontSizeMultiplier = 1.6, ...rest },
  ref,
) {
  const { colors } = useTheme();
  const map: Record<TextColor, string> = {
    primary: colors.label.primary,
    secondary: colors.label.secondary,
    tertiary: colors.label.tertiary,
    accent: colors.accent.default,
    success: colors.success.default,
    warning: colors.warning.default,
    danger: colors.danger.default,
    inverse: colors.label.inverse,
  };
  return (
    <RNText
      ref={ref}
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      style={[
        textStyle(variant, weight),
        { color: map[color as TextColor] ?? color },
        align && { textAlign: align },
        tabular && { fontVariant: ['tabular-nums'] },
        mono && { fontFamily: fontFamilies.mono, letterSpacing: 0 },
        style,
      ]}
      {...rest}
    />
  );
});
