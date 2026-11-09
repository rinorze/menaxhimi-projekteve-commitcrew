import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';

import { Icon, Press, Screen, Txt } from '@/components';
import { getPrivatePhotos, type PrivatePhoto } from '@/lib/api';
import { useT } from '@/lib/i18n';
import { radius, useColors } from '@/theme/tokens';

export default function PrivatePhotos() {
  const c = useColors();
  const t = useT();
  const { width } = useWindowDimensions();
  const [photos, setPhotos] = useState<PrivatePhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    let active = true;
    getPrivatePhotos()
      .then((data) => {
        if (active) setPhotos(data);
      })
      .catch(() => {
        if (active) setLoadFailed(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const tileSize = (width - 40 - 16) / 3;

  return (
    <Screen scroll>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <Press
          onPress={() => router.back()}
          accessibilityLabel={t({ sq: 'Kthehu prapa', en: 'Go back' })}
          style={{ width: 48, height: 48, borderRadius: radius.pill, backgroundColor: c.surface, alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon name="chevron.left" size={22} />
        </Press>
        <Txt variant="title1">{t({ sq: 'Fotot private', en: 'Private photos' })}</Txt>
      </View>

      {loading ? (
        <Txt variant="subheadline" tone="label2" align="center">
          {t({ sq: 'Po ngarkohen fotot…', en: 'Loading photos…' })}
        </Txt>
      ) : null}
      {loadFailed ? (
        <Txt variant="footnote" tone="label2" style={{ marginBottom: 16 }}>
          {t({ sq: 'Shërbimi i fotove private nuk është lidhur ende.', en: 'The private photos service is not connected yet.' })}
        </Txt>
      ) : null}

      {photos.length > 0 ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {photos.map((photo) => (
            <Image
              key={photo.id}
              source={{ uri: photo.uri }}
              contentFit="cover"
              accessibilityLabel={t({ sq: 'Foto private', en: 'Private photo' })}
              style={{ width: tileSize, height: tileSize, borderRadius: radius.row, backgroundColor: c.surface }}
            />
          ))}
        </View>
      ) : !loading ? (
        <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 56, paddingHorizontal: 20 }}>
          <View style={{ width: 72, height: 72, borderRadius: radius.pill, backgroundColor: c.surface, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <Icon name="lock.fill" size={30} tone="label2" />
          </View>
          <Txt variant="title3" align="center" style={{ marginBottom: 8 }}>
            {t({ sq: 'Ende nuk ke foto private.', en: "You don't have any private photos yet." })}
          </Txt>
          <Txt variant="subheadline" tone="label2" align="center">
            {t({ sq: 'Vetëm ti mund t’i shohësh këto foto.', en: 'Only you can see these photos.' })}
          </Txt>
        </View>
      ) : null}
    </Screen>
  );
}
