// import { ScreenPlaceholder } from '@/components/screen-placeholder';

// // 1.1 · Artiola · “Shiko përreth fillimisht” is the biggest button in the design; the photo is Gjeravica.
// export default function Welcome() {
//   return (
//     <ScreenPlaceholder
//       step="1.1"
//       title="Mirë se vjen"
//       owner="Artiola"
//       design="01-onboarding/01-welcome.png"
//       next="/language"
//       nextLabel="Krijo pasaportën time"
//       also={[{ href: '/look-around', label: 'Shiko përreth fillimisht' }, { href: '/sign-in', label: 'Kam llogari' }]}
//     />
//   );
// }

// app/src/app/(onboarding)/welcome.tsx

import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const HERO = require('../../../assets/images/gjeravica.jpg');

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <Image source={HERO} style={StyleSheet.absoluteFill} contentFit="cover" contentPosition="top" />

      <LinearGradient
        colors={['rgba(0,0,0,0.25)', 'rgba(0,0,0,0)']}
        style={[styles.topFade, { height: insets.top + 140 }]}
        pointerEvents="none"
      />

      <LinearGradient
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.55)', 'rgba(0,0,0,0.92)', '#000']}
        locations={[0, 0.35, 0.7, 1]}
        style={styles.bottomFade}
        pointerEvents="none"
      />

      <View style={[styles.brand, { top: insets.top + 20 }]}>
        <View style={styles.logo}>
          <View style={styles.logoGlyph} />
        </View>
        <Text style={styles.brandText}>DISCOVER KOSOVO</Text>
      </View>

      <View style={[styles.content, { paddingBottom: Math.max(insets.bottom, 20) + 24 }]}>
        <Text style={styles.title}>{'Shiko.\nFotografo.\nHape.'}</Text>
        <Text style={styles.subtitle}>
          {'Të 38 komunat, nga Gjeravica në Partesh.\nNë 4 gjuhë.'}
        </Text>

        <Link href="/look-around" asChild>
          <Pressable style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
            <Text style={styles.primaryText}>Shiko përreth fillimisht</Text>
            <Text style={styles.primaryArrow}>→</Text>
          </Pressable>
        </Link>

        <Link href="/language" asChild>
          <Pressable style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
            <Text style={styles.secondaryText}>Krijo pasaportën time</Text>
          </Pressable>
        </Link>

        <Link href="/sign-in" asChild>
          <Pressable hitSlop={12} style={styles.loginLink}>
            <Text style={styles.loginText}>Kam llogari</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  topFade: { position: 'absolute', top: 0, left: 0, right: 0 },
  bottomFade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '58%' },

  brand: {
    position: 'absolute',
    left: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoGlyph: {
    width: 10,
    height: 14,
    borderRadius: 2,
    borderWidth: 2,
    borderColor: '#0b0f14',
  },
  brandText: { color: '#fff', fontSize: 14, fontWeight: '800', letterSpacing: 0.6 },

  content: { flex: 1, justifyContent: 'flex-end', paddingHorizontal: 24 },
  title: { color: '#fff', fontSize: 42, lineHeight: 46, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 16,
    lineHeight: 23,
    marginTop: 14,
    marginBottom: 22,
  },

  primaryButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  primaryText: { color: '#0b0f14', fontSize: 16, fontWeight: '700' },
  primaryArrow: { color: '#0b0f14', fontSize: 16, fontWeight: '700' },

  secondaryButton: {
    height: 50,
    borderRadius: 25,
    marginTop: 12,
    backgroundColor: 'rgba(20,26,34,0.85)',
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  loginLink: { alignSelf: 'center', marginTop: 24 },
  loginText: { color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: '500' },

  pressed: { opacity: 0.85, transform: [{ scale: 0.985 }] },
});