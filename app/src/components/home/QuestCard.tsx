import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { places, quests, stamps } from '@/data';
import { useLang, useT } from '@/lib/i18n';
import { Icon } from '../Icon';
import { Press } from '../Press';
import { Txt } from '../Txt';

/** The quest of the week: the first category quest, with a dot for each place to stamp. */
export function QuestCard() {
  const t = useT();
  const lang = useLang();
  const quest = quests.find((q) => q.kind === 'category') ?? quests[0];
  const done = places.filter((p) => p.category === quest.criteria.category && stamps[p.slug]).length;
  const progress = Math.min(done, quest.target);
  return (
    <Press accessibilityLabel={`${lang === 'sq' ? quest.title_sq : quest.title_en}, ${progress} / ${quest.target}`}>
      <LinearGradient colors={['#0E7C86', '#12A39A']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
        <View style={styles.ghost}>
          <Icon name="safari.fill" size={110} tone="onTint" />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Txt variant="caption" weight="800" style={{ color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {t({ sq: 'Sfida e javës', en: 'Quest of the week' })}
          </Txt>
          <View style={styles.badge}>
            <Txt variant="caption" weight="900" style={{ color: '#3D2A00' }}>
              {t({ sq: 'Stemë', en: 'Badge' })}
            </Txt>
          </View>
        </View>
        <Txt variant="title2" weight="800" numberOfLines={1} style={{ color: '#FFFFFF', marginTop: 4 }}>
          {lang === 'sq' ? quest.title_sq : quest.title_en}
        </Txt>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14 }}>
          {Array.from({ length: Math.min(quest.target, 5) }, (_, i) => (
            <View key={i} style={[styles.dot, i < progress && { backgroundColor: '#FFFFFF', borderWidth: 0 }]}>
              {i < progress ? <Icon name="checkmark" size={13} weight="bold" /> : null}
            </View>
          ))}
          <Txt variant="subheadline" weight="800" style={{ color: '#FFFFFF', marginLeft: 4 }}>
            {progress} / {quest.target}
          </Txt>
        </View>
      </LinearGradient>
    </Press>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: 16, borderRadius: 28, padding: 18, overflow: 'hidden' },
  ghost: { position: 'absolute', right: -14, bottom: -24, opacity: 0.18 },
  dot: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.65)', alignItems: 'center', justifyContent: 'center' },
  badge: { height: 28, paddingHorizontal: 10, borderRadius: 14, backgroundColor: '#F4B62A', justifyContent: 'center' },
});
