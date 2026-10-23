import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useColors } from '@/theme/tokens';

type Props = {
  children: React.ReactNode;
  /** scrolls when the content is taller than the phone (lists, forms) */
  scroll?: boolean;
  /** the grouped grey background used behind lists of cards */
  grouped?: boolean;
  /** extra style for the content area */
  contentStyle?: StyleProp<ViewStyle>;
  /** side margin; the design uses 20 on onboarding and 16 on lists */
  padding?: number;
};

/** Every screen starts with Screen: safe area, the right background in light and dark mode, 20 pt side margin. */
export function Screen({ children, scroll = false, grouped = false, contentStyle, padding = 20 }: Props) {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const content = [{ paddingTop: insets.top + 12, paddingBottom: insets.bottom + 16, paddingHorizontal: padding }, contentStyle];
  const bg = { backgroundColor: grouped ? c.grouped : c.bg };
  if (scroll) {
    return (
      <ScrollView style={[styles.fill, bg]} contentContainerStyle={content} contentInsetAdjustmentBehavior="never" keyboardShouldPersistTaps="handled">
        {children}
      </ScrollView>
    );
  }
  return <View style={[styles.fill, bg, ...content]}>{children}</View>;
}

const styles = StyleSheet.create({ fill: { flex: 1 } });
