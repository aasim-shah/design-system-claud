import { Platform, type TextStyle } from 'react-native';
import { textStyles, fontWeight, type TextVariant, type FontWeight } from '@lumen/tokens';

/**
 * Native text style for a Lumen variant.
 * iOS: the system font (SF Pro) applies optical tracking by itself, so we
 * leave letterSpacing at 0. Elsewhere we apply the token tracking.
 */
export function textStyle(variant: TextVariant, weight?: FontWeight): TextStyle {
  const s = textStyles[variant];
  return {
    fontSize: s.fontSize,
    lineHeight: s.lineHeight,
    fontWeight: (weight ? fontWeight[weight] : s.fontWeight) as TextStyle['fontWeight'],
    letterSpacing: Platform.OS === 'ios' ? 0 : +(s.tracking * s.fontSize).toFixed(2),
  };
}

export const fontFamilies = {
  sans: Platform.select({ ios: 'System', default: undefined }),
  rounded: Platform.select({ ios: 'System', default: undefined }),
  mono: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
};
