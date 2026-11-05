import { Image } from 'expo-image';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useT } from '@/lib/i18n';
import { useColors } from '@/theme/tokens';

import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { ProgressDots } from '@/components/ProgressDots';
import { Txt } from '@/components/Txt';

// Nearby places data - in reality this would come from location services
const NEARBY_PLACES = [
  {
    id: '1',
    name: { sq: 'Kalaja e Prizrenit', en: 'Prizren Castle' },
    distance: '1.2 km',
    image: require('../../../assets/images/kalaja-e-novo-berdes.jpg'),
    unlocked: false,
  },
  {
    id: '2',
    name: { sq: 'Ujëvarat e Mirushës', en: 'Mirusha Waterfalls' },
    distance: '3.5 km',
    image: require('../../../assets/images/ujevarat-e-mirushes.jpg'),
    unlocked: false,
  },
  {
    id: '3',
    name: { sq: 'Gjeravica', en: 'Gjeravica' },
    distance: '12.8 km',
    image: require('../../../assets/images/gjeravica.jpg'),
    unlocked: false,
  },
];

export default function FirstKm() {
  const router = useRouter();
  const c = useColors();
  const t = useT();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { backgroundColor: c.bg }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24, paddingHorizontal: 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.progress}>
          <ProgressDots step={7} total={7} />
        </View>

        <View style={styles.header}>
          <Txt variant="title1" tone="label" weight="800" style={styles.title}>
            {t({ sq: 'Kilometri i parë', en: 'First kilometre' })}
          </Txt>
          <Txt variant="body" tone="label2" style={styles.subtitle}>
            {t({
              sq: 'Hap vendin më të afërt dhe filloj udhëtimin. Pasaporta juaj pret.',
              en: 'Unlock the nearest place and start your journey. Your passport awaits.',
            })}
          </Txt>
        </View>

        <View style={styles.placesList}>
          {NEARBY_PLACES.map((place, index) => (
            <View key={place.id} style={styles.placeCard}>
              <Image
                source={place.image}
                style={styles.placeImage}
                contentFit="cover"
              />
              <View style={styles.placeOverlay}>
                <View style={styles.placeInfo}>
                  <Txt variant="headline" tone="onTint" weight="700">
                    {t(place.name)}
                  </Txt>
                  <View style={styles.distanceRow}>
                    <Icon name="location.fill" size={14} tone="iceInk" />
                    <Txt variant="subheadline" tone="iceInk" weight="500">
                      {place.distance}
                    </Txt>
                  </View>
                </View>
                <View style={styles.unlockButton}>
                  <Icon name="lock.fill" size={20} tone="iceInk" />
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.howItWorks}>
          <Txt variant="title3" tone="label" weight="700" style={styles.sectionTitle}>
            {t({ sq: 'Si funksionon', en: 'How it works' })}
          </Txt>
          <View style={styles.steps}>
            {[
              { sq: 'Shko afër një vendi', en: 'Go near a place' },
              { sq: 'Hap pasaportën dhe foto', en: 'Open passport and snap' },
              { sq: 'Marrë stamëp e artë', en: 'Earn the gold stamp' },
            ].map((step, index) => (
              <View key={index} style={styles.step}>
                <View style={styles.stepNumber}>
                  <Txt variant="title3" tone="onTint" weight="800">
                    {index + 1}
                  </Txt>
                </View>
                <Txt variant="body" tone="label" style={styles.stepText}>
                  {t(step)}
                </Txt>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            label={t({ sq: 'Më çoj te harta', en: 'Take me to the map' })}
            icon="map.fill"
            onPress={() => router.push('/home')}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: {
    paddingTop: 12,
    paddingBottom: 24,
  },
  progress: {
    marginHorizontal: 8,
    marginBottom: 24,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    lineHeight: 22,
  },
  placesList: {
    gap: 12,
    marginBottom: 24,
  },
  placeCard: {
    borderRadius: 20,
    overflow: 'hidden',
    height: 160,
  },
  placeImage: {
    ...StyleSheet.absoluteFillObject,
  },
  placeOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 16,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  placeInfo: {
    gap: 8,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  unlockButton: {
    alignSelf: 'flex-end',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  howItWorks: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  steps: {
    flexDirection: 'row',
    gap: 12,
  },
  step: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0B0B0F',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepText: {
    lineHeight: 22,
    marginTop: 2,
  },
  footer: {
    paddingTop: 12,
  },
});