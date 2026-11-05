import { useState } from 'react';
import { View, Text, Pressable, ImageBackground, ScrollView, StyleSheet } from 'react-native';
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

const ITEMS = [
  { id: 'male', sq: 'Male', en: 'Mountains', img: require('../../../assets/onboarding/male.jpg') },
  { id: 'ujevara', sq: 'Ujëvara', en: 'Waterfalls', img: require('../../../assets/onboarding/ujevara.jpg') },
  { id: 'kala', sq: 'Kala', en: 'Castles', img: require('../../../assets/onboarding/kala.jpg') },
  { id: 'carshi', sq: 'Çarshi dhe kulla', en: 'Old bazaar and towers', img: require('../../../assets/onboarding/carshi.jpg') },
  { id: 'shpella', sq: 'Shpella', en: 'Caves', img: require('../../../assets/onboarding/shpella.jpg') },
  { id: 'liqene', sq: 'Liqene', en: 'Lakes', img: require('../../../assets/onboarding/liqene.jpg') },
  { id: 'shenjta', sq: 'Vende të shenjta', en: 'Holy places', img: require('../../../assets/onboarding/shenjta.jpg') },
  { id: 'ski', sq: 'Ski', en: 'Ski', img: require('../../../assets/onboarding/ski.jpg') },
];

export default function Interests() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const [picked, setPicked] = useState<string[]>(['male', 'ujevara', 'carshi']);
  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const next = () => router.push('/avatar');

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }}
      >
        <Progress step={3} />
        <Text style={[text.largeTitle, { color: c.label, marginTop: 24 }]}>
          {tr({ sq: 'Çfarë të pëlqen?', en: 'What do you like?' })}
        </Text>
        <Text style={[text.subheadline, { color: c.label2, marginTop: 6 }]}>
          {tr({ sq: 'Zgjidh disa. Ballina dhe Pyet Kosovën i ndjekin.', en: 'Pick a few. Home and Ask Kosovo follow them.' })}
        </Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 20 }}>
          {ITEMS.map((it) => {
            const on = picked.includes(it.id);
            return (
              <Pressable
                key={it.id}
                onPress={() => toggle(it.id)}
                accessibilityRole="button"
                accessibilityLabel={it.en}
                accessibilityState={{ selected: on }}
                style={{ width: '48%', flexGrow: 1, height: 112, borderRadius: radius.sheet, overflow: 'hidden' }}
              >
                <ImageBackground source={it.img} style={{ flex: 1, justifyContent: 'flex-end', padding: 12, backgroundColor: c.fillStrong }}>
                  <Shade />
                  {on && (
                    <View style={[styles.check, { backgroundColor: c.bg }]}>
                      <Text style={{ color: c.label, fontWeight: '700' }}>✓</Text>
                    </View>
                  )}
                  <Text style={[text.headline, { color: '#FFFFFF' }]}>{tr(it)}</Text>
                </ImageBackground>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          onPress={next}
          accessibilityRole="button"
          style={[styles.button, { backgroundColor: c.tint, marginTop: 24 }]}
        >
          <Text style={[text.headline, { color: c.onTint }]}>{tr({ sq: 'Vazhdo', en: 'Continue' })}</Text>
        </Pressable>
        <Pressable onPress={next} accessibilityRole="button" style={[styles.button, { marginTop: 4 }]}>
          <Text style={[text.headline, { color: c.label2 }]}>{tr({ sq: 'Kalo', en: 'Skip' })}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: minTouch + 6, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  check: { position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
});
