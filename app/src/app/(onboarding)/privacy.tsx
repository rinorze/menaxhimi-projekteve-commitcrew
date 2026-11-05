import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { minTouch, radius, text, useColors } from '@/theme/tokens';

const tr = (s: { sq: string; en: string }) => s.sq; // aplikacioni hapet në Shqip

function Progress({ step, total = 7 }: { step: number; total?: number }) {
  const c = useColors();
  return (
    <View style={{ flexDirection: 'row', gap: 6 }}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: i < step ? c.label : c.fill }} />
      ))}
    </View>
  );
}

const RULES = [
  { icon: '⊘', tone: 'tint', title: { sq: 'Modaliteti fantazmë është i ndezur', en: 'Ghost mode is on' },
    body: { sq: 'Askush nuk të sheh derisa ta ndash, dhe vetëm sa të duash.', en: 'Nobody sees you until you share, and only as much as you want.' } },
  { icon: '🔒', tone: 'blue', title: { sq: 'Fotot e tua mbeten të tuat', en: 'Your photos stay yours' },
    body: { sq: 'Shokët shohin që e hape vendin, jo foton, përveç nëse dërgon kartolinë.', en: 'Friends see you opened a place, not the photo, unless you send a postcard.' } },
  { icon: '👥', tone: 'green', title: { sq: 'Pa postime, pëlqime apo komente', en: 'No posts, likes or comments' },
    body: { sq: 'Vetëm vende reale, shokë dhe vizita të vërteta.', en: 'Only real places, friends and real visits.' } },
] as const;

export default function Privacy() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: c.bg, paddingHorizontal: 16, paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }}>
      <Progress step={6} />
      <Text style={[text.largeTitle, { color: c.label, marginTop: 24 }]}>{tr({ sq: 'Privat që në fillim', en: 'Private from the start' })}</Text>
      <Text style={[text.subheadline, { color: c.label2, marginTop: 6 }]}>{tr({ sq: 'Ti vendos kush sheh çfarë.', en: 'You decide who sees what.' })}</Text>

      <View style={{ gap: 20, marginTop: 28 }}>
        {RULES.map((r) => (
          <View key={r.title.en} style={{ flexDirection: 'row', gap: 14 }}>
            <View style={{ width: 44, height: 44, borderRadius: radius.row, backgroundColor: c[r.tone], alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 20, color: r.tone === 'tint' ? c.onTint : '#FFFFFF' }}>{r.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[text.headline, { color: c.label }]}>{tr(r.title)}</Text>
              <Text style={[text.subheadline, { color: c.label2 }]}>{tr(r.body)}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={{ flex: 1 }} />

      <View style={[styles.note, { backgroundColor: c.fill }]}>
        <View style={[styles.noteIcon, { backgroundColor: c.bg }]}>
          <Text style={{ color: c.label }}>➤</Text>
        </View>
        <Text style={[text.subheadline, { flex: 1, color: c.label }]}>
          {tr({
            sq: 'Vendndodhjen ta kërkojmë vetëm kur të prekësh “Gjej mua” në hartë. Për vulë, serveri kontrollon vetëm që je brenda rrethit.',
            en: 'We ask for your location only when you tap “Find me” on the map. For a stamp, the server only checks that you are inside the circle.',
          })}
        </Text>
      </View>

      <Pressable onPress={() => router.push('/one-friend')} accessibilityRole="button" style={[styles.button, { backgroundColor: c.tint, marginTop: 24 }]}>
        <Text style={[text.headline, { color: c.onTint }]}>{tr({ sq: 'Në rregull', en: 'Okay' })}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: minTouch + 6, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  note: { borderRadius: radius.sheet, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  noteIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
});
