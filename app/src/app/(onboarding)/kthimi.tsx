import { useMemo, useState } from 'react';
import { TextInput } from 'react-native';
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

const COUNTRIES = ['Gjermani', 'Zvicër', 'Austri', 'Francë', 'Belgjikë', 'Tjetër'];
const MONTHS = ['Korrik', 'Gusht', 'Ende e hapur'];
const MUNICIPALITIES = [
  'Deçan', 'Dragash', 'Drenas', 'Ferizaj', 'Fushë Kosovë', 'Gjakovë', 'Gjilan', 'Graçanicë', 'Hani i Elezit', 'Istog',
  'Junik', 'Kaçanik', 'Kamenicë', 'Klinë', 'Kllokot', 'Leposaviq', 'Lipjan', 'Malishevë', 'Mamushë', 'Mitrovicë',
  'Mitrovicë e Veriut', 'Novobërdë', 'Obiliq', 'Parteš', 'Pejë', 'Podujevë', 'Prishtinë', 'Prizren', 'Rahovec', 'Ranillug',
  'Shtërpcë', 'Shtime', 'Skënderaj', 'Suharekë', 'Viti', 'Vushtrri', 'Zubin Potok', 'Zveçan',
]; // 38

export default function Kthimi() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const [country, setCountry] = useState('Gjermani');
  const [query, setQuery] = useState('Prizren');
  const [muni, setMuni] = useState('Prizren');
  const [month, setMonth] = useState('Gusht');
  const [open, setOpen] = useState(false);

  const matches = useMemo(
    () => MUNICIPALITIES.filter((m) => m.toLowerCase().includes(query.trim().toLowerCase())),
    [query],
  );

  const chip = (label: string, on: boolean, onPress: () => void, grow = false) => (
    <Pressable key={label} onPress={onPress} accessibilityRole="button" accessibilityState={{ selected: on }}
      style={[styles.chip, { backgroundColor: on ? c.tint : c.fill, flex: grow ? 1 : undefined }]}>
      <Text style={[text.subheadline, { color: on ? c.onTint : c.label, fontWeight: '600' }]}>{label}</Text>
    </Pressable>
  );
  const label = [text.footnote, { color: c.label2, fontWeight: '600' as const, letterSpacing: 1, marginTop: 20, marginBottom: 8 }];

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }}>
        <Progress step={2} />
        <Text style={[text.largeTitle, { color: c.label, marginTop: 24 }]}>{tr({ sq: 'Kur vjen në shtëpi?', en: 'When are you coming home?' })}</Text>
        <Text style={[text.subheadline, { color: c.label2, marginTop: 20 }]}>{tr({ sq: 'Kthimi · e vëmë të parin qytetin e familjes.', en: 'Homecoming · we put the family town first.' })}</Text>

        <Text style={label}>{tr({ sq: 'JETOJ NË', en: 'I LIVE IN' })}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {COUNTRIES.map((x) => chip(x, country === x, () => setCountry(x)))}
        </View>

        <Text style={label}>{tr({ sq: 'FAMILJA NGA', en: 'FAMILY FROM' })}</Text>
        <View style={[styles.search, { backgroundColor: c.fill }]}>
          <Text style={{ color: c.label2 }}>⌕</Text>
          <TextInput
            value={query}
            onChangeText={(t) => { setQuery(t); setOpen(true); }}
            onFocus={() => setOpen(true)}
            placeholder={tr({ sq: 'Kërko komunën', en: 'Search municipality' })}
            placeholderTextColor={c.label3}
            style={{ flex: 1, marginLeft: 8, color: c.label, fontSize: 17, minHeight: minTouch }}
          />
        </View>
        {open && (
          <View style={{ backgroundColor: c.fill, borderRadius: radius.card, marginTop: 8, maxHeight: 200, overflow: 'hidden' }}>
            <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
              {matches.map((m) => (
                <Pressable key={m} onPress={() => { setMuni(m); setQuery(m); setOpen(false); }}
                  style={{ minHeight: minTouch, justifyContent: 'center', paddingHorizontal: 14 }}>
                  <Text style={[text.body, { color: c.label }]}>{m}</Text>
                </Pressable>
              ))}
              {matches.length === 0 && <Text style={[text.body, { padding: 14, color: c.label2 }]}>{tr({ sq: 'Asnjë rezultat', en: 'No results' })}</Text>}
            </ScrollView>
          </View>
        )}

        <Text style={label}>{tr({ sq: 'KUR', en: 'WHEN' })}</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {MONTHS.map((m) => chip(m, month === m, () => setMonth(m), true))}
        </View>

        {/* Ticket card */}
        <View style={[styles.ticket, { backgroundColor: c.card, borderColor: c.separator }]}>
          <View style={{ flex: 1 }}>
            <Text style={[text.caption, { color: c.label2, fontWeight: '700', letterSpacing: 1 }]}>KTHIMI · 2027</Text>
            <Text style={[text.title2, { color: c.label, marginTop: 4 }]}>{country} → {muni}</Text>
            <Text style={[text.footnote, { color: c.label2, marginTop: 2 }]}>
              {month} · 22 vende · DokuFest {tr({ sq: '(datat për t’u konfirmuar)', en: '(dates to be confirmed)' })}
            </Text>
          </View>
          <View style={{ alignSelf: 'stretch', marginHorizontal: 14, borderLeftWidth: 1, borderStyle: 'dashed', borderColor: c.separator }} />
          <Text style={{ fontSize: 32, color: c.stone }}>⌂</Text>
        </View>

        <Pressable onPress={() => router.push('/interests')} accessibilityRole="button" style={[styles.button, { backgroundColor: c.tint, marginTop: 28 }]}>
          <Text style={[text.headline, { color: c.onTint }]}>{tr({ sq: 'Vazhdo', en: 'Continue' })}</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/interests')} accessibilityRole="button" style={[styles.button, { marginTop: 4 }]}>
          <Text style={[text.headline, { color: c.label2 }]}>{tr({ sq: 'Vetëm shiko', en: 'Just look' })}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: minTouch + 6, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  chip: { minHeight: minTouch, paddingHorizontal: 16, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  search: { flexDirection: 'row', alignItems: 'center', borderRadius: radius.card, paddingHorizontal: 14 },
  ticket: { marginTop: 28, borderRadius: radius.sheet, padding: 18, flexDirection: 'row', alignItems: 'center', borderWidth: StyleSheet.hairlineWidth, transform: [{ rotate: '-2deg' }],
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 4 },
});
