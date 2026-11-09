import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { minTouch, radius, space, text, useColors } from '@/theme/tokens';


type T = { sq: string; en: string };
const LANG: 'sq' | 'en' = 'sq'; 
const t = (x: T) => x[LANG];

const TEXT = {
  title: { sq: 'Privatësia', en: 'Privacy' },
  heading: { sq: 'Askush s’të sheh', en: 'Nobody sees you' },
  subtitle: { sq: 'Ndarja është e fikur si parazgjedhje.', en: 'Sharing is off by default.' },
  share: { sq: 'Ndaj vendndodhjen', en: 'Share location' },
  ghost: { sq: 'Ghost', en: 'Ghost' },
  ghostSub: { sq: 'Ndal gjithçka deri në 18:00', en: 'Pause everything until 18:00' },
  who: { sq: 'Kush', en: 'Who' },
  precision: { sq: 'Sa saktë', en: 'How precise' },
  duration: { sq: 'Për sa kohë', en: 'For how long' },
  perFriend: { sq: 'Për secilin mik', en: 'Per friend' },
  example: { sq: 'Shembull', en: 'Example' },
  back: { sq: 'Kthehu', en: 'Back' },
};

type Option = { key: string; label: T };

const WHO: Option[] = [
  { key: 'friends', label: { sq: 'Miqtë', en: 'Friends' } },
  { key: 'selected', label: { sq: 'Të zgjedhurit', en: 'Selected' } },
  { key: 'nobody', label: { sq: 'Askush', en: 'Nobody' } },
];
const PRECISION: Option[] = [
  { key: 'exact', label: { sq: 'Saktë', en: 'Exact' } },
  { key: 'km', label: { sq: '≈1 km', en: '≈1 km' } },
  { key: 'city', label: { sq: 'Qyteti', en: 'City' } },
];
const DURATION: Option[] = [
  { key: '1h', label: { sq: '1 orë', en: '1 hour' } },
  { key: 'tonight', label: { sq: 'Sonte', en: 'Tonight' } },
  { key: 'always', label: { sq: 'Gjithmonë', en: 'Always' } },
];

// Avatarët: zëvendësoji me ilustrimet kur t’i kesh asset-et
const FRIENDS = [
  { name: 'Arta', value: { sq: '≈1 km', en: '≈1 km' }, bg: '#FBE7A1', emoji: '👩🏼' },
  { name: 'Dren', value: { sq: 'E saktë', en: 'Exact' }, bg: '#CFE8EF', emoji: '🧑🏾' },
  { name: 'Vesa', value: { sq: 'Vetëm qyteti', en: 'City only' }, bg: '#DCD6F2', emoji: '👩🏻' },
];

function Segmented({
  options,
  value,
  onChange,
}: {
  options: Option[];
  value: string;
  onChange: (k: string) => void;
}) {
  const c = useColors();
  return (
    <View style={[styles.segment, { backgroundColor: c.fill }]}>
      {options.map((o) => {
        const active = o.key === value;
        return (
          <Pressable
            key={o.key}
            onPress={() => onChange(o.key)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            style={[styles.segmentItem, active && { backgroundColor: c.card }, active && styles.segmentActive]}
          >
            <Text style={[text.subheadline, styles.segmentText, { color: c.label }]}>{t(o.label)}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function PrivacySettings() {
  const c = useColors();
  const router = useRouter();

  const [share, setShare] = useState(false);
  const [ghost, setGhost] = useState(false);
  const [who, setWho] = useState('friends');
  const [precision, setPrecision] = useState('km');
  const [duration, setDuration] = useState('1h');

  const switchProps = {
    trackColor: { false: c.fillStrong, true: c.green },
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: c.bg }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel={t(TEXT.back)}
            style={[styles.backBtn, { backgroundColor: c.card }]}
          >
            <Ionicons name="chevron-back" size={22} color={c.label} />
          </Pressable>
          <Text style={[text.headline, { color: c.label }]}>{t(TEXT.title)}</Text>
          <View style={styles.backBtn} />
        </View>

        <Text style={[text.title2, styles.center, { color: c.label }]}>{t(TEXT.heading)}</Text>
        <Text style={[text.subheadline, styles.subtitle, { color: c.label2 }]}>{t(TEXT.subtitle)}</Text>

        {/* Toggles */}
        <View style={[styles.card, { backgroundColor: c.fill }]}>
          <View style={styles.row}>
            <View style={[styles.iconBox, { backgroundColor: c.fillStrong }]}>
              <Ionicons name="navigate-outline" size={20} color={c.label} />
            </View>
            <Text style={[text.body, styles.flex, { color: c.label }]}>{t(TEXT.share)}</Text>
            <Switch value={share} onValueChange={setShare} {...switchProps} />
          </View>
          <View style={[styles.divider, { backgroundColor: c.separator }]} />
          <View style={styles.row}>
            <View style={[styles.iconBox, { backgroundColor: c.fillStrong }]}>
              <Ionicons name="eye-off-outline" size={20} color={c.label} />
            </View>
            <View style={styles.flex}>
              <Text style={[text.body, { color: c.label }]}>{t(TEXT.ghost)}</Text>
              <Text style={[text.footnote, { color: c.label2 }]}>{t(TEXT.ghostSub)}</Text>
            </View>
            <Switch value={ghost} onValueChange={setGhost} {...switchProps} />
          </View>
        </View>

        <Text style={[text.headline, styles.section, { color: c.label }]}>{t(TEXT.who)}</Text>
        <Segmented options={WHO} value={who} onChange={setWho} />

        <Text style={[text.headline, styles.section, { color: c.label }]}>{t(TEXT.precision)}</Text>
        <Segmented options={PRECISION} value={precision} onChange={setPrecision} />

        <Text style={[text.headline, styles.section, { color: c.label }]}>{t(TEXT.duration)}</Text>
        <Segmented options={DURATION} value={duration} onChange={setDuration} />

        {/* Per friend */}
        <View style={styles.sectionRow}>
          <Text style={[text.headline, { color: c.label }]}>{t(TEXT.perFriend)}</Text>
          <View style={[styles.badge, { backgroundColor: c.fillStrong }]}>
            <Text style={[text.caption, styles.badgeText, { color: c.label2 }]}>{t(TEXT.example)}</Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: c.fill }]}>
          {FRIENDS.map((f, i) => (
            <View key={f.name}>
              {i > 0 && <View style={[styles.divider, { backgroundColor: c.separator }]} />}
              <Pressable style={styles.row} accessibilityRole="button">
                <View style={[styles.avatar, { backgroundColor: f.bg }]}>
                  <Text style={styles.emoji}>{f.emoji}</Text>
                </View>
                <Text style={[text.body, styles.flex, { color: c.label }]}>{f.name}</Text>
                <Text style={[text.callout, { color: c.label2 }]}>{t(f.value)}</Text>
                <Ionicons name="chevron-forward" size={18} color={c.label3} />
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  flex: { flex: 1 },
  center: { textAlign: 'center' },
  content: { paddingHorizontal: space.xl, paddingBottom: 140 }, 
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: space.sm,
    marginBottom: space.lg,
  },
  backBtn: {
    width: minTouch + 2,
    height: minTouch + 2,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  subtitle: { textAlign: 'center', marginTop: space.xs, marginBottom: space.xl },
  card: { borderRadius: radius.sheet, paddingHorizontal: space.md },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: minTouch + space.md,
    paddingVertical: space.sm,
    gap: space.md,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: radius.row,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: { height: StyleSheet.hairlineWidth, marginLeft: 52 },
  section: { marginTop: space.xxl, marginBottom: space.md },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    marginTop: space.xxl,
    marginBottom: space.md,
  },
  badge: { borderRadius: radius.pill, paddingHorizontal: space.md, paddingVertical: 3 },
  badgeText: { fontWeight: '600' },
  segment: { flexDirection: 'row', borderRadius: radius.sheet, padding: space.xs },
  segmentItem: {
    flex: 1,
    minHeight: minTouch + 4,
    borderRadius: radius.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  segmentText: { fontWeight: '600' },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 22 },
});