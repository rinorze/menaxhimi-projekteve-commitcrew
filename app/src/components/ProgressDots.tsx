import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

import { motion, useColors } from '@/theme/tokens';

type Props = {
  /** the current step, starting at 1 */
  step: number;
  /** how many steps there are; onboarding has 7 */
  total: number;
};

function Bar({ filled }: { filled: boolean }) {
  const c = useColors();
  // the fill animates in when the step is reached
  const style = useAnimatedStyle(() => ({ opacity: withSpring(filled ? 1 : 0, motion.gentle) }));
  return (
    <View style={[styles.bar, { backgroundColor: c.fillStrong }]}>
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: c.tint, borderRadius: 2 }, style]} />
    </View>
  );
}

/** The thin "step X of 7" bar at the top of onboarding screens. */
export function ProgressDots({ step, total }: Props) {
  return (
    <View style={styles.row} accessibilityRole="progressbar" accessibilityLabel={`${step} / ${total}`} accessibilityValue={{ min: 1, max: total, now: step }}>
      {Array.from({ length: total }, (_, i) => (
        <Bar key={i} filled={i < step} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 6 },
  bar: { flex: 1, height: 4, borderRadius: 2, overflow: 'hidden' },
});
