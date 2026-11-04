import { router, type Href } from 'expo-router';
import { View } from 'react-native';

import { Press, Screen, Txt } from '@/components';
import { onboardingScreens, profileScreens } from '@/lib/screens';
import { useT } from '@/lib/i18n';
import { radius, useColors } from '@/theme/tokens';

export default function AllScreens() {
  const t = useT();
  return (
    <Screen scroll grouped>
      <View style={{ gap: 6, marginBottom: 16 }}>
        <Txt variant="largeTitle">{t({ sq: 'Të gjitha ekranet', en: 'All screens' })}</Txt>
        <Txt variant="subheadline" tone="label2">
          {t({
            sq: 'Ekranet e onboarding dhe profilit sipas dizajnit.',
            en: 'Onboarding and profile screens from the design.',
          })}
        </Txt>
      </View>
      <ScreenList title={t({ sq: 'Onboarding', en: 'Onboarding' })} screens={onboardingScreens} />
      <ScreenList
        title={t({ sq: 'Profili dhe cilësimet', en: 'Profile & settings' })}
        screens={profileScreens}
      />
    </Screen>
  );
}

function ScreenList({
  title,
  screens,
}: {
  title: string;
  screens: { step: string; href: Href; title: string; owner: string }[];
}) {
  const c = useColors();
  return (
    <View style={{ gap: 8 }}>
      <Txt variant="headline">{title}</Txt>
      <View style={{ borderRadius: radius.card, backgroundColor: c.card, overflow: 'hidden' }}>
        {screens.map((screen, index) => (
          <Press
            key={screen.step}
            scaleTo={0.99}
            onPress={() => router.replace(screen.href)}
            accessibilityLabel={`${screen.step} ${screen.title}`}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
                paddingHorizontal: 16,
                minHeight: 56,
                borderTopWidth: index ? 0.5 : 0,
                borderTopColor: c.separator,
              }}
            >
              <Txt variant="subheadline" tone="blue" weight="700" style={{ width: 40 }}>
                {screen.step}
              </Txt>
              <Txt variant="body" style={{ flex: 1 }}>
                {screen.title}
              </Txt>
              <Txt variant="footnote" tone="label2">
                {screen.owner}
              </Txt>
            </View>
          </Press>
        ))}
      </View>
    </View>
  );
}
