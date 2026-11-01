import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { Button, Chip, Icon, Press, Screen, Txt } from '@/components';
import { getBlockedUsers, getProfile, updateProfile, type ProfileSettings } from '@/lib/api';
import { useT } from '@/lib/i18n';
import { minTouch, radius, useColors } from '@/theme/tokens';

const notificationTypes = [
  { key: 'friend_requests', label: { sq: 'Kërkesa për shoqëri', en: 'Friend requests' } },
  { key: 'friend_activity', label: { sq: 'Aktiviteti i shokëve', en: 'Friends’ activity' } },
  { key: 'messages', label: { sq: 'Mesazhet', en: 'Messages' } },
  { key: 'postcards', label: { sq: 'Kartolinat', en: 'Postcards' } },
  { key: 'events', label: { sq: 'Ngjarjet', en: 'Events' } },
];

const sharingPrecisions = [
  { key: 'city', label: { sq: 'Qyteti', en: 'City' } },
  { key: 'km', label: { sq: 'Rreth 1 km', en: 'About 1 km' } },
  { key: 'exact', label: { sq: 'Saktë', en: 'Exact' } },
] as const;

const sharingDurations = [
  { value: 15, label: { sq: '15 min', en: '15 min' } },
  { value: 60, label: { sq: '1 orë', en: '1 hour' } },
  { value: 480, label: { sq: '8 orë', en: '8 hours' } },
  { value: null, label: { sq: 'Kurrë', en: 'Never' } },
] as const;

export default function SettingsScreen() {
  const c = useColors();
  const t = useT();
  const [profile, setProfile] = useState<ProfileSettings | null>(null);
  const [blockedCount, setBlockedCount] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([getProfile(), getBlockedUsers()])
      .then(([settings, blocked]) => {
        if (!active) return;
        if (!settings) {
          throw new Error(t({
            sq: 'Serveri nuk ktheu cilësimet e profilit.',
            en: 'The server returned no profile settings.',
          }));
        }
        setProfile(settings);
        setBlockedCount(blocked.length);
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(cause instanceof Error ? cause.message : t({
            sq: 'Cilësimet nuk mund të ngarkoheshin.',
            en: 'Could not load settings.',
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

  async function save(patch: Partial<ProfileSettings>) {
    setSaving(true);
    setError('');
    try {
      const updated = await updateProfile(patch);
      if (!updated) {
        throw new Error(t({
          sq: 'Serveri nuk ktheu cilësimet e përditësuara.',
          en: 'The server returned no updated settings.',
        }));
      }
      setProfile(updated);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t({
        sq: 'Ky cilësim nuk mund të ruhej.',
        en: 'Could not save this setting.',
      }));
    } finally {
      setSaving(false);
    }
  }

  function togglePreference(key: string) {
    if (!profile) return;
    void save({
      notification_preferences: {
        ...profile.notification_preferences,
        [key]: !profile.notification_preferences[key],
      },
    });
  }

  return (
    <Screen scroll grouped>
      <View style={{ gap: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Press
            onPress={() => router.back()}
            accessibilityLabel={t({ sq: 'Kthehu', en: 'Go back' })}
            style={{ minWidth: minTouch, minHeight: minTouch, alignItems: 'center', justifyContent: 'center' }}
          >
            <Icon name="chevron.left" size={20} />
          </Press>
          <Txt variant="largeTitle">{t({ sq: 'Cilësimet', en: 'Settings' })}</Txt>
        </View>

        {error ? (
          <View style={{ gap: 10, padding: 14, borderRadius: radius.card, backgroundColor: c.card }}>
            <Txt tone="red">{error}</Txt>
            <Button
              label={t({ sq: 'Hyr në llogari', en: 'Sign in' })}
              variant="secondary"
              onPress={() => router.push('/sign-in')}
            />
          </View>
        ) : null}
        {loading ? <Txt tone="label2">{t({ sq: 'Duke ngarkuar…', en: 'Loading…' })}</Txt> : null}

        {profile ? (
          <>
            <Section title={t({ sq: 'Privatësia dhe vendndodhja', en: 'Privacy & location' })}>
              <View style={{ borderRadius: radius.card, backgroundColor: c.card, overflow: 'hidden' }}>
                <SettingToggle
                  label={t({ sq: 'Modaliteti fantazmë', en: 'Ghost mode' })}
                  description={t({
                    sq: 'Kur është aktiv, shokët nuk mund ta shohin vendndodhjen tënde.',
                    en: 'When on, friends cannot see your location.',
                  })}
                  value={profile.ghost_mode}
                  disabled={saving}
                  onPress={() => void save({ ghost_mode: !profile.ghost_mode })}
                />
                <Divider />
                <SettingToggle
                  label={t({ sq: 'Ndaj vendndodhjen time', en: 'Share my location' })}
                  value={profile.location_sharing}
                  disabled={saving || profile.ghost_mode}
                  onPress={() => void save({ location_sharing: !profile.location_sharing })}
                />
                <Divider />
                <View style={{ padding: 16, gap: 12 }}>
                  <Txt variant="headline">{t({ sq: 'Kur ndaj, trego', en: 'When I share, show' })}</Txt>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                    {sharingPrecisions.map((option) => (
                      <Chip
                        key={option.key}
                        label={t(option.label)}
                        selected={profile.sharing_precision === option.key}
                        onPress={() => void save({ sharing_precision: option.key })}
                      />
                    ))}
                  </View>
                </View>
                <Divider />
                <View style={{ padding: 16, gap: 12 }}>
                  <Txt variant="headline">{t({ sq: 'Ndalo ndarjen pas', en: 'Stop sharing after' })}</Txt>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                    {sharingDurations.map((option) => (
                      <Chip
                        key={option.value ?? 'never'}
                        label={t(option.label)}
                        selected={profile.stop_sharing_after_minutes === option.value}
                        onPress={() => void save({ stop_sharing_after_minutes: option.value })}
                      />
                    ))}
                  </View>
                </View>
                <Divider />
                <SettingLink
                  label={t({ sq: 'Personat e bllokuar', en: 'Blocked people' })}
                  value={blockedCount === null ? '—' : String(blockedCount)}
                  onPress={() => router.push('/blocked')}
                />
              </View>
            </Section>

            <Section title={t({ sq: 'Njoftimet', en: 'Notifications' })}>
              <View style={{ borderRadius: radius.card, backgroundColor: c.card, overflow: 'hidden' }}>
                {notificationTypes.map((option, index) => (
                  <View key={option.key}>
                    {index > 0 ? <Divider /> : null}
                    <SettingToggle
                      label={t(option.label)}
                      value={profile.notification_preferences[option.key] ?? true}
                      disabled={saving}
                      onPress={() => togglePreference(option.key)}
                    />
                  </View>
                ))}
              </View>
            </Section>

            <View style={{ borderRadius: radius.card, backgroundColor: c.card, overflow: 'hidden' }}>
              <SettingLink
                label={t({ sq: 'Fshi llogarinë', en: 'Delete account' })}
                destructive
                onPress={() => router.push('/delete-account')}
              />
            </View>
          </>
        ) : null}
      </View>
    </Screen>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 8 }}>
      <Txt variant="footnote" tone="label2" weight="600" style={{ textTransform: 'uppercase' }}>
        {title}
      </Txt>
      {children}
    </View>
  );
}

function Divider() {
  const c = useColors();
  return <View style={{ height: 0.5, backgroundColor: c.separator, marginLeft: 16 }} />;
}

function SettingToggle({
  label,
  description,
  value,
  disabled,
  onPress,
}: {
  label: string;
  description?: string;
  value: boolean;
  disabled?: boolean;
  onPress: () => void;
}) {
  const c = useColors();
  return (
    <Press
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      style={{ minHeight: minTouch + 8, paddingHorizontal: 16, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 12, opacity: disabled ? 0.55 : 1 }}
    >
      <View style={{ flex: 1, gap: 2 }}>
        <Txt variant="body">{label}</Txt>
        {description ? <Txt variant="footnote" tone="label2">{description}</Txt> : null}
      </View>
      <View style={{ width: 52, height: 32, borderRadius: 16, backgroundColor: value ? c.green : c.fillStrong, justifyContent: 'center', paddingHorizontal: 3 }}>
        <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: c.card, alignSelf: value ? 'flex-end' : 'flex-start' }} />
      </View>
    </Press>
  );
}

function SettingLink({
  label,
  value,
  destructive,
  onPress,
}: {
  label: string;
  value?: string;
  destructive?: boolean;
  onPress: () => void;
}) {
  return (
    <Press
      onPress={onPress}
      accessibilityLabel={label}
      style={{ minHeight: minTouch + 8, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}
    >
      <Txt variant="body" tone={destructive ? 'red' : 'label'} style={{ flex: 1 }}>{label}</Txt>
      {value ? <Txt variant="subheadline" tone="label2">{value}</Txt> : null}
      {!destructive ? <Icon name="chevron.right" size={16} tone="label2" /> : null}
    </Press>
  );
}
