import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';

import { Chip, Icon, Press, Screen, Txt } from '@/components';
import { municipalities } from '@/data';
import { getProfile, type ProfileData } from '@/lib/api';
import { useT } from '@/lib/i18n';
import { radius, useColors } from '@/theme/tokens';

const exampleProfile: ProfileData = {
  display_name: 'Besa',
  home_municipality: { slug: 'prizren', name_sq: 'Prizreni', name_en: 'Prizren' },
  language: 'sq',
  avatar: null,
  stats: {
    stamps: 13,
    municipalities: { visited: 4, total: 38 },
    streak: { current: 2, longest: 2 },
    saved_places: 0,
    trips: 0,
    postcards: 0,
  },
};

const defaultAvatar = require('../../../docs/design/assets/avatars/av-vesa.svg');

const personalRows = [
  { label: { sq: 'Avatari', en: 'Avatar' }, icon: 'pencil' as const, href: '/avatar' as const },
  { label: { sq: 'Të ruajturat', en: 'Saved' }, icon: 'bookmark' as const, soon: true },
  { label: { sq: 'Ditari', en: 'Journal' }, icon: 'book' as const, soon: true },
  { label: { sq: 'Udhëtimet', en: 'Trips' }, icon: 'point.topleft.down.curvedto.point.bottomright.up' as const, soon: true },
];

const planningRows = [
  { label: { sq: 'Ndërtuesi i ditës', en: 'Day planner' }, icon: 'calendar' as const },
  { label: { sq: 'Ora e artë', en: 'Golden hour' }, icon: 'sun.max' as const },
  { label: { sq: 'Plani për shi', en: 'Rain plan' }, icon: 'cloud.rain' as const },
];

function getMunicipalityName(profile: ProfileData, lang: 'sq' | 'en') {
  const municipality = profile.home_municipality;
  const slug = typeof municipality === 'string' ? municipality : municipality?.slug;
  const local = slug ? municipalities.find((item) => item.slug === slug) : undefined;
  if (typeof municipality === 'string') return local ? (lang === 'sq' ? local.name_sq : local.name_en) : municipality;
  if (!municipality) return '';
  return lang === 'sq'
    ? municipality.name_sq ?? local?.name_sq ?? municipality.name_en ?? ''
    : municipality.name_en ?? local?.name_en ?? municipality.name_sq ?? '';
}

function ProfileRow({
  label,
  icon,
  soon,
  onPress,
  last,
}: {
  label: string;
  icon: 'pencil' | 'bookmark' | 'book' | 'point.topleft.down.curvedto.point.bottomright.up' | 'calendar' | 'sun.max' | 'cloud.rain';
  soon?: string;
  onPress?: () => void;
  last?: boolean;
}) {
  const c = useColors();
  const content = (
    <View
      style={{
        minHeight: 68,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 14,
        borderBottomWidth: last ? 0 : 0.5,
        borderBottomColor: c.separator,
      }}
    >
      <View style={{ width: 44, height: 44, borderRadius: radius.pill, backgroundColor: c.fill, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={22} />
      </View>
      <Txt variant="body" style={{ flex: 1 }}>
        {label}
      </Txt>
      {soon ? (
        <Txt variant="footnote" tone="label2">
          {soon}
        </Txt>
      ) : null}
      <Icon name="chevron.right" size={18} tone="label2" />
    </View>
  );
  return onPress ? (
    <Press onPress={onPress} accessibilityLabel={label} scaleTo={0.99}>
      {content}
    </Press>
  ) : (
    <View accessibilityLabel={label}>{content}</View>
  );
}

export default function Profile() {
  const c = useColors();
  const t = useT();
  const [profile, setProfile] = useState(exampleProfile);
  const [isExample, setIsExample] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    let active = true;
    getProfile()
      .then((data) => {
        if (!active) return;
        setProfile(data);
        setIsExample(false);
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

  const lang = profile.language === 'en' ? 'en' : 'sq';
  const municipalitySq = getMunicipalityName(profile, 'sq');
  const municipalityEn = getMunicipalityName(profile, 'en');
  const homeLine = t({
    sq: `Nga ${municipalitySq || 'pa caktuar'} · ${lang === 'sq' ? 'Shqip' : 'Anglisht'}`,
    en: `From ${municipalityEn || 'not set'} · ${lang === 'sq' ? 'Albanian' : 'English'}`,
  });
  const avatarUri = typeof profile.avatar === 'string'
    ? profile.avatar
    : profile.avatar && typeof profile.avatar.uri === 'string'
      ? profile.avatar.uri
      : undefined;

  return (
    <Screen scroll padding={16}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Press
          onPress={() => router.back()}
          accessibilityLabel={t({ sq: 'Kthehu prapa', en: 'Go back' })}
          style={{ width: 48, height: 48, borderRadius: radius.pill, backgroundColor: c.card, alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon name="chevron.left" size={22} />
        </Press>
        <Press
          onPress={() => router.push('/settings')}
          accessibilityLabel={t({ sq: 'Cilësimet', en: 'Settings' })}
          style={{ width: 48, height: 48, borderRadius: radius.pill, backgroundColor: c.card, alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon name="gearshape" size={22} />
        </Press>
      </View>

      {loading ? (
        <Txt variant="footnote" tone="label2" align="center" style={{ marginBottom: 12 }}>
          {t({ sq: 'Po ngarkohen të dhënat e profilit…', en: 'Loading profile data…' })}
        </Txt>
      ) : null}
      {loadFailed ? (
        <Txt variant="footnote" tone="label2" align="center" style={{ marginBottom: 12 }}>
          {t({ sq: 'Lidhja me profilin dështoi. Po shfaqen të dhëna shembull.', en: 'Could not load your profile. Showing example data.' })}
        </Txt>
      ) : null}

      <View style={{ alignItems: 'center', marginBottom: 24 }}>
        <View style={{ position: 'relative', width: 132, height: 132, borderRadius: radius.pill, backgroundColor: c.fill, alignItems: 'center', justifyContent: 'center' }}>
          <Image
            source={avatarUri ? { uri: avatarUri } : defaultAvatar}
            contentFit="cover"
            style={{ width: 132, height: 132, borderRadius: radius.pill }}
          />
          <Press
            onPress={() => router.push('/avatar')}
            accessibilityLabel={t({ sq: 'Ndrysho avatarin', en: 'Edit avatar' })}
            style={{
              position: 'absolute',
              right: -6,
              bottom: -6,
              width: 48,
              height: 48,
              borderRadius: radius.pill,
              backgroundColor: c.card,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="pencil" size={21} />
          </Press>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16 }}>
          <Txt variant="largeTitle">{profile.display_name}</Txt>
          {isExample ? <Chip label={t({ sq: 'Shembull', en: 'Example' })} /> : null}
        </View>
        <Txt variant="title3" tone="label2" align="center" numberOfLines={1} style={{ marginTop: 4, maxWidth: '100%' }}>
          {homeLine}
        </Txt>
      </View>

      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 24 }}>
        <View style={{ flex: 1, minHeight: 92, borderRadius: radius.sheet, backgroundColor: c.surface, padding: 14, justifyContent: 'center' }}>
          <Txt variant="largeTitle" weight="700">{profile.stats.stamps}</Txt>
          <Txt variant="subheadline" tone="label2">{t({ sq: 'vula', en: 'stamps' })}</Txt>
        </View>
        <View style={{ flex: 1, minHeight: 92, borderRadius: radius.sheet, backgroundColor: c.surface, padding: 14, justifyContent: 'center' }}>
          <Txt variant="largeTitle" weight="700">{profile.stats.municipalities.visited}</Txt>
          <Txt variant="subheadline" tone="label2">{t({ sq: 'komuna', en: 'municipalities' })}</Txt>
        </View>
        <View style={{ flex: 1, minHeight: 92, borderRadius: radius.sheet, backgroundColor: c.surface, padding: 14, justifyContent: 'center' }}>
          <Txt variant="largeTitle" weight="700">{profile.stats.streak.current}</Txt>
          <Txt variant="subheadline" tone="label2">{t({ sq: 'javë', en: 'weeks' })}</Txt>
        </View>
      </View>

      <Txt variant="headline" tone="label2" style={{ marginBottom: 8 }}>
        {t({ sq: 'Të miat', en: 'My things' })}
      </Txt>
      <View style={{ borderRadius: radius.sheet, backgroundColor: c.surface, overflow: 'hidden', marginBottom: 22 }}>
        {personalRows.map((row, index) => (
          <ProfileRow
            key={row.label.sq}
            label={t(row.label)}
            icon={row.icon}
            soon={row.soon ? t({ sq: 'Së shpejti', en: 'Coming soon' }) : undefined}
            onPress={row.href ? () => router.push(row.href) : undefined}
            last={index === personalRows.length - 1}
          />
        ))}
      </View>

      <Txt variant="headline" tone="label2" style={{ marginBottom: 8 }}>
        {t({ sq: 'Planifiko', en: 'Plan' })}
      </Txt>
      <View style={{ borderRadius: radius.sheet, backgroundColor: c.surface, overflow: 'hidden' }}>
        {planningRows.map((row, index) => (
          <ProfileRow
            key={row.label.sq}
            label={t(row.label)}
            icon={row.icon}
            soon={t({ sq: 'Së shpejti', en: 'Coming soon' })}
            last={index === planningRows.length - 1}
          />
        ))}
      </View>
    </Screen>
  );
}
