import { forwardRef, type ComponentRef, type ForwardRefExoticComponent, type RefAttributes } from 'react';

type ViewRef = ComponentRef<typeof View>;
type StackComponent<P> = ForwardRefExoticComponent<P & RefAttributes<ViewRef>>;
import { View, type ViewProps, type ViewStyle } from 'react-native';
import { spacing, type SpacingKey } from '@lumen/tokens';

type Align = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
type Justify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

export interface StackProps extends ViewProps {
  direction?: 'row' | 'column';
  /** Spacing key on the 4pt grid (e.g. 4 → 16) or a raw number. */
  gap?: SpacingKey | number;
  align?: Align;
  justify?: Justify;
  wrap?: boolean;
  /** Padding on the 4pt grid. */
  padding?: SpacingKey;
  flex?: number;
}

const alignMap: Record<Align, ViewStyle['alignItems']> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
  baseline: 'baseline',
};

const justifyMap: Record<Justify, ViewStyle['justifyContent']> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
};

const toSpace = (v?: SpacingKey | number) =>
  v === undefined ? undefined : v in spacing ? spacing[v as SpacingKey] : (v as number);

export const Stack: StackComponent<StackProps> = forwardRef<ViewRef, StackProps>(function Stack(
  { direction = 'column', gap, align, justify, wrap, padding, flex, style, ...rest },
  ref,
) {
  return (
    <View
      ref={ref}
      style={[
        {
          flexDirection: direction,
          gap: toSpace(gap),
          alignItems: align && alignMap[align],
          justifyContent: justify && justifyMap[justify],
          flexWrap: wrap ? 'wrap' : undefined,
          padding: toSpace(padding),
          flex,
        },
        style,
      ]}
      {...rest}
    />
  );
});

export const HStack: StackComponent<Omit<StackProps, 'direction'>> = forwardRef<ViewRef, Omit<StackProps, 'direction'>>(function HStack({ align = 'center', ...p }, ref) {
  return <Stack ref={ref} direction="row" align={align} {...p} />;
});

export const VStack: StackComponent<Omit<StackProps, 'direction'>> = forwardRef<ViewRef, Omit<StackProps, 'direction'>>(function VStack(p, ref) {
  return <Stack ref={ref} direction="column" {...p} />;
});
