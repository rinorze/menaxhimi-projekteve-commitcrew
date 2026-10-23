import { router } from 'expo-router';
import { View } from 'react-native';

import { Press, Screen, Txt } from '@/components';
import { onboardingScreens } from '@/lib/screens';
import { radius, useColors } from '@/theme/tokens';

// All 14 onboarding screens in the order of the design. Tap one to open it.
export default function AllScreens() {
  const c = useColors();
  return (
    <Screen scroll grouped>
      <View style={{ gap: 6, marginBottom: 16 }}>
        <Txt variant="largeTitle">Të gjitha ekranet</Txt>
        <Txt variant="subheadline" tone="label2">
          1.1 deri 1.14, sipas dizajnit · docs/design/screens/01-onboarding
        </Txt>
      </View>
      <View style={{ borderRadius: radius.card, backgroundColor: c.card, overflow: 'hidden' }}>
        {onboardingScreens.map((s, i) => (
          <Press key={s.step} scaleTo={0.99} onPress={() => router.replace(s.href)} accessibilityLabel={`${s.step} ${s.title}`}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, minHeight: 56, borderTopWidth: i ? 0.5 : 0, borderTopColor: c.separator }}>
              <Txt variant="subheadline" tone="blue" weight="700" style={{ width: 40 }}>
                {s.step}
              </Txt>
              <Txt variant="body" style={{ flex: 1 }}>
                {s.title}
              </Txt>
              <Txt variant="footnote" tone="label2">
                {s.owner}
              </Txt>
            </View>
          </Press>
        ))}
      </View>
    </Screen>
  );
}
