import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Modal, ScrollView, TextInput, View } from 'react-native';
import { Image } from 'expo-image';

import { Button, Icon, Press, Screen, Txt } from '@/components';
import { municipalities } from '@/data';
import { getProfile, updateProfile } from '@/lib/api';
import { useT } from '@/lib/i18n';
import { radius, useColors } from '@/theme/tokens';

const defaultAvatar = require('../../../docs/design/assets/avatars/av-vesa.svg');

export default function EditProfile() {
  const c = useColors();
  const t = useT();
  const [displayName, setDisplayName] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [municipalitySlug, setMunicipalitySlug] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<'error' | 'saved' | null>(null);

  useEffect(() => {
    let active = true;
    getProfile()
      .then((profile) => {
        if (!active) return;
        setDisplayName(profile.display_name);
        const avatar = profile.avatar;
        const uri = typeof avatar === 'string' ? avatar : avatar?.uri;
        setAvatarUri(uri || null);
        const home = profile.home_municipality;
        setMunicipalitySlug(typeof home === 'string' ? home : home?.slug ?? null);
      })
      .catch(() => {
        if (active) setLoadFailed(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const selectedMunicipality = municipalities.find((item) => item.slug === municipalitySlug);

  async function saveProfile() {
    setSaving(true);
    setFeedback(null);
    try {
      await updateProfile({
        display_name: displayName.trim(),
        home_municipality_slug: municipalitySlug,
      });
      setFeedback('saved');
    } catch {
      setFeedback('error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen scroll>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <Press
          onPress={() => router.back()}
          accessibilityLabel={t({ sq: 'Kthehu prapa', en: 'Go back' })}
          style={{ width: 48, height: 48, borderRadius: radius.pill, backgroundColor: c.surface, alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon name="chevron.left" size={22} />
        </Press>
        <Txt variant="title1">{t({ sq: 'Ndrysho profilin', en: 'Edit profile' })}</Txt>
      </View>

      <Press
        onPress={() => router.push('/avatar')}
        accessibilityLabel={t({ sq: 'Ndrysho avatarin', en: 'Edit avatar' })}
        style={{ minHeight: 72, flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, borderRadius: radius.card, backgroundColor: c.surface, marginBottom: 24 }}
      >
        <Image
          source={avatarUri ? { uri: avatarUri } : defaultAvatar}
          contentFit="cover"
          style={{ width: 48, height: 48, borderRadius: radius.pill, backgroundColor: c.fill }}
        />
        <Txt variant="body" style={{ flex: 1 }}>{t({ sq: 'Avatari', en: 'Avatar' })}</Txt>
        <Icon name="chevron.right" size={18} tone="label2" />
      </Press>

      {loading ? (
        <Txt variant="footnote" tone="label2" style={{ marginBottom: 16 }}>
          {t({ sq: 'Po ngarkohen të dhënat e profilit…', en: 'Loading profile data…' })}
        </Txt>
      ) : null}
      {loadFailed ? (
        <Txt variant="footnote" tone="label2" style={{ marginBottom: 16 }}>
          {t({ sq: 'Profili nuk u ngarkua. Mund t’i plotësosh fushat dhe të provosh ta ruash.', en: 'The profile could not be loaded. Fill in the fields and try saving.' })}
        </Txt>
      ) : null}

      <View style={{ gap: 8, marginBottom: 20 }}>
        <Txt variant="headline">{t({ sq: 'Emri i shfaqur', en: 'Display name' })}</Txt>
        <TextInput
          value={displayName}
          onChangeText={(value) => {
            setDisplayName(value);
            setFeedback(null);
          }}
          placeholder={t({ sq: 'Shkruaj emrin', en: 'Enter your name' })}
          placeholderTextColor={c.label3}
          maxLength={100}
          returnKeyType="done"
          accessibilityLabel={t({ sq: 'Emri i shfaqur', en: 'Display name' })}
          style={{
            minHeight: 52,
            borderRadius: radius.row,
            backgroundColor: c.surface,
            color: c.label,
            paddingHorizontal: 16,
          }}
        />
      </View>

      <View style={{ gap: 8, marginBottom: 24 }}>
        <Txt variant="headline">{t({ sq: 'Komuna e vendbanimit', en: 'Home municipality' })}</Txt>
        <Press
          onPress={() => setPickerOpen(true)}
          accessibilityLabel={t({ sq: 'Zgjidh komunën e vendbanimit', en: 'Choose your home municipality' })}
          style={{ minHeight: 52, borderRadius: radius.row, backgroundColor: c.surface, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 }}
        >
          <Txt variant="body" tone={selectedMunicipality ? 'label' : 'label2'} style={{ flex: 1 }}>
            {selectedMunicipality
              ? t({ sq: selectedMunicipality.name_sq, en: selectedMunicipality.name_en })
              : t({ sq: 'Zgjidh komunën', en: 'Choose a municipality' })}
          </Txt>
          <Icon name="chevron.down" size={18} tone="label2" />
        </Press>
      </View>

      {feedback ? (
        <Txt variant="subheadline" tone={feedback === 'error' ? 'red' : 'green'} style={{ marginBottom: 16 }}>
          {feedback === 'error'
            ? t({ sq: 'Profili nuk u ruajt. Kontrollo lidhjen dhe provo përsëri.', en: 'Your profile could not be saved. Check your connection and try again.' })
            : t({ sq: 'Ndryshimet u ruajtën.', en: 'Your changes were saved.' })}
        </Txt>
      ) : null}

      <Button
        label={saving ? t({ sq: 'Duke ruajtur…', en: 'Saving…' }) : t({ sq: 'Ruaj', en: 'Save' })}
        onPress={saveProfile}
        disabled={saving || !displayName.trim()}
      />

      <Modal visible={pickerOpen} transparent animationType="slide" onRequestClose={() => setPickerOpen(false)}>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: c.label3 }}>
          <View style={{ height: '78%', backgroundColor: c.bg, borderTopLeftRadius: radius.sheet, borderTopRightRadius: radius.sheet, paddingTop: 16, paddingHorizontal: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <Txt variant="title3">{t({ sq: 'Zgjidh komunën', en: 'Choose municipality' })}</Txt>
              <Press
                onPress={() => setPickerOpen(false)}
                accessibilityLabel={t({ sq: 'Mbyll', en: 'Close' })}
                style={{ width: 44, height: 44, borderRadius: radius.pill, backgroundColor: c.surface, alignItems: 'center', justifyContent: 'center' }}
              >
                <Icon name="xmark" size={18} />
              </Press>
            </View>
            <ScrollView>
              {municipalities.map((municipality, index) => (
                <Press
                  key={municipality.slug}
                  onPress={() => {
                    setMunicipalitySlug(municipality.slug);
                    setFeedback(null);
                    setPickerOpen(false);
                  }}
                  accessibilityLabel={t({ sq: municipality.name_sq, en: municipality.name_en })}
                  accessibilityState={{ selected: municipality.slug === municipalitySlug }}
                  style={{
                    minHeight: 52,
                    justifyContent: 'center',
                    borderBottomWidth: index === municipalities.length - 1 ? 0 : 0.5,
                    borderBottomColor: c.separator,
                  }}
                >
                  <Txt variant="body">{t({ sq: municipality.name_sq, en: municipality.name_en })}</Txt>
                </Press>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}
