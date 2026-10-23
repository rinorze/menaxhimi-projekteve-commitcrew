import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, View } from 'react-native';

import { events, getMunicipality } from '@/data';
import { municipalityPhotos } from '@/data/photos';
import { useLang, useT } from '@/lib/i18n';
import { Press } from '../Press';
import { Txt } from '../Txt';

/** Upcoming events from the real list. Events marked tentative show only the month and "dates to confirm". */
export function ComingUp() {
  const t = useT();
  const lang = useLang();
  const locale = lang === 'sq' ? 'sq-AL' : 'en-GB';
  const now = new Date();
  const list = events.filter((e) => new Date(e.ends_at) >= now).sort((a, b) => a.starts_at.localeCompare(b.starts_at)).slice(0, 4);
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
      {list.map((e) => {
        const city = getMunicipality(e.municipality);
        const start = new Date(e.starts_at);
        const when = e.tentative
          ? `${start.toLocaleDateString(locale, { month: 'long' })} · ${t({ sq: 'data për t’u konfirmuar', en: 'dates to confirm' })}`
          : start.toLocaleDateString(locale, { day: 'numeric', month: 'long' });
        return (
          <Press key={e.slug} accessibilityLabel={lang === 'sq' ? e.title_sq : e.title_en}>
            <View style={styles.card}>
              {municipalityPhotos[e.municipality] ? <Image source={municipalityPhotos[e.municipality]} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} /> : null}
              <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(20,16,60,0.92)']} locations={[0.35, 1]} style={StyleSheet.absoluteFill} />
              <View style={{ position: 'absolute', left: 18, right: 18, bottom: 18 }}>
                <Txt variant="caption" weight="800" numberOfLines={1} style={{ color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {when}
                </Txt>
                <Txt variant="title1" weight="800" numberOfLines={2} style={{ color: '#FFFFFF', marginTop: 4 }}>
                  {lang === 'sq' ? e.title_sq : e.title_en}
                </Txt>
                <Txt variant="subheadline" style={{ color: 'rgba(255,255,255,0.9)', marginTop: 6 }} numberOfLines={1}>
                  {city ? (lang === 'sq' ? city.name_sq : city.name_en) : ''}
                </Txt>
              </View>
            </View>
          </Press>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: { width: 260, height: 300, borderRadius: 28, overflow: 'hidden', backgroundColor: '#2B2F4A' },
});
