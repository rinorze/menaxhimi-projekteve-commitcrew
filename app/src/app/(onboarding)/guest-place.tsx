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
import { Href, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// VERIFIKO: rruga e fotos reale të Kalasë së Novobërdës në assets.
const NOVOBERDE_IMAGE: ImageSourcePropType = require('../../../assets/images/kalaja-e-novo-berdes.jpg');

const IMAGE_RATIO = 0.47; // foto zë ~47% të ekranit
const OVERLAP = 0.01; // paneli fillon ~46%

export default function GuestPlace() {
  const router = useRouter();
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
    router.push('/save-passport' as Href);
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <Image
        source={NOVOBERDE_IMAGE}
        resizeMode="cover"
        style={[styles.image, { height: imageHeight }]}
      />

      <Pressable
        onPress={goBack}
        accessibilityRole="button"
        accessibilityLabel="Kthehu"
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
              minHeight: height - spacerHeight,
              paddingBottom: 40 + insets.bottom,
            },
          ]}
        >
          <Text style={styles.label}>NOVOBËRDË · KALA</Text>
          <Text style={styles.title}>Kalaja e Novobërdës</Text>
          <Text style={styles.description}>
            Qytet minierash mesjetar dhe kala mbi një kodër vullkanike në lindje të Kosovës.
          </Text>
          <Text style={styles.source}>Nga Wikipedia · foto nga Wikimedia Commons</Text>

          <View style={styles.stampCard}>
            <View style={styles.badge}>
              <Ionicons name="shield" size={22} color="#9A9A9A" />
            </View>
            <View style={styles.stampTextWrap}>
              <Text style={styles.stampTitle}>Këtu të pret një vulë</Text>
              <Text style={styles.stampText}>
                Shiko atje, bëj foton në aplikacion dhe vula hyn në pasaportën tënde.
              </Text>
            </View>
          </View>

          <Pressable
            onPress={onSaveToPassport}
            accessibilityRole="button"
            style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
          >
            <Text style={styles.primaryText}>Ruaje Novobërdën në pasaportë</Text>
          </Pressable>

          <Pressable
            onPress={goBack}
            accessibilityRole="button"
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
          >
            <Text style={styles.secondaryText}>Vazhdo të shikosh</Text>
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