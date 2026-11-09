import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { minTouch, radius, space, text, useColors, type Palette } from '@/theme/tokens';



type ToggleKey = 'largeText' | 'reduceMotion' | 'reduceTransparency';

const TOGGLES: { key: ToggleKey; title: string; detail: string }[] = [
  { key: 'largeText', title: 'Tekst më i madh', detail: 'Dynamic Type' },
  { key: 'reduceMotion', title: 'Pak lëvizje', detail: 'Festimet bëhen pa animacion' },
  { key: 'reduceTransparency', title: 'Pak transparencë', detail: 'Xhami i ngurtë' },
];

export default function Accessibility() {
  const c = useColors();
  const s = makeStyles(c);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [values, setValues] = useState<Record<ToggleKey, boolean>>({
    largeText: false,
    reduceMotion: false,
    reduceTransparency: false,
  });

  return (
    <View style={s.screen}>
      <View style={[s.header, { paddingTop: insets.top + space.sm }]}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Kthehu"
          style={s.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={c.label} />
        </Pressable>
        <Text style={s.title} accessibilityRole="header">
          Qasshmëria
        </Text>
        <View style={s.backButton} />
      </View>

      <ScrollView
        contentContainerStyle={[s.content, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.group}>
          {TOGGLES.map((item, i) => (
            <View key={item.key} style={[s.toggleRow, i < TOGGLES.length - 1 && s.separator]}>
              <View style={s.toggleText}>
                <Text style={s.toggleTitle}>{item.title}</Text>
                <Text style={s.toggleDetail}>{item.detail}</Text>
              </View>
              <Switch
                value={values[item.key]}
                onValueChange={(v) => setValues((prev) => ({ ...prev, [item.key]: v }))}
                trackColor={{ false: c.fillStrong, true: c.green }}
                accessibilityLabel={item.title}
              />
            </View>
          ))}
        </View>

        <Text style={s.sectionTitle}>VoiceOver</Text>
        <View style={s.card}>
          <Text style={s.quote}>
            “Ura e Gurit. Komunë Prizren. 40 metra. Brenda rrezes. Buton: hape me foto.”
          </Text>
          <Text style={s.cardCaption}>Shembull i etiketës së një kunji në hartë.</Text>
        </View>

        <Text style={s.sectionTitle}>Qasje në vende</Text>
        <View style={[s.card, s.inlineCard]}>
          <Ionicons name="accessibility" size={18} color={c.label} style={s.inlineIcon} />
          <Text style={s.inlineText}>
            Të dhënat për qasjen me karrige janë të pakta. I shfaqim vetëm kur janë në OSM.
          </Text>
        </View>

        <Text style={s.sectionTitle}>Siguria në lëvizje</Text>
        <Text style={s.body}>
          Kamera nuk hapet kur je duke vozitur. Në shtigje mali ka paralajmërim për motin dhe sinjalin.
        </Text>
      </ScrollView>
    </View>
  );
}

function makeStyles(c: Palette) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: c.bg },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: space.lg,
      paddingBottom: space.md,
    },
    backButton: {
      width: minTouch + 12,
      height: minTouch + 12,
      borderRadius: radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.card,
      shadowColor: '#000',
      shadowOpacity: 0.12,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    },
    title: { ...text.headline, color: c.label },
    content: { paddingHorizontal: space.lg, paddingTop: space.sm },
    group: {
      backgroundColor: c.grouped,
      borderRadius: radius.sheet,
      paddingLeft: space.lg,
      overflow: 'hidden',
    },
    toggleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: minTouch + 16,
      paddingVertical: space.sm,
      paddingRight: space.lg,
    },
    separator: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: c.separator,
    },
    toggleText: { flex: 1, paddingRight: space.md },
    toggleTitle: { ...text.body, color: c.label },
    toggleDetail: { ...text.footnote, color: c.label2, marginTop: 1 },
    sectionTitle: {
      ...text.headline,
      color: c.label,
      marginTop: space.xxl,
      marginBottom: space.md,
    },
    card: {
      backgroundColor: c.grouped,
      borderRadius: radius.sheet,
      padding: space.lg,
    },
    quote: { ...text.title3, fontWeight: '400', color: c.label },
    cardCaption: { ...text.footnote, color: c.label2, marginTop: space.sm },
    inlineCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: space.md },
    inlineIcon: { marginRight: space.md },
    inlineText: { ...text.footnote, color: c.label, flex: 1 },
    body: { ...text.callout, color: c.label2 },
  });
}