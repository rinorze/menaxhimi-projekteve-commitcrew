import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useMemo, useState } from 'react';
import { Alert, ScrollView, useWindowDimensions, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Button, Icon, Press, Txt } from '@/components';
import { ComingUp } from '@/components/home/ComingUp';
import { KosovoMap } from '@/components/home/KosovoMap';
import { PlaceOfTheDay } from '@/components/home/PlaceOfTheDay';
import { QuestCard } from '@/components/home/QuestCard';
import { Collect, Discover, NearbyCard, ProgressCard, QuickActions, SurpriseCard } from '@/components/home/Sections';
import { StreakStrip } from '@/components/home/StreakStrip';
import { UpNext } from '@/components/home/UpNext';
import { getMunicipality, places, stamps } from '@/data';
import { placePhotos } from '@/data/photos';
import { useLang, useT } from '@/lib/i18n';
import { useColors, useIsDark } from '@/theme/tokens';

// 2.1 Home. Design: docs/design/screens/02-home/ (canvas board 2.1). Everything on it is real data. There is no account
// or unlock yet (Card 2), so it shows the honest empty state: no stamps, no friends, no location. It fills itself when those arrive.

function ranked() {
  return places.filter((p) => placePhotos[p.slug]).sort((a, b) => b.score - a.score);
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginTop: 28 }}>
      <Txt variant="title2" weight="900" style={{ paddingHorizontal: 20, marginBottom: 14, letterSpacing: -0.3 }}>
        {title}
      </Txt>
      {children}
    </View>
  );
}

export default function Home() {
  const { width } = useWindowDimensions();
  const t = useT();
  const lang = useLang();
  const c = useColors();
  const dark = useIsDark();
  const [ghost, setGhost] = useState(true);

  const count = Object.keys(stamps).length;
  const visited = useMemo(() => new Set<string>(), []);

  // Today's pick: the same place for everyone all day.
  const { today, rest } = useMemo(() => {
    const pool = ranked();
    const day = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000);
    const today = pool[day % pool.length];
    return { today, rest: pool.filter((p) => p.slug !== today.slug && !stamps[p.slug]) };
  }, []);

  const cardW = width - 32;
  const mapW = Math.min(cardW * 0.7, 300);
  const mapH = (mapW * 325) / 300;

  const surprise = () => {
    Haptics.selectionAsync();
    const pool = places.filter((p) => !stamps[p.slug]);
    const p = pool[Math.floor(Math.random() * pool.length)];
    const muni = getMunicipality(p.municipality);
    Alert.alert(lang === 'sq' ? p.name_sq : p.name_en, muni ? (lang === 'sq' ? muni.name_sq : muni.name_en) : undefined);
  };

  const ghostLabel = ghost ? t({ sq: 'Modaliteti fantazmë: shokët nuk të shohin', en: 'Ghost mode: friends cannot see you' }) : t({ sq: 'Shokët të shohin', en: 'Friends can see you' });

  return (
    <View style={{ flex: 1, backgroundColor: dark ? '#000000' : '#F6F5F1' }}>
      <ScrollView contentInsetAdjustmentBehavior="never" contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        <PlaceOfTheDay place={today} />

        <View style={{ marginTop: 4 }}>
          <QuickActions />
        </View>
        <Animated.View entering={FadeInDown.duration(300).delay(40)} style={{ marginTop: 20 }}>
          <NearbyCard items={[today, ...rest.slice(0, 2)]} />
        </Animated.View>
        <Animated.View entering={FadeInDown.duration(300).delay(80)} style={{ marginTop: 14 }}>
          <ProgressCard count={count} municipalitiesCount={visited.size} />
        </Animated.View>
        <Animated.View entering={FadeInDown.duration(300).delay(120)} style={{ marginTop: 14 }}>
          <StreakStrip weeks={0} doneDays={[false, false, false, false, false, false, false]} />
        </Animated.View>

        <Section title={t({ sq: 'Zbulo', en: 'Discover' })}>
          <Discover items={rest.slice(0, 8)} />
        </Section>

        <View style={{ marginTop: 22 }}>
          <UpNext items={rest.slice(0, 3)} />
        </View>

        <Section title={t({ sq: 'Kosova në hartë', en: 'Kosovo on the map' })}>
          <Press onPress={() => router.navigate('/map')} scaleTo={0.985} accessibilityLabel={t({ sq: 'Hap hartën', en: 'Open the map' })}>
            <View
              style={{
                marginHorizontal: 16,
                width: cardW,
                height: mapH + 20,
                borderRadius: 30,
                borderCurve: 'continuous',
                borderWidth: 1,
                overflow: 'hidden',
                alignItems: 'center',
                paddingTop: 10,
                backgroundColor: c.card,
                borderColor: dark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.85)',
              }}
            >
              <KosovoMap width={mapW} visited={visited} pins />
            </View>
          </Press>
          <Press
            onPress={() => setGhost((g) => !g)}
            accessibilityLabel={ghostLabel}
            style={{ marginHorizontal: 16, marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: c.card, borderRadius: 22, paddingHorizontal: 16, height: 44 }}
          >
            <Icon name={ghost ? 'eye.slash.fill' : 'eye.fill'} size={18} />
            <Txt variant="subheadline" weight="700" style={{ flex: 1 }}>
              {ghostLabel}
            </Txt>
          </Press>
        </Section>

        <Section title={t({ sq: 'Mblidhi të gjitha', en: 'Collect them all' })}>
          <Collect />
        </Section>
        <View style={{ marginTop: 28 }}>
          <QuestCard />
        </View>
        <Section title={t({ sq: 'Së shpejti', en: 'Coming up' })}>
          <ComingUp />
        </Section>
        <View style={{ marginTop: 28 }}>
          <SurpriseCard onPick={surprise} />
        </View>

        <Txt variant="caption" tone="label3" align="center" style={{ paddingHorizontal: 30, marginTop: 28 }}>
          {t({ sq: 'Vendet nga OpenStreetMap dhe Wikidata · fotot nga Wikimedia Commons · moti nga Open-Meteo', en: 'Places from OpenStreetMap and Wikidata · photos from Wikimedia Commons · weather from Open-Meteo' })}
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
