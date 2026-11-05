import { useState } from 'react';
import { Image } from 'expo-image';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useT } from '@/lib/i18n';
import { useColors } from '@/theme/tokens';

import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { Icon } from '@/components/Icon';
import { ProgressDots } from '@/components/ProgressDots';
import { Txt } from '@/components/Txt';

// Avatar parts data structure matching the design tabs
interface AvatarOption {
  id: string;
  src: any; // require() returns any
}

type TabType = 'Fytyra' | 'Flokët' | 'Sytë' | 'Kapela' | 'Mjekra' | 'Rrobat';

const AVATAR_PARTS: Record<TabType, AvatarOption[]> = {
  Fytyra: [
    { id: 'face-1', src: require('../../../assets/images/avatars/av-me.svg') },
    { id: 'face-2', src: require('../../../assets/images/avatars/av-me2.svg') },
    { id: 'face-3', src: require('../../../assets/images/avatars/av-me3.svg') },
    { id: 'face-4', src: require('../../../assets/images/avatars/av-arta.svg') },
    { id: 'face-5', src: require('../../../assets/images/avatars/av-blend.svg') },
    { id: 'face-6', src: require('../../../assets/images/avatars/av-dren.svg') },
    { id: 'face-7', src: require('../../../assets/images/avatars/av-elira.svg') },
    { id: 'face-8', src: require('../../../assets/images/avatars/av-liridon.svg') },
    { id: 'face-9', src: require('../../../assets/images/avatars/av-vesa.svg') },
    { id: 'face-10', src: require('../../../assets/images/avatars/av-me-plis.svg') },
  ],
  Flokët: [
    { id: 'hair-1', src: require('../../../assets/images/avatars/av-me.svg') },
    { id: 'hair-2', src: require('../../../assets/images/avatars/av-me2.svg') },
    { id: 'hair-3', src: require('../../../assets/images/avatars/av-me3.svg') },
    { id: 'hair-4', src: require('../../../assets/images/avatars/av-arta.svg') },
    { id: 'hair-5', src: require('../../../assets/images/avatars/av-blend.svg') },
    { id: 'hair-6', src: require('../../../assets/images/avatars/av-dren.svg') },
    { id: 'hair-7', src: require('../../../assets/images/avatars/av-elira.svg') },
    { id: 'hair-8', src: require('../../../assets/images/avatars/av-liridon.svg') },
    { id: 'hair-9', src: require('../../../assets/images/avatars/av-vesa.svg') },
    { id: 'hair-10', src: require('../../../assets/images/avatars/av-me-plis.svg') },
  ],
  Sytë: [
    { id: 'eyes-1', src: require('../../../assets/images/avatars/av-me.svg') },
    { id: 'eyes-2', src: require('../../../assets/images/avatars/av-me2.svg') },
    { id: 'eyes-3', src: require('../../../assets/images/avatars/av-me3.svg') },
    { id: 'eyes-4', src: require('../../../assets/images/avatars/av-arta.svg') },
    { id: 'eyes-5', src: require('../../../assets/images/avatars/av-blend.svg') },
    { id: 'eyes-6', src: require('../../../assets/images/avatars/av-dren.svg') },
    { id: 'eyes-7', src: require('../../../assets/images/avatars/av-elira.svg') },
    { id: 'eyes-8', src: require('../../../assets/images/avatars/av-liridon.svg') },
    { id: 'eyes-9', src: require('../../../assets/images/avatars/av-vesa.svg') },
    { id: 'eyes-10', src: require('../../../assets/images/avatars/av-me-plis.svg') },
  ],
  Kapela: [
    { id: 'hat-1', src: require('../../../assets/images/avatars/av-me.svg') },
    { id: 'hat-2', src: require('../../../assets/images/avatars/av-me2.svg') },
    { id: 'hat-3', src: require('../../../assets/images/avatars/av-me3.svg') },
    { id: 'hat-4', src: require('../../../assets/images/avatars/av-arta.svg') },
    { id: 'hat-5', src: require('../../../assets/images/avatars/av-blend.svg') },
    { id: 'hat-6', src: require('../../../assets/images/avatars/av-dren.svg') },
    { id: 'hat-7', src: require('../../../assets/images/avatars/av-elira.svg') },
    { id: 'hat-8', src: require('../../../assets/images/avatars/av-liridon.svg') },
    { id: 'hat-9', src: require('../../../assets/images/avatars/av-vesa.svg') },
    { id: 'hat-10', src: require('../../../assets/images/avatars/av-me-plis.svg') },
  ],
  Mjekra: [
    { id: 'glasses-1', src: require('../../../assets/images/avatars/av-me.svg') },
    { id: 'glasses-2', src: require('../../../assets/images/avatars/av-me2.svg') },
    { id: 'glasses-3', src: require('../../../assets/images/avatars/av-me3.svg') },
    { id: 'glasses-4', src: require('../../../assets/images/avatars/av-arta.svg') },
    { id: 'glasses-5', src: require('../../../assets/images/avatars/av-blend.svg') },
    { id: 'glasses-6', src: require('../../../assets/images/avatars/av-dren.svg') },
    { id: 'glasses-7', src: require('../../../assets/images/avatars/av-elira.svg') },
    { id: 'glasses-8', src: require('../../../assets/images/avatars/av-liridon.svg') },
    { id: 'glasses-9', src: require('../../../assets/images/avatars/av-vesa.svg') },
    { id: 'glasses-10', src: require('../../../assets/images/avatars/av-me-plis.svg') },
  ],
  Rrobat: [
    { id: 'clothes-1', src: require('../../../assets/images/avatars/av-me.svg') },
    { id: 'clothes-2', src: require('../../../assets/images/avatars/av-me2.svg') },
    { id: 'clothes-3', src: require('../../../assets/images/avatars/av-me3.svg') },
    { id: 'clothes-4', src: require('../../../assets/images/avatars/av-arta.svg') },
    { id: 'clothes-5', src: require('../../../assets/images/avatars/av-blend.svg') },
    { id: 'clothes-6', src: require('../../../assets/images/avatars/av-dren.svg') },
    { id: 'clothes-7', src: require('../../../assets/images/avatars/av-elira.svg') },
    { id: 'clothes-8', src: require('../../../assets/images/avatars/av-liridon.svg') },
    { id: 'clothes-9', src: require('../../../assets/images/avatars/av-vesa.svg') },
    { id: 'clothes-10', src: require('../../../assets/images/avatars/av-me-plis.svg') },
  ],
};

const TABS: TabType[] = ['Fytyra', 'Flokët', 'Sytë', 'Kapela', 'Mjekra', 'Rrobat'];

export default function Avatar() {
  const router = useRouter();
  const c = useColors();
  const t = useT();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabType>('Fytyra');
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  // @ts-ignore - TypeScript doesn't narrow activeTab properly for Record indexing
  const currentOptions = AVATAR_PARTS[activeTab] as AvatarOption[];

  const handleOptionSelect = (optionId: string) => {
    setSelectedOptions((prev: Record<string, string>) => ({ ...prev, [activeTab]: optionId }));
  };

  const handleShuffle = () => {
    const shuffled: Record<string, string> = {};
    TABS.forEach((tab: TabType) => {
      const options = AVATAR_PARTS[tab] as AvatarOption[];
      const randomOption = options[Math.floor(Math.random() * options.length)];
      shuffled[tab] = randomOption.id;
    });
    setSelectedOptions(shuffled);
  };

  const isOptionSelected = (optionId: string) => selectedOptions[activeTab] === optionId;

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
          <ProgressDots step={4} total={7} />
        </View>

        <View style={styles.avatarContainer}>
          <View style={styles.avatarWrapper}>
            <Image
              source={require('../../../assets/images/avatars/av-me.svg')}
              style={styles.avatarImage}
              contentFit="contain"
            />
          </View>
        </View>

        <View style={styles.tabsContainer}>
          {TABS.map((tab: TabType) => (
            <View key={tab}>
              <Chip
                label={tab}
                selected={activeTab === tab}
                onPress={() => setActiveTab(tab)}
              />
            </View>
          ))}
        </View>

        <View style={styles.gridContainer}>
          {currentOptions.map((option: AvatarOption) => (
            <View key={option.id} style={styles.optionItem}>
              <Pressable
                onPress={() => handleOptionSelect(option.id)}
                style={({ pressed }: { pressed: boolean }) => [
                  styles.optionButton,
                  pressed && styles.optionPressed,
                  isOptionSelected(option.id) && styles.optionButtonSelected,
                ]}
              >
                <Image
                  source={option.src}
                  style={styles.optionImage}
                  contentFit="cover"
                />
                {isOptionSelected(option.id) && (
                  <View style={styles.checkOverlay}>
                    <Icon name="checkmark.circle.fill" size={24} tone="onTint" />
                  </View>
                )}
              </Pressable>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <View style={styles.actionWrapper}>
            <Button
              variant="secondary"
              label={t({ sq: 'Përziej', en: 'Shuffle' })}
              icon="shuffle"
              onPress={handleShuffle}
            />
          </View>
          <View style={styles.actionWrapper}>
            <Button
              variant="text"
              label={t({ sq: 'Sende që i fiton', en: 'Items you earn' })}
              onPress={() => router.push('/avatar-rewards')}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            label={t({ sq: 'Përdor këtë fytyrë', en: 'Use this face' })}
            onPress={() => router.push('/save-passport')}
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
    marginBottom: 16,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarWrapper: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 140,
    height: 140,
  },
  tabsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
    justifyContent: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    marginBottom: 24,
  },
  optionItem: {
    width: 84,
    height: 84,
  },
  optionButton: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionButtonSelected: {
    borderColor: '#0B0B0F',
  },
  optionPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  optionImage: {
    width: 72,
    height: 72,
    borderRadius: 12,
  },
  checkOverlay: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0B0B0F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    marginBottom: 24,
  },
  actionWrapper: {
    flex: 1,
    maxWidth: 150,
  },
  footer: {
    paddingTop: 12,
  },
});