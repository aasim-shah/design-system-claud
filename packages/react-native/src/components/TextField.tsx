import { forwardRef, useImperativeHandle, useRef, useState, type ComponentRef, type ForwardRefExoticComponent, type ReactNode, type RefAttributes } from 'react';

type TextInputRef = ComponentRef<typeof TextInput>;
import { Pressable, TextInput, View, type StyleProp, type TextInputProps, type ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider.js';
import { textStyle } from '../theme/typography.js';
import { Glyph } from './Glyph.js';
import { Text } from './Text.js';

export interface TextFieldProps extends TextInputProps {
  label?: string;
  description?: string;
  error?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  /** Show a clear (×) button while there is text. */
  clearable?: boolean;
  size?: 'sm' | 'md' | 'lg';
  containerStyle?: StyleProp<ViewStyle>;
  /** `search` = compact rounded search style. */
  appearance?: 'default' | 'search';
}

const heights = { sm: 32, md: 44, lg: 52 };

export const TextField: ForwardRefExoticComponent<TextFieldProps & RefAttributes<TextInputRef>> = forwardRef<TextInputRef, TextFieldProps>(function TextField(
  {
    label,
    description,
    error,
    leading,
    trailing,
    clearable,
    size = 'md',
    containerStyle,
    appearance = 'default',
    editable = true,
    onFocus,
    onBlur,
    onChangeText,
    value,
    defaultValue,
    multiline,
    style,
    ...rest
  },
  ref,
) {
  const { colors, radius } = useTheme();
  const input = useRef<TextInputRef>(null);
  useImperativeHandle(ref, () => input.current as TextInputRef);
  const [focused, setFocused] = useState(false);
  const [inner, setInner] = useState(defaultValue ?? '');
  const text = value ?? inner;
  const search = appearance === 'search';

  const ring = error ? colors.danger.default : focused ? colors.accent.default : 'transparent';

  return (
    <View style={[{ gap: 6 }, containerStyle]}>
      {label && (
        <Text variant="subheadline" weight="medium" style={{ paddingHorizontal: 4 }}>
          {label}
        </Text>
      )}
      <Pressable
        onPress={() => input.current?.focus()}
        accessible={false}
        style={{
          flexDirection: 'row',
          alignItems: multiline ? 'flex-start' : 'center',
          gap: search ? 6 : 8,
          minHeight: search ? 36 : heights[size],
          paddingHorizontal: search ? 8 : size === 'lg' ? 16 : 12,
          paddingVertical: multiline ? 10 : 0,
          borderRadius: size === 'lg' ? radius.lg : radius.md,
          backgroundColor: focused && !search ? colors.background.primary : colors.fill.tertiary,
          borderWidth: 1.5,
          borderColor: search ? 'transparent' : ring,
          opacity: editable ? 1 : 0.38,
        }}
      >
        {search ? <Glyph name="search" size={16} color={colors.label.secondary} /> : leading}
        <TextInput
          ref={input}
          value={value}
          defaultValue={defaultValue}
          editable={editable}
          multiline={multiline}
          placeholderTextColor={colors.label.tertiary}
          selectionColor={colors.accent.default}
          cursorColor={colors.accent.default}
          returnKeyType={search ? 'search' : rest.returnKeyType}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          onChangeText={(t) => {
            if (value === undefined) setInner(t);
            onChangeText?.(t);
          }}
          accessibilityLabel={label ?? rest.accessibilityLabel ?? rest.placeholder}
          style={[
            textStyle('body'),
            {
              flex: 1,
              color: colors.label.primary,
              paddingVertical: 0,
              minHeight: multiline ? 88 : undefined,
              textAlignVertical: multiline ? 'top' : 'center',
              lineHeight: undefined,
            },
            style,
          ]}
          {...rest}
        />
        {(clearable || search) && !!text && editable && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear"
            hitSlop={10}
            onPress={() => {
              input.current?.clear();
              if (value === undefined) setInner('');
              onChangeText?.('');
            }}
            style={{
              width: 18,
              height: 18,
              borderRadius: 9,
              backgroundColor: colors.label.tertiary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Glyph name="close" size={10} weight={1.8} color={colors.background.primary} />
          </Pressable>
        )}
        {trailing}
      </Pressable>
      {(error || description) && (
        <Text variant="footnote" color={error ? 'danger' : 'secondary'} style={{ paddingHorizontal: 4 }}>
          {error ?? description}
        </Text>
      )}
    </View>
  );
});

export type SearchFieldProps = Omit<TextFieldProps, 'appearance' | 'leading' | 'label'>;

export const SearchField: ForwardRefExoticComponent<SearchFieldProps & RefAttributes<TextInputRef>> = forwardRef<TextInputRef, SearchFieldProps>(
  function SearchField({ placeholder = 'Search', ...props }, ref) {
    return (
      <TextField
        ref={ref}
        appearance="search"
        placeholder={placeholder}
        autoCorrect={false}
        autoCapitalize="none"
        clearButtonMode="never"
        {...props}
      />
    );
  },
);
