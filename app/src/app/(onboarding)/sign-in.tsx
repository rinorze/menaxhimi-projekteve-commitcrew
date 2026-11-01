import { router } from 'expo-router';
import { useState } from 'react';
import { TextInput, View } from 'react-native';

import { Button, Press, Screen, Txt } from '@/components';
import { signIn } from '@/lib/api';
import { useT } from '@/lib/i18n';
import { radius, useColors } from '@/theme/tokens';

export default function SignInScreen() {
  const c = useColors();
  const t = useT();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    setError('');
    try {
      await signIn(username.trim(), password);
      router.replace('/home');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not sign in.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen scroll grouped>
      <View style={{ flex: 1, gap: 20 }}>
        <Press
          onPress={() => router.replace('/welcome')}
          accessibilityLabel={t({ sq: 'Anulo', en: 'Cancel' })}
          style={{ minHeight: 44, alignSelf: 'flex-start', justifyContent: 'center' }}
        >
          <Txt variant="headline" tone="blue">
            {t({ sq: 'Anulo', en: 'Cancel' })}
          </Txt>
        </Press>

        <View style={{ gap: 4 }}>
          <Txt variant="largeTitle">{t({ sq: 'Mirë se u ktheve', en: 'Welcome back' })}</Txt>
          <Txt variant="subheadline" tone="label2">
            {t({ sq: 'Pasaporta dhe shokët të presin.', en: 'Your passport and friends are waiting.' })}
          </Txt>
        </View>

        <View style={{ borderRadius: radius.card, backgroundColor: c.card, overflow: 'hidden' }}>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder={t({ sq: 'Përdoruesi', en: 'Username' })}
            placeholderTextColor={c.label2}
            autoCapitalize="none"
            autoCorrect={false}
            accessibilityLabel={t({ sq: 'Përdoruesi', en: 'Username' })}
            style={{ minHeight: 54, paddingHorizontal: 16, color: c.label, fontSize: 17 }}
          />
          <View style={{ height: 0.5, backgroundColor: c.separator, marginLeft: 16 }} />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder={t({ sq: 'Fjalëkalimi', en: 'Password' })}
            placeholderTextColor={c.label2}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            accessibilityLabel={t({ sq: 'Fjalëkalimi', en: 'Password' })}
            style={{ minHeight: 54, paddingHorizontal: 16, color: c.label, fontSize: 17 }}
          />
        </View>

        {error ? <Txt tone="red">{error}</Txt> : null}
        <Button
          label={busy ? t({ sq: 'Duke hyrë…', en: 'Signing in…' }) : t({ sq: 'Hyr', en: 'Sign in' })}
          disabled={busy || !username.trim() || !password}
          onPress={() => void submit()}
        />
        <Button
          label={t({ sq: 'Krijo llogari', en: 'Create account' })}
          variant="text"
          disabled={busy}
          onPress={() => router.replace('/language')}
        />
      </View>
    </Screen>
  );
}
