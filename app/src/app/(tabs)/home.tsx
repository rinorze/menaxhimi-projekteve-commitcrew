import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Button, Txt } from '@/components';
import { Chips, ComingUpList, Header, Komunat, Popular, Quests, SearchPill, Section, Today, YourKosovo, type Filter } from '@/components/home/Blocks';
import { places, stamps } from '@/data';
import { placePhotos } from '@/data/photos';
import { useT } from '@/lib/i18n';
import { useColors } from '@/theme/tokens';

// 2.1 Home. Design: docs/design/screens/02-home/ (rebuilt after research on 26 apps, see the notes in Blocks.tsx).
// Everything on it is real data. There is no account or unlock yet (Card 2), so progress is 0 and says so.

export default function Home() {
  const t = useT();
  const c = useColors();
  const [filter, setFilter] = useState<Filter>('all');

  // Today's pick is the same for everyone all day.
  const today = useMemo(() => {
    const pool = places.filter((p) => placePhotos[p.slug]).sort((a, b) => b.score - a.score);
    const day = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000);
    return pool[day % pool.length];
  }, []);

  const count = new Set(places.filter((p) => stamps[p.slug]).map((p) => p.municipality)).size;

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentInsetAdjustmentBehavior="never" contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        <Header />
        <SearchPill />
        <Section title="" first>
          <Chips value={filter} onChange={setFilter} />
        </Section>

        <Section title={t({ sq: 'Në fokus sot', en: 'In focus today' })} first>
          <Today place={today} />
        </Section>

        <Section title={t({ sq: 'Më të njohurat në Kosovë', en: 'Popular in Kosovo' })} to="/search">
          <Popular filter={filter} />
        </Section>

        <Section title={t({ sq: 'Kosova jote', en: 'Your Kosovo' })} to="/passport">
          <YourKosovo />
        </Section>

        <Section title={t({ sq: 'Sfidat', en: 'Quests' })}>
          <Quests />
        </Section>

        <Section title="Komunat" link={t({ sq: `${count} nga 38`, en: `${count} of 38` })}>
          <Komunat />
        </Section>

        <Section title={t({ sq: 'Së shpejti', en: 'Coming up' })}>
          <ComingUpList />
        </Section>

        <Txt variant="caption" tone="label3" align="center" style={{ paddingHorizontal: 30, marginTop: 32 }}>
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
