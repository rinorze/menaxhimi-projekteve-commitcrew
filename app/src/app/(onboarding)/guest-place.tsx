// import { ScreenPlaceholder } from '@/components/screen-placeholder';

// // 1.3 · Artiola · The place the guest tapped; “Ruaje …” names it on the next screen.
// export default function GuestPlace() {
//   return (
//     <ScreenPlaceholder
//       step="1.3"
//       title="Kalaja e Novobërdës"
//       owner="Artiola"
//       design="01-onboarding/03-guest-place.png"
//       next="/save-passport"
//       nextLabel="Ruaje Novobërdën në pasaportë"
//       also={[{ href: '/look-around', label: 'Vazhdo të shikosh' }]}
//     />
//   );
// }
import React from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useT, type Text as I18nText } from '@/lib/i18n';
import { useColors } from '@/theme/tokens';

const PLACES: Record<
  string,
  { image: ImageSourcePropType; label: I18nText; name: I18nText; short: I18nText; text: I18nText }
> = {
  kalaja: {
    image: require('../../../assets/images/kalaja-e-novo-berdes.jpg'),
    label: { sq: 'NOVOBËRDË · KALA', en: 'NOVOBËRDË · FORTRESS' },
    name: { sq: 'Kalaja e Novobërdës', en: 'Novo Brdo Fortress' },
    short: { sq: 'Novobërdën', en: 'Novo Brdo' },
    text: {
      sq: 'Qytet minierash mesjetar dhe kala mbi një kodër vullkanike në lindje të Kosovës.',
      en: 'A medieval mining town and fortress on a volcanic hill in eastern Kosovo.',
    },
  },
  ujevarat: {
    image: require('../../../assets/images/ujevarat-e-mirushes.jpg'),
    label: { sq: 'MALISHEVË · UJËVARË', en: 'MALISHEVË · WATERFALL' },
    name: { sq: 'Ujëvarat e Mirushës', en: 'Mirusha Waterfalls' },
    short: { sq: 'Mirushën', en: 'Mirusha' },
    text: {
      sq: 'Një varg ujëvarash dhe pellgjesh në kanionin e lumit Mirusha, pranë Malishevës.',
      en: 'A chain of waterfalls and pools in the Mirusha river canyon, near Malishevë.',
    },
  },
  gjeravica: {
    image: require('../../../assets/images/gjeravica.jpg'),
    label: { sq: 'DEÇAN · MAL', en: 'DEÇAN · MOUNTAIN' },
    name: { sq: 'Gjeravica', en: 'Gjeravica' },
    short: { sq: 'Gjeravicën', en: 'Gjeravica' },
    text: {
      sq: 'Maja më e lartë e Kosovës, 2.656 m, në Bjeshkët e Nemuna.',
      en: "Kosovo's highest peak, 2,656 m, in the Accursed Mountains.",
    },
  },
};

const IMAGE_RATIO = 0.47; // foto zë ~47% të ekranit
const OVERLAP = 0.01; // paneli fillon ~46%

export default function GuestPlace() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const place = PLACES[id ?? 'kalaja'] ?? PLACES.kalaja;
  const c = useColors();
  const t = useT();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  const imageHeight = height * IMAGE_RATIO;
  const spacerHeight = height * (IMAGE_RATIO - OVERLAP);

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  // Navigon te rruga ekzistuese /save-passport.
  // VERIFIKO: nëse /save-passport pret parametra (p.sh. id e vendit),
  // shtoji këtu, p.ex. router.push({ pathname: '/save-passport', params: { place: 'novoberde' } })
  const onSaveToPassport = () => {
    router.push({ pathname: '/language', params: { place: id ?? 'kalaja' } } as Href);
  };

  return (
    <View style={[styles.root, { backgroundColor: c.bg }]}>
      <StatusBar style="light" />

      <Image
        source={place.image}
        resizeMode="cover"
        style={[styles.image, { height: imageHeight }]}
      />

      <Pressable
        onPress={goBack}
        accessibilityRole="button"
        accessibilityLabel={t({ sq: 'Kthehu', en: 'Back' })}
        style={[styles.backButton, { top: insets.top + 10 }]}
      >
        <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
      </Pressable>

      <ScrollView
        style={StyleSheet.absoluteFill}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={{ height: spacerHeight }} />

        <View
          style={[
            styles.panel,
            {
              backgroundColor: c.bg,
              minHeight: height - spacerHeight,
              paddingBottom: 40 + insets.bottom,
            },
          ]}
        >
          <Text style={[styles.label, { color: c.label2 }]}>{t(place.label)}</Text>
          <Text style={[styles.title, { color: c.label }]}>{t(place.name)}</Text>
          <Text style={[styles.description, { color: c.label }]}>{t(place.text)}</Text>
          <Text style={[styles.source, { color: c.label2 }]}>
            {t({ sq: 'Nga Wikipedia · foto nga Wikimedia Commons', en: 'From Wikipedia · photo from Wikimedia Commons' })}
          </Text>

          <View style={[styles.stampCard, { backgroundColor: c.fill }]}>
            <View style={[styles.badge, { borderColor: c.label3 }]}>
              <Ionicons name="shield" size={22} color={c.label3} />
            </View>
            <View style={styles.stampTextWrap}>
              <Text style={[styles.stampTitle, { color: c.label }]}>{t({ sq: 'Këtu të pret një vulë', en: 'A stamp is waiting here' })}</Text>
              <Text style={[styles.stampText, { color: c.label2 }]}>
                {t({
                  sq: 'Shko atje, bëj foton në aplikacion dhe vula hyn në pasaportën tënde.',
                  en: 'Go there, take the photo in the app and the stamp goes into your passport.',
                })}
              </Text>
            </View>
          </View>

          <Pressable
            onPress={onSaveToPassport}
            accessibilityRole="button"
            style={({ pressed }) => [styles.primaryButton, { backgroundColor: c.tint }, pressed && styles.pressed]}
          >
            <Text style={[styles.primaryText, { color: c.onTint }]}>
              {t({ sq: `Ruaje ${t(place.short)} në pasaportë`, en: `Save ${t(place.short)} to your passport` })}
            </Text>
          </Pressable>

          <Pressable
            onPress={goBack}
            accessibilityRole="button"
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
          >
            <Text style={[styles.secondaryText, { color: c.label2 }]}>{t({ sq: 'Vazhdo të shikosh', en: 'Keep looking' })}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  image: { position: 'absolute', top: 0, left: 0, right: 0, width: '100%' },
  backButton: {
    position: 'absolute',
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(40,40,40,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  scrollContent: { flexGrow: 1 },
  panel: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 22,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: '#8E8E93',
    textTransform: 'uppercase',
  },
  title: {
    marginTop: 6,
    fontSize: 29,
    lineHeight: 34,
    fontWeight: '800',
    color: '#000000',
  },
  description: { marginTop: 10, fontSize: 17, lineHeight: 24, color: '#000000' },
  source: { marginTop: 8, fontSize: 12, color: '#A0A0A5' },
  stampCard: {
    marginTop: 24,
    backgroundColor: '#F3F3F3',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#BDBDBD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  stampTextWrap: { flex: 1 },
  stampTitle: { fontSize: 16, fontWeight: '700', color: '#000000' },
  stampText: { marginTop: 2, fontSize: 15, lineHeight: 20, color: '#8E8E93' },
  primaryButton: {
    marginTop: 28,
    height: 54,
    borderRadius: 28,
    backgroundColor: '#0B0B0F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  secondaryButton: { marginTop: 18, alignItems: 'center', paddingVertical: 8 },
  secondaryText: { fontSize: 15, fontWeight: '600', color: '#8E8E93' },
  pressed: { opacity: 0.8 },
});