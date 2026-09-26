import { useCallback, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';
import { motion } from '@lumen/tokens';

/**
 * Shared press feedback: a quick scale-down on press-in and a snappy spring
 * back on release. Returns handlers to spread on a Pressable.
 */
export function usePress(scaleTo: number = motion.pressScale) {
  const scale = useRef(new Animated.Value(1)).current;
  const [pressed, setPressed] = useState(false);

  const onPressIn = useCallback(() => {
    setPressed(true);
    Animated.timing(scale, {
      toValue: scaleTo,
      duration: motion.duration.instant,
      easing: Easing.bezier(...motion.easing.standard),
      useNativeDriver: true,
    }).start();
  }, [scale, scaleTo]);

  const onPressOut = useCallback(() => {
    setPressed(false);
    Animated.spring(scale, { toValue: 1, ...motion.spring.snappy, useNativeDriver: true }).start();
  }, [scale]);

  return { pressed, scale, onPressIn, onPressOut };
}
