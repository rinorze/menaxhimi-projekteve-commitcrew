import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getMunicipality, type Place } from '@/data';
import { placePhotos } from '@/data/photos';
import { useLang, useT } from '@/lib/i18n';
import { useWeather, WEATHER_CREDIT } from '@/lib/weather';
import { useIsDark } from '@/theme/tokens';
import { Glass } from '../Glass';
import { GlassIconButton } from '../GlassIconButton';
import { Icon } from '../Icon';
import { Press } from '../Press';
import { Txt } from '../Txt';

/** Full-bleed hero: today's place, its photo fading into the page, the real weather there, and the two ways in. */
export function PlaceOfTheDay({ place }: { place: Place }) {
  const t = useT();
  const lang = useLang();
  const dark = useIsDark();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const weather = useWeather(place.lat, place.lng);
  const muni = getMunicipality(place.municipality);
  const name = lang === 'sq' ? place.name_sq : place.name_en;
  const bg = dark ? '#000000' : '#F6F5F1';
  const clear = dark ? 'rgba(0,0,0,0)' : 'rgba(246,245,241,0)';
  const heroH = Math.min(Math.max(width * 1.5, 560), 640);

  return (
    <View style={{ height: heroH }}>
      <Image source={placePhotos[place.slug]} contentFit="cover" transition={300} style={[StyleSheet.absoluteFill, { height: heroH }]} />
      <LinearGradient pointerEvents="none" colors={['rgba(10,20,40,0.35)', 'rgba(10,20,40,0)', clear, dark ? 'rgba(0,0,0,0.92)' : 'rgba(246,245,241,0.92)', bg]} locations={[0, 0.22, 0.46, 0.74, 0.92]} style={StyleSheet.absoluteFill} />

      <View style={[styles.top, { top: insets.top + 8 }]}>
        <Txt variant="title1" weight="900" style={{ fontSize: 32, letterSpacing: -1 }}>
          kosovo<Txt variant="title1" weight="900" tone="blue" style={{ fontSize: 32 }}>.</Txt>
        </Txt>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <GlassIconButton name="bell.fill" label={t({ sq: 'Njoftimet', en: 'Notifications' })} />
          <GlassIconButton name="person.fill" label={t({ sq: 'Pasaporta jote', en: 'Your passport' })} onPress={() => router.navigate('/passport')} />
        </View>
      </View>

      <View style={[styles.chips, { top: insets.top + 64 }]}>
        <Glass style={styles.chip}>
          <Icon name="location.fill" size={13} />
          <Txt variant="footnote" weight="700">
            {muni ? (lang === 'sq' ? muni.name_sq : muni.name_en) : t({ sq: 'Kosova', en: 'Kosovo' })}
          </Txt>
        </Glass>
        {weather ? (
          <Glass style={styles.chip}>
            <Icon name={weather.symbol} size={13} />
            <Txt variant="footnote" weight="700" style={{ fontVariant: ['tabular-nums'] }}>
              {Math.round(weather.tempC)}° · {lang === 'sq' ? weather.sq : weather.en}
            </Txt>
          </Glass>
        ) : null}
      </View>

      <Animated.View entering={FadeInDown.duration(350)} style={styles.bottom}>
        <Txt variant="headline" weight="600" tone="label2">
          {t({ sq: 'Vendi i ditës', en: 'Place of the day' })}
        </Txt>
        <Txt variant="largeTitle" weight="900" align="center" numberOfLines={2} adjustsFontSizeToFit style={{ fontSize: 46, lineHeight: 50, letterSpacing: -1.2, marginTop: 2 }}>
          {name}
        </Txt>
        <Txt variant="callout" weight="600" tone="label2" style={{ marginTop: 4 }}>
          {muni ? (lang === 'sq' ? muni.name_sq : muni.name_en) : ''}
        </Txt>
        <View style={styles.buttons}>
          <Press
            onPress={() => Haptics.selectionAsync()}
            accessibilityLabel={t({ sq: 'Shiko vendin', en: 'View place' })}
            style={[styles.primary, { backgroundColor: dark ? '#FFFFFF' : '#0B0D12' }]}
          >
            <Txt variant="headline" weight="800" style={{ color: dark ? '#0B0D12' : '#FFFFFF' }}>
              {t({ sq: 'Shiko vendin', en: 'View place' })}
            </Txt>
          </Press>
          <GlassIconButton name="camera.fill" label={t({ sq: 'Hape me një foto', en: 'Unlock with a photo' })} size={58} />
        </View>
        {weather ? (
          <Txt variant="caption" tone="label3" style={{ marginTop: 14 }}>
            {WEATHER_CREDIT}
          </Txt>
        ) : null}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  top: { position: 'absolute', left: 20, right: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  chips: { position: 'absolute', left: 20, flexDirection: 'row', gap: 8 },
  chip: { height: 30, paddingHorizontal: 11, borderRadius: 15, flexDirection: 'row', alignItems: 'center', gap: 5, overflow: 'hidden' },
  bottom: { position: 'absolute', left: 20, right: 20, bottom: 26, alignItems: 'center' },
  buttons: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 20 },
  primary: { height: 58, paddingHorizontal: 34, borderRadius: 29, alignItems: 'center', justifyContent: 'center' },
});
