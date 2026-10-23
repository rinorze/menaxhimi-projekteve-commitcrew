import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';

import { places, stamps } from '@/data';
import { useT } from '@/lib/i18n';
import { motion, useIsDark } from '@/theme/tokens';
import { Press } from '../Press';
import { Txt } from '../Txt';

const TILES = [
  { key: 'summits', emoji: '🏔️', sq: 'Maja', en: 'Summits', category: 'peak', tint: ['#E4EEFF', '#FFFFFF'] },
  { key: 'waterfalls', emoji: '💧', sq: 'Ujëvara', en: 'Waterfalls', category: 'waterfall', tint: ['#DDF6FF', '#FFFFFF'] },
  { key: 'fortresses', emoji: '🏰', sq: 'Kështjella', en: 'Fortresses', category: 'fortress', tint: ['#F3EBDD', '#FFFFFF'] },
  { key: 'caves', emoji: '🦇', sq: 'Shpella', en: 'Caves', category: 'cave', tint: ['#ECE6F7', '#FFFFFF'] },
  { key: 'lakes', emoji: '🏞️', sq: 'Liqene', en: 'Lakes', category: 'lake', tint: ['#E2F5EA', '#FFFFFF'] },
  { key: 'kulla', emoji: '🏡', sq: 'Kulla', en: 'Kulla', category: 'kulla', tint: ['#FBEBDF', '#FFFFFF'] },
] as const;

function Tile({ tile }: { tile: (typeof TILES)[number] }) {
  const t = useT();
  const dark = useIsDark();
  const list = places.filter((p) => p.category === tile.category);
  const got = list.filter((p) => stamps[p.slug]).length;
  const act = useSharedValue(0);
  // each icon acts out its category: summits and waterfalls hop, the rest wiggle
  const style = useAnimatedStyle(() =>
    tile.key === 'summits' || tile.key === 'waterfalls' ? { transform: [{ translateY: -10 * act.value }, { scale: 1 + 0.08 * act.value }] } : { transform: [{ rotate: `${12 * act.value}deg` }] },
  );
  return (
    <Press
      scaleTo={0.92}
      accessibilityLabel={`${t({ sq: tile.sq, en: tile.en })}, ${got} / ${list.length}`}
      onPress={() => {
        act.value = withSequence(withTiming(1, { duration: 120 }), withTiming(-0.6, { duration: 140 }), withSpring(0, motion.snappy));
        router.navigate('/map');
      }}
    >
      <LinearGradient colors={dark ? ['#2C2C30', '#1C1C1E'] : [tile.tint[0], tile.tint[1]]} style={styles.tile}>
        <Animated.Text style={[styles.emoji, style]}>{tile.emoji}</Animated.Text>
        <Txt variant="subheadline" weight="800">
          {t({ sq: tile.sq, en: tile.en })}
        </Txt>
        <Txt variant="caption" tone="label2">
          {got ? `${got} / ${list.length}` : t({ sq: `${list.length} vende`, en: `${list.length} places` })}
        </Txt>
      </LinearGradient>
    </Press>
  );
}

export function Collect() {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12, paddingTop: 2, paddingBottom: 6 }}>
      {TILES.map((x) => (
        <Tile key={x.key} tile={x} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tile: { width: 108, height: 132, borderRadius: 24, alignItems: 'center', justifyContent: 'center', gap: 4 },
  emoji: { fontSize: 46, marginBottom: 2 },
});
