import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, type Href } from 'expo-router';
import type { SFSymbol } from 'expo-symbols';
import { ScrollView, StyleSheet, View } from 'react-native';

import { getMunicipality, places, type Place } from '@/data';
import { placePhotos } from '@/data/photos';
import { useLang, useT } from '@/lib/i18n';
import { useColors, useIsDark } from '@/theme/tokens';
import { Icon } from '../Icon';
import { Press } from '../Press';
import { Txt } from '../Txt';

/** Four ways to get going, one tap each. Only to screens that exist. */
export function QuickActions() {
  const t = useT();
  const c = useColors();
  const items: { icon: SFSymbol; label: string; to: Href }[] = [
    { icon: 'map.fill', label: t({ sq: 'Harta', en: 'Map' }), to: '/map' },
    { icon: 'book.closed.fill', label: t({ sq: 'Pasaporta', en: 'Passport' }), to: '/passport' },
    { icon: 'person.2.fill', label: t({ sq: 'Shokët', en: 'Friends' }), to: '/friends' },
    { icon: 'magnifyingglass', label: t({ sq: 'Kërko', en: 'Search' }), to: '/search' },
  ];
  return (
    <View style={styles.quick}>
      {items.map((i) => (
        <Press key={i.label} onPress={() => router.navigate(i.to)} accessibilityLabel={i.label} style={{ alignItems: 'center', gap: 8, width: 78 }}>
          <View style={[styles.quickIcon, { backgroundColor: c.card }]}>
            <Icon name={i.icon} size={24} />
          </View>
          <Txt variant="caption" weight="700">
            {i.label}
          </Txt>
        </Press>
      ))}
    </View>
  );
}

/** Three real places to start with (no location yet, so the best-scored ones with a photo). */
export function NearbyCard({ items }: { items: Place[] }) {
  const t = useT();
  const lang = useLang();
  const c = useColors();
  const first = items[0];
  const name = lang === 'sq' ? first.name_sq : first.name_en;
  const muni = getMunicipality(first.municipality);
  return (
    <Press accessibilityLabel={name} style={[styles.card, { backgroundColor: c.card, marginHorizontal: 16 }]}>
      <View style={{ flexDirection: 'row' }}>
        {items.slice(0, 3).map((p, i) => (
          <Image key={p.slug} source={placePhotos[p.slug]} contentFit="cover" style={[styles.stackPhoto, { borderColor: c.card, marginLeft: i ? -14 : 0 }]} />
        ))}
      </View>
      <View style={{ flex: 1 }}>
        <Txt variant="headline" weight="800" numberOfLines={1}>
          {t({ sq: `${name} dhe 2 të tjera`, en: `${name} and 2 more` })}
        </Txt>
        <Txt variant="subheadline" tone="label2" numberOfLines={1}>
          {muni ? (lang === 'sq' ? muni.name_sq : muni.name_en) : ''} · {t({ sq: 'për të nisur', en: 'to start with' })}
        </Txt>
      </View>
      <Icon name="chevron.right" size={16} tone="label3" />
    </Press>
  );
}

/** How much of Kosovo is yours, in real numbers. */
export function ProgressCard({ count, municipalitiesCount }: { count: number; municipalitiesCount: number }) {
  const t = useT();
  const c = useColors();
  const pct = (count / places.length) * 100;
  return (
    <View style={[styles.card, { backgroundColor: c.card, marginHorizontal: 16, flexDirection: 'column', alignItems: 'stretch', gap: 2 }]}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
        <Txt variant="largeTitle" weight="900" style={{ fontSize: 38, fontVariant: ['tabular-nums'] }}>
          {pct < 1 && count > 0 ? '<1' : Math.round(pct)}%
        </Txt>
        <Txt variant="headline" weight="800" tone="label3">
          {t({ sq: 'e Kosovës është jotja', en: 'of Kosovo is yours' })}
        </Txt>
      </View>
      <Txt variant="footnote" tone="label2" style={{ fontVariant: ['tabular-nums'] }}>
        {t({ sq: `${count} nga ${places.length} vende · ${municipalitiesCount} nga 38 komuna`, en: `${count} of ${places.length} places · ${municipalitiesCount} of 38 municipalities` })}
      </Txt>
      <View style={[styles.bar, { backgroundColor: c.fill }]}>
        <View style={{ width: `${Math.max(pct, count ? 3 : 0)}%`, height: 8, borderRadius: 4, backgroundColor: c.blue }} />
      </View>
    </View>
  );
}

/** Photo tiles of real places to open next. */
export function Discover({ items }: { items: Place[] }) {
  const lang = useLang();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12, paddingBottom: 8 }}>
      {items.map((p) => {
        const muni = getMunicipality(p.municipality);
        return (
          <Press key={p.slug} accessibilityLabel={lang === 'sq' ? p.name_sq : p.name_en} scaleTo={0.97} style={styles.tile}>
            <Image source={placePhotos[p.slug]} contentFit="cover" transition={250} style={StyleSheet.absoluteFill} />
            <LinearGradient pointerEvents="none" colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']} locations={[0.45, 1]} style={StyleSheet.absoluteFill} />
            <View style={{ position: 'absolute', left: 14, right: 14, bottom: 13 }}>
              <Txt variant="headline" weight="800" numberOfLines={2} style={{ color: '#FFFFFF' }}>
                {lang === 'sq' ? p.name_sq : p.name_en}
              </Txt>
              <Txt variant="caption" style={{ color: 'rgba(255,255,255,0.85)' }} numberOfLines={1}>
                {muni ? (lang === 'sq' ? muni.name_sq : muni.name_en) : ''}
              </Txt>
            </View>
          </Press>
        );
      })}
    </ScrollView>
  );
}

const CATEGORIES: { key: string; icon: SFSymbol; sq: string; en: string; tint: string; bgLight: string; bgDark: string }[] = [
  { key: 'peak', icon: 'mountain.2.fill', sq: 'Majat', en: 'Summits', tint: '#2F62F5', bgLight: '#E4EEFF', bgDark: '#1A2748' },
  { key: 'waterfall', icon: 'drop.fill', sq: 'Ujëvarat', en: 'Waterfalls', tint: '#0E7C86', bgLight: '#DDF6FF', bgDark: '#10303A' },
  { key: 'fortress', icon: 'building.columns.fill', sq: 'Kalatë', en: 'Fortresses', tint: '#8A6A3B', bgLight: '#F3EBDD', bgDark: '#3A2F1F' },
  { key: 'cave', icon: 'moon.fill', sq: 'Shpellat', en: 'Caves', tint: '#6B4FB3', bgLight: '#ECE6F7', bgDark: '#2B2440' },
];

/** The collections, with the real count of places in each. */
export function Collect() {
  const t = useT();
  const dark = useIsDark();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
      {CATEGORIES.map((cat) => {
        const n = places.filter((p) => p.category === cat.key).length;
        return (
          <Press key={cat.key} accessibilityLabel={`${t({ sq: cat.sq, en: cat.en })}, ${n}`} style={[styles.collect, { backgroundColor: dark ? cat.bgDark : cat.bgLight }]}>
            <Icon name={cat.icon} size={40} tone="label" />
            <View style={{ position: 'absolute' }} />
            <Txt variant="subheadline" weight="800">
              {t({ sq: cat.sq, en: cat.en })}
            </Txt>
            <Txt variant="caption" tone="label2" style={{ marginTop: -4, fontVariant: ['tabular-nums'] }}>
              {t({ sq: `${n} vende`, en: `${n} places` })}
            </Txt>
          </Press>
        );
      })}
    </ScrollView>
  );
}

/** "Can't decide?" picks one real place you have not stamped. */
export function SurpriseCard({ onPick }: { onPick: () => void }) {
  const t = useT();
  return (
    <Press onPress={onPick} accessibilityLabel={t({ sq: 'Më befaso', en: 'Surprise me' })} style={styles.surprise}>
      <View style={{ position: 'absolute', right: 10, bottom: -10, opacity: 0.3 }}>
        <Icon name="dice.fill" size={104} tone="onTint" />
      </View>
      <Txt variant="caption" weight="800" style={{ color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 0.6 }}>
        {t({ sq: 'Nuk vendos dot?', en: 'Can’t decide?' })}
      </Txt>
      <Txt variant="title1" weight="900" style={{ color: '#FFFFFF', marginTop: 4 }}>
        {t({ sq: 'Më befaso', en: 'Surprise me' })}
      </Txt>
      <Txt variant="subheadline" style={{ color: 'rgba(255,255,255,0.8)', marginTop: 4, maxWidth: 230 }}>
        {t({ sq: 'Një vend i vërtetë që s’e ke vulosur ende.', en: 'One real place you haven’t stamped yet.' })}
      </Txt>
    </Press>
  );
}

const styles = StyleSheet.create({
  quick: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16 },
  quickIcon: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  card: { borderRadius: 30, borderCurve: 'continuous', padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14 },
  stackPhoto: { width: 44, height: 44, borderRadius: 22, borderWidth: 3 },
  bar: { height: 8, borderRadius: 4, marginTop: 12, overflow: 'hidden' },
  tile: { width: 154, height: 190, borderRadius: 30, borderCurve: 'continuous', overflow: 'hidden', backgroundColor: '#1C2233' },
  collect: { width: 104, height: 128, borderRadius: 24, borderCurve: 'continuous', alignItems: 'center', justifyContent: 'center', gap: 8 },
  surprise: { marginHorizontal: 16, height: 150, borderRadius: 30, borderCurve: 'continuous', backgroundColor: '#14161C', padding: 20, overflow: 'hidden' },
});
