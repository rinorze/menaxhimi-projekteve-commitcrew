import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';

import { getMunicipality, type Place } from '@/data';
import { placePhotos } from '@/data/photos';
import { useLang, useT } from '@/lib/i18n';
import { useColors } from '@/theme/tokens';
import { Icon } from '../Icon';
import { Press } from '../Press';
import { Txt } from '../Txt';

/** The next places to stamp, swipe sideways. With the user location (later) they are the closest ones; for now today's pick first. */
export function UpNext({ items }: { items: Place[] }) {
  const t = useT();
  const lang = useLang();
  const c = useColors();
  const { width } = useWindowDimensions();
  const [page, setPage] = useState(0);
  const cardW = width - 44;
  return (
    <View>
      <View style={styles.head}>
        <Txt variant="title3" weight="800">
          {t({ sq: 'Në vijim', en: 'Up next' })}
        </Txt>
        <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
          {items.map((_, i) => (
            <View key={i} style={{ width: i === page ? 16 : 6, height: 6, borderRadius: 3, backgroundColor: i === page ? c.label : c.label3 }} />
          ))}
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={cardW + 12}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: 16, gap: 12, paddingBottom: 14 }}
        onMomentumScrollEnd={(e) => setPage(Math.round(e.nativeEvent.contentOffset.x / (cardW + 12)))}
      >
        {items.map((p, i) => {
          const city = getMunicipality(p.municipality);
          return (
            <Press key={p.slug} onPress={() => router.navigate('/map')} accessibilityLabel={lang === 'sq' ? p.name_sq : p.name_en} style={[styles.card, { width: cardW, backgroundColor: c.card }]}>
              <Image source={placePhotos[p.slug]} style={styles.photo} contentFit="cover" transition={200} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Txt variant="caption" tone="blue" weight="800" style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {i === 0 ? t({ sq: 'Vula jote e radhës', en: 'Your next stamp' }) : t({ sq: 'Pastaj', en: 'Then' })}
                </Txt>
                <Txt variant="headline" weight="800" numberOfLines={2}>
                  {lang === 'sq' ? p.name_sq : p.name_en}
                </Txt>
                <Txt variant="footnote" tone="label2" numberOfLines={1}>
                  {city ? (lang === 'sq' ? city.name_sq : city.name_en) : ''}
                </Txt>
              </View>
              <View style={[styles.go, { backgroundColor: c.tint }]}>
                <Icon name="arrow.right" size={16} tone="onTint" weight="bold" />
              </View>
            </Press>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 10 },
  card: { height: 104, borderRadius: 24, flexDirection: 'row', alignItems: 'center', gap: 12, paddingLeft: 8, paddingRight: 10 },
  photo: { width: 88, height: 88, borderRadius: 18, backgroundColor: '#E3E7EE' },
  go: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});
