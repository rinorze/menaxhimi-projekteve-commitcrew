import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { motion } from '@/theme/tokens';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
  /** how small it gets while pressed; 0.97 is the default feel */
  scaleTo?: number;
};

/** A pressable that shrinks a little while pressed and springs back. The base of Button, Chip and every tappable card. */
export function Press({ style, scaleTo = 0.97, onPressIn, onPressOut, ...rest }: Props) {
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <AnimatedPressable
      accessibilityRole="button"
      hitSlop={8}
      {...rest}
      onPressIn={(e) => {
        scale.value = withSpring(scaleTo, motion.snappy);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.value = withSpring(1, motion.snappy);
        onPressOut?.(e);
      }}
      style={[style, animated]}
    />
  );
}
