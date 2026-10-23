import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { places, stamps, type Place } from '@/data';
import { useLang, useT } from '@/lib/i18n';
import { Press } from '../Press';
import { Txt } from '../Txt';

/** "Surprise me": picks one real place you have not stamped yet. It will open the place page once that screen exists. */
export function SurpriseCard() {
  const t = useT();
  const lang = useLang();
  const [pick, setPick] = useState<Place>();
  const spin = useSharedValue(0);
  const dice = useAnimatedStyle(() => ({ transform: [{ rotate: `${spin.value}deg` }, { scale: 1 + Math.sin((spin.value / 360) * Math.PI) * 0.15 }] }));
  const roll = () => {
    const pool = places.filter((p) => !stamps[p.slug] && !p.sensitive);
    setPick(pool[Math.floor(Math.random() * pool.length)]);
    spin.value = 0;
    spin.value = withTiming(360, { duration: 520 });
  };
  return (
    <Press onPress={roll} accessibilityLabel={t({ sq: 'Më befaso', en: 'Surprise me' })} style={styles.card}>
      <Animated.Text style={[styles.dice, dice]}>🎲</Animated.Text>
      <Txt variant="caption" weight="800" style={{ color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {t({ sq: 'S’po vendos dot?', en: 'Can’t decide?' })}
      </Txt>
      <Txt variant="title1" weight="800" style={{ color: '#FFFFFF', marginTop: 4 }}>
        {t({ sq: 'Më befaso', en: 'Surprise me' })}
      </Txt>
      <View style={{ maxWidth: 220, marginTop: 4 }}>
        <Txt variant="subheadline" style={{ color: 'rgba(255,255,255,0.8)' }}>
          {pick ? (lang === 'sq' ? pick.name_sq : pick.name_en) : t({ sq: 'Një vend i vërtetë në Kosovë që s’e ke hapur ende.', en: 'One real place in Kosovo you haven’t stamped yet.' })}
        </Txt>
      </View>
    </Press>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: 16, borderRadius: 28, backgroundColor: '#14161C', padding: 20, minHeight: 150, overflow: 'hidden' },
  dice: { position: 'absolute', right: 14, bottom: 8, fontSize: 92 },
});
