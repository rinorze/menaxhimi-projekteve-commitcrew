import { router, type Href } from 'expo-router';
import { View } from 'react-native';

import { Button, Screen, Txt } from '@/components';
import { useT } from '@/lib/i18n';

type Props = {
  /** the screen's number in the design, e.g. "1.1" */
  step: string;
  /** screen title, as in the design */
  title: string;
  /** who builds this screen */
  owner: string;
  /** the design picture, relative to docs/design/screens, e.g. "01-onboarding/01-welcome.png" */
  design: string;
  /** the main button: the next screen in the onboarding chain */
  next?: Href;
  nextLabel?: string;
  /** other buttons on this screen that open a side path (guest map, Kthimi, sign in…) */
  also?: { href: Href; label: string }[];
};

/**
 * A stand-in for a screen that is not built yet. Replace the whole file's content with the real screen
 * when you build it (use Screen, Txt and Button from '@/components'); keep the file name and every button it has.
 */
export function ScreenPlaceholder({ step, title, owner, design, next, nextLabel, also = [] }: Props) {
  const t = useT();
  return (
    <Screen>
      <View style={{ flex: 1, gap: 8 }}>
        <Txt variant="footnote" tone="blue" weight="600">
          {step}
        </Txt>
        <Txt variant="largeTitle">{title}</Txt>
        <Txt variant="subheadline" tone="label2">
          {t({ sq: 'Ndërtohet nga', en: 'Built by' })} {owner} · docs/design/screens/{design}
        </Txt>
      </View>
      <View style={{ gap: 10 }}>
        {also.map((a) => (
          <Button key={a.label} label={a.label} variant="secondary" onPress={() => router.push(a.href)} />
        ))}
        {next ? <Button label={nextLabel ?? t({ sq: 'Vazhdo', en: 'Continue' })} onPress={() => router.push(next)} /> : null}
      </View>
    </Screen>
  );
}
