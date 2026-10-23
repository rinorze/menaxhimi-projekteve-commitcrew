import { Link, type Href } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { minTouch, radius, text, useColors } from '@/theme/tokens';

type Props = {
  /** screen title, as in the design */
  title: string;
  /** who builds this screen */
  owner: string;
  /** the artboard name in the design, e.g. "Welcome2" */
  design: string;
  /** the next screen in the onboarding chain */
  next?: Href;
  nextLabel?: string;
};

/**
 * A stand-in for a screen that is not built yet. Replace the whole file's content with the real screen
 * when you build it; keep the file name and the link to the next screen.
 */
export function ScreenPlaceholder({ title, owner, design, next, nextLabel = 'Continue' }: Props) {
  const c = useColors();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.screen, { backgroundColor: c.bg, paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}>
      <View style={{ flex: 1, gap: 8 }}>
        <Text style={[text.largeTitle, { color: c.label }]}>{title}</Text>
        <Text style={[text.subheadline, { color: c.label2 }]}>
          Built by {owner} · design: {design} in docs/design
        </Text>
      </View>
      {next ? (
        <Link href={next} asChild>
          <Pressable accessibilityRole="button" style={[styles.button, { backgroundColor: c.tint }]}>
            <Text style={[text.headline, { color: c.onTint }]}>{nextLabel}</Text>
          </Pressable>
        </Link>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 20 },
  button: { minHeight: minTouch + 6, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
});
