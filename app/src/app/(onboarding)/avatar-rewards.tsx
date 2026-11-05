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

// Reward items that can be earned
const REWARD_ITEMS = [
  {
    id: 'plis',
    name: { sq: 'Plis', en: 'Plis (traditional hat)' },
    description: { sq: 'Fitohet pas 5 vende të hapura', en: 'Earned after 5 unlocked places' },
    icon: 'hat.widebrim',
    locked: true,
  },
  {
    id: 'qeleshe',
    name: { sq: 'Qeleshe', en: 'Qeleshe (wool cap)' },
    description: { sq: 'Fitohet pas 10 vende të hapura', en: 'Earned after 10 unlocked places' },
    icon: 'hat.cap',
    locked: true,
  },
  {
    id: 'xhubleta',
    name: { sq: 'Xhubleta', en: 'Xhubleta (traditional dress)' },
    description: { sq: 'Fitohet pas 20 vende të hapura', en: 'Earned after 20 unlocked places' },
    icon: 'figure.dress.line.vertical',
    locked: true,
  },
  {
    id: 'opinga',
    name: { sq: 'Opinga', en: 'Opinga (traditional shoes)' },
    description: { sq: 'Fitohet pas 30 vende të hapura', en: 'Earned after 30 unlocked places' },
    icon: 'shoeprints.fill',
    locked: true,
  },
  {
    id: 'çorape',
    name: { sq: 'Çorape të bardha', en: 'White socks' },
    description: { sq: 'Fitohet pas 15 vende të hapura', en: 'Earned after 15 unlocked places' },
    icon: 'sock.fill',
    locked: true,
  },
  {
    id: 'jeleku',
    name: { sq: 'Jelek', en: 'Jelek (vest)' },
    description: { sq: 'Fitohet pas 25 vende të hapura', en: 'Earned after 25 unlocked places' },
    icon: 'figure.arms.open',
    locked: true,
  },
];

export default function AvatarRewards() {
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
          <ProgressDots step={5} total={7} />
        </View>

        <View style={styles.header}>
          <Txt variant="title1" tone="label" weight="800" style={styles.title}>
            {t({ sq: 'Sende që i fiton', en: 'Items you earn' })}
          </Txt>
          <Txt variant="body" tone="label2" style={styles.subtitle}>
            {t({
              sq: 'Lësho sendat e veçanta duke hapur vende. Çdo vend e ri na rrit Progress Bar-in.',
              en: 'Unlock special items by discovering places. Each new place grows your Progress Bar.',
            })}
          </Txt>
        </View>

        <View style={styles.list}>
          {REWARD_ITEMS.map(item => (
            <View key={item.id} style={styles.item}>
              <View style={styles.itemIconContainer}>
                <View style={styles.itemIconBg}>
                  <Icon name={item.icon} size={28} tone={item.locked ? 'label3' : 'gold'} />
                </View>
                {item.locked && (
                  <View style={styles.lockBadge}>
                    <Icon name="lock.fill" size={12} tone="onTint" />
                  </View>
                )}
              </View>
              <View style={styles.itemInfo}>
                <Txt variant="headline" tone="label" weight="600">
                  {t(item.name)}
                </Txt>
                <Txt variant="subheadline" tone="label2">
                  {t(item.description)}
                </Txt>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Button
            variant="secondary"
            label={t({ sq: 'Kthehu te avatari', en: 'Back to avatar' })}
            icon="chevron.left"
            onPress={() => router.back()}
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
  list: {
    gap: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    backgroundColor: '#F2F2F7',
    borderRadius: 16,
    position: 'relative',
  },
  itemIconContainer: {
    position: 'relative',
    width: 56,
    height: 56,
  },
  itemIconBg: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  lockBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#0B0B0F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInfo: {
    flex: 1,
    gap: 4,
  },
  footer: {
    paddingTop: 12,
  },
});