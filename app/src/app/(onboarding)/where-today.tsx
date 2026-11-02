import { useState } from 'react';
import { ImageBackground } from 'react-native';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { minTouch, radius, text, useColors } from '@/theme/tokens';

const tr = (s: { sq: string; en: string }) => s.sq; 

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


function Shade() {
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '75%' }}>
      {[0.03, 0.08, 0.14, 0.22, 0.32, 0.44, 0.56].map((o, i) => (
        <View key={i} style={{ flex: 1, backgroundColor: `rgba(0,0,0,${o})` }} />
      ))}
    </View>
  );
}

const OPTIONS = [
  { id: 'kosove', route: '/interests', img: require('../../../assets/onboarding/kosove.jpg'),
    title: { sq: 'Në Kosovë', en: 'In Kosovo' }, sub: { sq: 'Jetoj këtu ose jam për vizitë tani', en: 'I live here or I am visiting now' } },
  { id: 'kthimi', route: '/kthimi', img: require('../../../assets/onboarding/kthimi.jpg'),
    title: { sq: 'Jetoj jashtë · Kthimi', en: 'I live abroad · Homecoming' }, sub: { sq: 'Gjermani, Zvicër, Francë… vij në shtëpi këtë verë', en: 'Germany, Switzerland, France… coming home this summer' } },
] as const;

export default function WhereToday() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const [sel, setSel] = useState<(typeof OPTIONS)[number]['id']>('kosove');
  const current = OPTIONS.find((o) => o.id === sel)!;

  return (
    <View style={{ flex: 1, backgroundColor: c.bg, paddingHorizontal: 16, paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }}>
      <Progress step={2} />
      <Text style={[text.largeTitle, { color: c.label, marginTop: 24 }]}>{tr({ sq: 'Ku je sot?', en: 'Where are you today?' })}</Text>
      <Text style={[text.subheadline, { color: c.label2, marginTop: 6 }]}>{tr({ sq: 'Ku je sot? Hapim hartën e duhur.', en: 'Where are you today? We open the right map.' })}</Text>

      <View style={{ gap: 16, marginTop: 24 }}>
        {OPTIONS.map((o) => {
          const on = o.id === sel;
          return (
            <Pressable key={o.id} onPress={() => setSel(o.id)} accessibilityRole="button" accessibilityState={{ selected: on }}
              style={{ height: 220, borderRadius: 28, overflow: 'hidden' }}>
              <ImageBackground source={o.img} style={{ flex: 1, justifyContent: 'flex-end', padding: 16, backgroundColor: c.fillStrong }}>
                <Shade />
                {on && (
                  <View style={[styles.check, { backgroundColor: c.bg }]}>
                    <Text style={{ color: c.label, fontWeight: '700' }}>✓</Text>
                  </View>
                )}
                <Text style={[text.title2, { color: '#FFFFFF' }]}>{tr(o.title)}</Text>
                <Text style={[text.subheadline, { color: '#FFFFFF' }]}>{tr(o.sub)}</Text>
              </ImageBackground>
            </Pressable>
          );
        })}
      </View>

      <View style={{ flex: 1 }} />
      <Pressable onPress={() => router.push(current.route)} accessibilityRole="button" style={[styles.button, { backgroundColor: c.tint }]}>
        <Text style={[text.headline, { color: c.onTint }]}>{tr({ sq: 'Vazhdo', en: 'Continue' })}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: minTouch + 6, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  check: { position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
});
