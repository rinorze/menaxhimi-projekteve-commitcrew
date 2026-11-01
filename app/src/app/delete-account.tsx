import { router } from 'expo-router';
import { useState } from 'react';
import { TextInput, View } from 'react-native';

import { Button, Icon, Press, Screen, Txt } from '@/components';
import { clearSession, deleteAccount } from '@/lib/api';
import { useT } from '@/lib/i18n';
import { minTouch, radius, useColors } from '@/theme/tokens';

export default function DeleteAccountScreen() {
  const c = useColors();
  const t = useT();
  const [password, setPassword] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function removeAccount() {
    if (!password) {
      setError(t({ sq: 'Shkruaje fjalëkalimin për të vazhduar.', en: 'Enter your password to continue.' }));
      return;
    }
    if (!confirming) {
      setConfirming(true);
      setError('');
      return;
    }

    setSaving(true);
    setError('');
    try {
      await deleteAccount(password);
      clearSession();
      router.replace('/welcome');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not delete the account.');
      setConfirming(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen scroll grouped>
      <View style={{ gap: 18 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Press
            onPress={() => router.back()}
            accessibilityLabel={t({ sq: 'Kthehu', en: 'Go back' })}
            style={{ minWidth: minTouch, minHeight: minTouch, alignItems: 'center', justifyContent: 'center' }}
          >
            <Icon name="chevron.left" size={20} />
          </Press>
          <Txt variant="largeTitle">{t({ sq: 'Fshi llogarinë', en: 'Delete account' })}</Txt>
        </View>

        <View style={{ padding: 18, borderRadius: radius.card, backgroundColor: c.card, gap: 12 }}>
          <Txt variant="title3" tone="red">
            {t({ sq: 'Ky veprim nuk mund të zhbëhet.', en: 'This action cannot be undone.' })}
          </Txt>
          <Txt>
            {t({
              sq: 'Llogaria, profili, shenjat, vendet e ruajtura, udhëtimet, kartolinat, fotot private dhe të dhënat e tjera do të fshihen përgjithmonë.',
              en: 'Your account, profile, stamps, saved places, trips, postcards, private photos, and other data will be permanently deleted.',
            })}
          </Txt>
        </View>

        <View style={{ paddingHorizontal: 16, paddingVertical: 8, minHeight: minTouch + 8, justifyContent: 'center', borderRadius: radius.card, backgroundColor: c.card }}>
          <TextInput
            value={password}
            onChangeText={(value) => {
              setPassword(value);
              setConfirming(false);
            }}
            placeholder={t({ sq: 'Fjalëkalimi yt', en: 'Your password' })}
            placeholderTextColor={c.label2}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            accessibilityLabel={t({ sq: 'Fjalëkalimi yt', en: 'Your password' })}
            style={{ color: c.label, fontSize: 17, minHeight: minTouch }}
          />
        </View>

        {error ? <Txt tone="red">{error}</Txt> : null}
        {confirming ? (
          <Txt variant="subheadline" tone="red">
            {t({
              sq: 'Konfirmo edhe një herë: të dhënat e llogarisë do të fshihen.',
              en: 'Confirm once more: your account data will be deleted.',
            })}
          </Txt>
        ) : null}

        <Press
          onPress={() => void removeAccount()}
          disabled={saving}
          accessibilityRole="button"
          accessibilityState={{ disabled: saving }}
          style={{ minHeight: minTouch + 6, borderRadius: radius.pill, backgroundColor: c.red, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, opacity: saving ? 0.6 : 1 }}
        >
          <Txt variant="headline" tone="onTint" align="center" style={{ color: c.card }}>
            {saving
              ? t({ sq: 'Duke fshirë…', en: 'Deleting…' })
              : confirming
                ? t({ sq: 'Po, fshije llogarinë', en: 'Yes, delete account' })
                : t({ sq: 'Vazhdo me fshirjen', en: 'Continue to delete' })}
          </Txt>
        </Press>
        <Button
          label={t({ sq: 'Mbaje llogarinë', en: 'Keep my account' })}
          variant="text"
          disabled={saving}
          onPress={() => router.back()}
        />
      </View>
    </Screen>
  );
}
