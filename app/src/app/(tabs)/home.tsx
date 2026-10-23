import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Glass, GlassIconButton, Icon, Press, Txt } from '@/components';
import { ComingUp } from '@/components/home/ComingUp';
import { KosovoMap } from '@/components/home/KosovoMap';
import { PlaceOfTheDay } from '@/components/home/PlaceOfTheDay';
import { QuestCard } from '@/components/home/QuestCard';
import { StreakStrip } from '@/components/home/StreakStrip';
import { UpNext } from '@/components/home/UpNext';
import { places, stamps } from '@/data';
import { placePhotos } from '@/data/photos';
import { useT } from '@/lib/i18n';
import { useColors, useIsDark } from '@/theme/tokens';

// 2.1 Home: a living map of your Kosovo. Design: docs/design/screens/02-home/01-home-full-scroll.png (+ 02-home-dark-mode.png).
// Everything on it is real data. There is no account or unlock yet (Card 2), so it shows the honest empty state:
// no stamps, no friends, no location. It fills itself when those arrive.

/** Today's pick: the same place for everyone all day, one that has a photo and is not a place of worship. */
function placeOfTheDay() {
  const pool = places.filter((p) => placePhotos[p.slug] && !p.sensitive).sort((a, b) => b.score - a.score);
  const day = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000);
  return pool[day % pool.length];
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginTop: 26 }}>
      <Txt variant="title3" weight="800" style={{ paddingHorizontal: 20, marginBottom: 12 }}>
        {title}
      </Txt>
      {children}
    </View>
  );
}

export default function Home() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const t = useT();
  const c = useColors();
  const dark = useIsDark();
  const [ghost, setGhost] = useState(true);

  const count = Object.keys(stamps).length;
  const visited = useMemo(() => new Set<string>(), []);
  const pct = (count / places.length) * 100;
  const headline = count === 0 ? t({ sq: 'Kosova po të pret', en: 'Kosovo is waiting' }) : `${pct < 1 ? '<1' : Math.round(pct)}% ${t({ sq: 'e Kosovës', en: 'of Kosovo' })}`;
  const subline = count === 0 ? t({ sq: `${places.length} vende për t’i hapur`, en: `${places.length} places to unlock` }) : t({ sq: 'është jotja', en: 'is yours' });

  const upNext = useMemo(() => {
    const first = placeOfTheDay();
    const rest = places.filter((p) => placePhotos[p.slug] && !p.sensitive && p.slug !== first.slug && !stamps[p.slug]).sort((a, b) => b.score - a.score);
    return [first, ...rest].slice(0, 3);
  }, []);

  const cardW = width - 32;
  const mapW = Math.min(cardW * 0.7, 300);
  const mapH = (mapW * 325) / 300;

  return (
    <View style={{ flex: 1, backgroundColor: dark ? '#000000' : '#F6F5F1' }}>
      <LinearGradient pointerEvents="none" colors={dark ? ['#0B1230', '#121A3A', '#000000'] : ['#DDE8FF', '#EEF3FF', '#F6F5F1']} locations={[0, 0.45, 1]} style={[StyleSheet.absoluteFill, { height: 520 }]} />
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 6, paddingBottom: 140 }} contentInsetAdjustmentBehavior="never" showsVerticalScrollIndicator={false}>
        {/* header: profile, place pill, ghost mode (all Liquid Glass) */}
        <View style={styles.header}>
          <GlassIconButton name="person.fill" label={t({ sq: 'Pasaporta jote', en: 'Your passport' })} onPress={() => router.navigate('/passport')} />
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Glass style={styles.pill}>
              <Icon name="location.fill" size={14} />
              <Txt variant="subheadline" weight="800">
                {t({ sq: 'Kosova', en: 'Kosovo' })}
              </Txt>
            </Glass>
          </View>
          <GlassIconButton
            name={ghost ? 'eye.slash.fill' : 'eye.fill'}
            label={ghost ? t({ sq: 'Modaliteti fantazmë: shokët nuk të shohin', en: 'Ghost mode: friends cannot see you' }) : t({ sq: 'Shokët të shohin', en: 'Friends can see you' })}
            onPress={() => setGhost((g) => !g)}
          />
        </View>

        {/* big heading and the two counts */}
        <Animated.View entering={FadeInDown.duration(450)} style={{ paddingHorizontal: 20, marginTop: 14 }}>
          <Txt variant="largeTitle" weight="900" style={{ fontSize: 40, lineHeight: 46 }}>
            {headline}
          </Txt>
          <Txt variant="title2" weight="800" tone="label3" style={{ marginTop: 2 }}>
            {subline}
          </Txt>
          <Txt variant="subheadline" tone="label2" weight="600" style={{ marginTop: 10, fontVariant: ['tabular-nums'] }}>
            {t({ sq: `${count} nga ${places.length} vende · ${visited.size} nga 38 komuna`, en: `${count} of ${places.length} places · ${visited.size} of 38 municipalities` })}
          </Txt>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(350).delay(60)} style={{ marginTop: 18 }}>
          <PlaceOfTheDay place={upNext[0]} />
        </Animated.View>

        {/* the living map */}
        <Animated.View entering={FadeInDown.duration(450).delay(120)}>
          <Press onPress={() => router.navigate('/map')} scaleTo={0.985} accessibilityLabel={t({ sq: 'Hap hartën', en: 'Open the map' })}>
            <View style={[styles.mapCard, { width: cardW, height: mapH + 20, backgroundColor: dark ? 'rgba(28,28,32,0.72)' : 'rgba(255,255,255,0.62)', borderColor: dark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.85)' }]}>
              <KosovoMap width={mapW} visited={visited} pins />
            </View>
          </Press>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(450).delay(160)} style={{ marginTop: 14 }}>
          <StreakStrip weeks={0} doneDays={[false, false, false, false, false, false, false]} />
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(450).delay(240)} style={{ marginTop: 22 }}>
          <UpNext items={upNext.slice(1)} />
        </Animated.View>

        <View style={{ marginTop: 22 }}>
          <QuestCard />
        </View>
        <Section title={t({ sq: 'Së shpejti', en: 'Coming up' })}>
          <ComingUp />
        </Section>

        <Txt variant="caption" tone="label3" align="center" style={{ paddingHorizontal: 30, marginTop: 28 }}>
          {t({ sq: 'Vendet nga OpenStreetMap dhe Wikidata · fotot nga Wikimedia Commons', en: 'Places from OpenStreetMap and Wikidata · photos from Wikimedia Commons' })}
        </Txt>

        {/* for the team while the app is being built */}
        <View style={{ marginTop: 30, paddingHorizontal: 16, gap: 10 }}>
          <Txt variant="footnote" tone="label2" weight="600" style={{ textTransform: 'uppercase' }}>
            {t({ sq: 'Për ekipin', en: 'For the team' })}
          </Txt>
          <Button variant="glass" icon="square.grid.2x2" label={t({ sq: 'Komponentet', en: 'Components' })} onPress={() => router.push('/components')} />
          <Button variant="glass" icon="list.number" label={t({ sq: 'Të gjitha ekranet e onboarding', en: 'All onboarding screens' })} onPress={() => router.push('/screens')} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16 },
  pill: { height: 36, paddingHorizontal: 14, borderRadius: 18, flexDirection: 'row', alignItems: 'center', gap: 6, overflow: 'hidden' },
  chip: { height: 30, paddingHorizontal: 12, borderRadius: 15, justifyContent: 'center', overflow: 'hidden' },
  mapCard: { marginHorizontal: 16, marginTop: 16, borderRadius: 30, borderWidth: 1, overflow: 'hidden', alignItems: 'center', paddingTop: 10 },
});
