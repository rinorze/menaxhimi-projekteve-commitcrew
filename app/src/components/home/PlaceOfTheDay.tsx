import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { getMunicipality, type Place } from '@/data';
import { placePhotos } from '@/data/photos';
import { useLang, useT } from '@/lib/i18n';
import { useWeather, WEATHER_CREDIT } from '@/lib/weather';
import { Glass } from '../Glass';
import { Icon } from '../Icon';
import { Press } from '../Press';
import { Txt } from '../Txt';

/** The one big thing on Home: today's place, with its photo and the real weather there right now. */
export function PlaceOfTheDay({ place }: { place: Place }) {
  const t = useT();
  const lang = useLang();
  const { width } = useWindowDimensions();
  const weather = useWeather(place.lat, place.lng);
  const muni = getMunicipality(place.municipality);
  const name = lang === 'sq' ? place.name_sq : place.name_en;
  const w = width - 32;

  return (
    <Press
      onPress={() => {
        Haptics.selectionAsync();
      }}
      scaleTo={0.98}
      accessibilityLabel={`${t({ sq: 'Vendi i ditës', en: 'Place of the day' })}: ${name}`}
      style={{ marginHorizontal: 16, width: w, height: w * 1.12, borderRadius: 28, borderCurve: 'continuous', overflow: 'hidden', backgroundColor: '#1C2233' }}
    >
      <Image source={placePhotos[place.slug]} contentFit="cover" transition={250} style={StyleSheet.absoluteFill} />
      <LinearGradient colors={['rgba(0,0,0,0.28)', 'transparent', 'rgba(0,0,0,0.78)']} locations={[0, 0.4, 1]} style={StyleSheet.absoluteFill} />
      <View style={styles.top}>
        <Glass style={styles.tag}>
          <Txt variant="footnote" weight="800">
            {t({ sq: 'Vendi i ditës', en: 'Place of the day' })}
          </Txt>
        </Glass>
        {weather ? (
          <Glass style={styles.tag}>
            <Icon name={weather.symbol} size={14} />
            <Txt variant="footnote" weight="800" style={{ fontVariant: ['tabular-nums'] }}>
              {Math.round(weather.tempC)}°
            </Txt>
          </Glass>
        ) : null}
      </View>
      <View style={styles.bottom}>
        <Txt variant="largeTitle" weight="900" style={{ color: '#FFFFFF', fontSize: 32, lineHeight: 38 }} numberOfLines={2}>
          {name}
        </Txt>
        <Txt variant="subheadline" weight="600" style={{ color: 'rgba(255,255,255,0.85)', marginTop: 4 }}>
          {muni ? (lang === 'sq' ? muni.name_sq : muni.name_en) : ''}
        </Txt>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
          <Glass style={styles.cta}>
            <Icon name="camera.fill" size={15} />
            <Txt variant="subheadline" weight="800">
              {t({ sq: 'Shko dhe hape', en: 'Go and unlock' })}
            </Txt>
          </Glass>
          {weather ? (
            <Txt variant="caption" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {WEATHER_CREDIT}
            </Txt>
          ) : null}
        </View>
      </View>
    </Press>
  );
}

const styles = StyleSheet.create({
  top: { position: 'absolute', top: 14, left: 14, right: 14, flexDirection: 'row', justifyContent: 'space-between' },
  tag: { height: 30, paddingHorizontal: 12, borderRadius: 15, flexDirection: 'row', alignItems: 'center', gap: 5, overflow: 'hidden' },
  bottom: { position: 'absolute', left: 18, right: 18, bottom: 18 },
  cta: { height: 44, paddingHorizontal: 18, borderRadius: 22, flexDirection: 'row', alignItems: 'center', gap: 8, overflow: 'hidden' },
});
