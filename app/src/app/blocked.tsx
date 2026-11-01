import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { Button, Icon, Press, Screen, Txt } from '@/components';
import { getBlockedUsers, unblockUser, type Friendship } from '@/lib/api';
import { useT } from '@/lib/i18n';
import { minTouch, radius, useColors } from '@/theme/tokens';

export default function BlockedUsersScreen() {
  const c = useColors();
  const t = useT();
  const [blocked, setBlocked] = useState<Friendship[]>([]);
  const [confirming, setConfirming] = useState<Friendship | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    getBlockedUsers()
      .then((people) => {
        if (active) setBlocked(people);
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(cause instanceof Error ? cause.message : t({
            sq: 'Lista e personave të bllokuar nuk mund të ngarkohej.',
            en: 'Could not load blocked people.',
          }));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [t]);

  async function confirmUnblock() {
    if (!confirming) return;
    setSaving(true);
    setError('');
    try {
      await unblockUser(confirming.id);
      setBlocked((current) => current.filter((entry) => entry.id !== confirming.id));
      setConfirming(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t({
        sq: 'Ky person nuk mund të zhbllokohej.',
        en: 'Could not unblock this person.',
      }));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen scroll grouped>
      <View style={{ gap: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Press
            onPress={() => router.back()}
            accessibilityLabel={t({ sq: 'Kthehu', en: 'Go back' })}
            style={{ minWidth: minTouch, minHeight: minTouch, alignItems: 'center', justifyContent: 'center' }}
          >
            <Icon name="chevron.left" size={20} />
          </Press>
          <Txt variant="largeTitle">{t({ sq: 'Të bllokuarit', en: 'Blocked people' })}</Txt>
        </View>
        <Txt tone="label2">
          {t({
            sq: 'Personat e bllokuar nuk mund ta shohin vendndodhjen tënde.',
            en: 'Blocked people cannot see your location.',
          })}
        </Txt>

        {error ? <Txt tone="red">{error}</Txt> : null}
        {loading ? <Txt tone="label2">{t({ sq: 'Duke ngarkuar…', en: 'Loading…' })}</Txt> : null}
        {!loading && !error && blocked.length === 0 ? (
          <View style={{ padding: 24, borderRadius: radius.card, backgroundColor: c.card, alignItems: 'center', gap: 8 }}>
            <Icon name="person.crop.circle.badge.checkmark" size={32} tone="label2" />
            <Txt variant="headline">{t({ sq: 'Askush nuk është i bllokuar', en: 'No one is blocked' })}</Txt>
            <Txt variant="subheadline" tone="label2" align="center">
              {t({ sq: 'Lista jote e bllokimit është bosh.', en: 'Your blocked list is empty.' })}
            </Txt>
          </View>
        ) : null}

        {blocked.map((entry) => (
          <View
            key={entry.id}
            style={{
              padding: 16,
              borderRadius: radius.card,
              backgroundColor: c.card,
              gap: 12,
            }}
          >
            <Txt variant="headline">{entry.to_user.username}</Txt>
            <Button
              label={t({ sq: 'Zhblloko', en: 'Unblock' })}
              variant="secondary"
              onPress={() => setConfirming(entry)}
            />
          </View>
        ))}

        {confirming ? (
          <View style={{ padding: 16, borderRadius: radius.card, backgroundColor: c.card, gap: 12 }}>
            <Txt variant="headline">
              {t({ sq: `Të zhbllokohet ${confirming.to_user.username}?`, en: `Unblock ${confirming.to_user.username}?` })}
            </Txt>
            <Txt variant="subheadline" tone="label2">
              {t({
                sq: 'Ky person do të mund të dërgojë përsëri kërkesa për shoqëri.',
                en: 'This person will be able to send friend requests again.',
              })}
            </Txt>
            <Button
              label={t({ sq: 'Po, zhbllokoje', en: 'Yes, unblock' })}
              variant="secondary"
              disabled={saving}
              onPress={() => void confirmUnblock()}
            />
            <Button
              label={t({ sq: 'Anulo', en: 'Cancel' })}
              variant="text"
              disabled={saving}
              onPress={() => setConfirming(null)}
            />
          </View>
        ) : null}

        {error ? (
          <Button
            label={t({ sq: 'Hyr në llogari', en: 'Sign in' })}
            variant="secondary"
            onPress={() => router.push('/sign-in')}
          />
        ) : null}
      </View>
    </Screen>
  );
}
