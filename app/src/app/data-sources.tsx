import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { minTouch, radius, space, text, useColors, type Palette } from '@/theme/tokens';

type Source = { name: string; detail: string };

const SOURCES: Source[] = [
  {
    name: 'Micah Lanier',
    detail: 'Vizatimet e fytyrave · Përzier me kapela të vizatuara për aplikacionin · Avatar Illustration System, CC BY 4.0',
  },
  {
    name: 'OpenStreetMap',
    detail: 'Vende, rrugë, shërbime, shtigje · Kontrolluar 23 tet 2026 · © OpenStreetMap contributors (ODbL)',
  },
  { name: 'Geofabrik', detail: 'Ekstrakti i Kosovës' },
  { name: 'Mapzen / AWS Terrain', detail: 'Reliev dhe kurba' },
  { name: 'UNESCO', detail: 'Monumentet Mesjetare në Kosovë' },
  {
    name: 'Wikipedia / Wikimedia',
    detail: 'Tekste dhe foto · Autorët te çdo foto · CC BY / CC BY-SA',
  },
  {
    name: 'Ngjarjet',
    detail: 'Faqet zyrtare të festivaleve · Pa datë të konfirmuar: e shënuar',
  },
  { name: 'Emergjenca', detail: 'GOV.UK, Ambasada e Italisë në Prishtinë' },
];

const MISSING: string[] = ['Vlerësime dhe komente'];

export default function DataSources() {
  const c = useColors();
  const s = makeStyles(c);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={s.screen}>
      <View style={[s.header, { paddingTop: insets.top + space.sm }]}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Kthehu"
          style={s.backButton}
        >
          <Feather name="chevron-left" size={24} color={c.label} />
        </Pressable>
        <Text style={s.title} accessibilityRole="header">
          Burimet
        </Text>
        <View style={s.backButton} />
      </View>

      <ScrollView
        contentContainerStyle={[s.content, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.group}>
          {SOURCES.map((item, i) => (
            <Pressable
              key={item.name}
              accessibilityRole="button"
              style={({ pressed }) => [s.row, pressed && { backgroundColor: c.fill }]}
            >
              <View style={s.iconCircle}>
                <Feather name="database" size={18} color={c.label} />
              </View>
              <View style={[s.rowBody, i < SOURCES.length - 1 && s.separator]}>
                <View style={s.rowText}>
                  <Text style={s.rowTitle}>{item.name}</Text>
                  <Text style={s.rowDetail}>{item.detail}</Text>
                </View>
                <Feather name="chevron-right" size={20} color={c.label2} />
              </View>
            </Pressable>
          ))}
        </View>

        <Text style={s.sectionTitle}>Çfarë nuk kemi</Text>
        <View style={s.group}>
          {MISSING.map((label, i) => (
            <View key={label} style={s.row}>
              <View style={s.iconCircle}>
                <Feather name="x" size={18} color={c.label} />
              </View>
              <View style={[s.rowBody, i < MISSING.length - 1 && s.separator]}>
                <Text style={s.missingText}>{label}</Text>
              </View>
            </View>
          ))}
        </View>
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
    row: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      minHeight: minTouch,
    },
    iconCircle: {
      width: 40,
      height: 40,
      borderRadius: radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.fill,
      marginTop: space.md,
      marginRight: space.lg,
    },
    rowBody: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: space.md,
      paddingRight: space.lg,
    },
    separator: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: c.separator,
    },
    rowText: { flex: 1, paddingRight: space.md },
    rowTitle: { ...text.headline, color: c.label },
    rowDetail: { ...text.footnote, color: c.label2, marginTop: 2 },
    sectionTitle: {
      ...text.headline,
      color: c.label,
      marginTop: space.xxl,
      marginBottom: space.md,
    },
    missingText: { ...text.title3, fontWeight: '400', color: c.label2, flex: 1 },
  });
}
