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

// Mock friend code - in reality this would come from the user's profile
const FRIEND_CODE = 'ELIOS15';

export default function OneFriend() {
  const router = useRouter();
  const c = useColors();
  const t = useT();
  const insets = useSafeAreaInsets();

  const handleShareInvite = () => {
    // In a real app, this would open the native share sheet
    // For now, we'll just navigate to first-km
    router.push('/first-km');
  };

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
            {t({ sq: 'Mjafton një shok', en: 'One friend is enough' })}
          </Txt>
          <Txt variant="body" tone="label2" style={styles.subtitle}>
            {t({
              sq: 'Fto një shok dhe eksploroni bashkë. apo shkoni vetëm, po doni.',
              en: 'Invite a friend and explore together. Or go alone, if you prefer.',
            })}
          </Txt>
        </View>

        <View style={styles.qrContainer}>
          <View style={styles.qrCard}>
            <Txt variant="title3" tone="label" weight="700" style={styles.qrTitle}>
              {t({ sq: 'Kodi yt i miqësisë', en: 'Your friend code' })}
            </Txt>
            <View style={styles.codeContainer}>
              <Txt variant="largeTitle" tone="label" weight="800" style={styles.codeText}>
                {FRIEND_CODE}
              </Txt>
            </View>
            <Txt variant="footnote" tone="label3" style={styles.codeNote}>
              {t({ sq: 'Ndaje këtë kod me një shok', en: 'Share this code with a friend' })}
            </Txt>

            <View style={styles.divider} />

            <Txt variant="title3" tone="label" weight="700" style={styles.qrTitle}>
              {t({ sq: 'Ose skano QR-në', en: 'Or scan the QR' })}
            </Txt>
            <View style={styles.qrCodeContainer}>
              <View style={styles.qrPlaceholder}>
                <Icon name="qrcode" size={64} tone="label3" />
              </View>
            </View>
            <Txt variant="footnote" tone="label3" style={styles.codeNote}>
              {t({ sq: 'Kodi: ' + FRIEND_CODE, en: 'Code: ' + FRIEND_CODE })}
            </Txt>
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            label={t({ sq: 'Dërgo ftesën time', en: 'Send my invite' })}
            icon="square.and.arrow.up"
            onPress={handleShareInvite}
          />
          <View style={styles.secondaryButtonWrapper}>
            <Button
              variant="secondary"
              label={t({ sq: 'Do të eksploroj vetëm', en: "I'll explore alone" })}
              onPress={() => router.push('/first-km')}
            />
          </View>
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
    marginBottom: 32,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    lineHeight: 22,
    textAlign: 'center',
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  qrCard: {
    width: '100%',
    maxWidth: 320,
    padding: 24,
    backgroundColor: '#F2F2F7',
    borderRadius: 24,
    alignItems: 'center',
    gap: 20,
  },
  qrTitle: {
    textAlign: 'center',
  },
  codeContainer: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E5EA',
  },
  codeText: {
    letterSpacing: 4,
    textAlign: 'center',
  },
  codeNote: {
    textAlign: 'center',
  },
  divider: {
    width: '100%',
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(60,60,67,0.29)',
    marginVertical: 8,
  },
  qrCodeContainer: {
    width: 200,
    height: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrPlaceholder: {
    width: 180,
    height: 180,
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    gap: 12,
  },
  secondaryButtonWrapper: {
    marginTop: 12,
  },
});