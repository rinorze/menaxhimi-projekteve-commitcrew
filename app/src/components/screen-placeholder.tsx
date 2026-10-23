import { Link, type Href } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { minTouch, radius, text, useColors } from '@/theme/tokens';

type Props = {
  /** the screen's number in the design, e.g. "1.1" */
  step: string;
  /** screen title, as in the design */
  title: string;
  /** who builds this screen */
  owner: string;
  /** the design picture, relative to docs/design/screens, e.g. "01-onboarding/01-welcome.png" */
  design: string;
  /** the main button: the next screen in the onboarding chain */
  next?: Href;
  nextLabel?: string;
  /** other buttons on this screen that open a side path (guest map, Kthimi, sign in…) */
  also?: { href: Href; label: string }[];
};

/**
 * A stand-in for a screen that is not built yet. Replace the whole file's content with the real screen
 * when you build it; keep the file name and every link it has.
 */
export function ScreenPlaceholder({ step, title, owner, design, next, nextLabel = 'Vazhdo', also = [] }: Props) {
  const c = useColors();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.screen, { backgroundColor: c.bg, paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}>
      <View style={{ flex: 1, gap: 8 }}>
        <Text style={[text.footnote, { color: c.blue, fontWeight: '600' }]}>{step}</Text>
        <Text style={[text.largeTitle, { color: c.label }]}>{title}</Text>
        <Text style={[text.subheadline, { color: c.label2 }]}>
          Ndërtohet nga {owner} · dizajni: docs/design/screens/{design}
        </Text>
      </View>
      <View style={{ gap: 10 }}>
        {also.map((a) => (
          <Link key={a.label} href={a.href} asChild>
            {/* Link asChild needs one style object, not an array */}
            <Pressable accessibilityRole="button" style={StyleSheet.flatten([styles.button, { backgroundColor: c.fill }])}>
              <Text style={[text.headline, { color: c.label }]}>{a.label}</Text>
            </Pressable>
          </Link>
        ))}
        {next ? (
          <Link href={next} asChild>
            <Pressable accessibilityRole="button" style={StyleSheet.flatten([styles.button, { backgroundColor: c.tint }])}>
              <Text style={[text.headline, { color: c.onTint }]}>{nextLabel}</Text>
            </Pressable>
          </Link>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 20 },
  button: { minHeight: minTouch + 6, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
});
