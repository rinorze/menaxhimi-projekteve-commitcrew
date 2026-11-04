import { useState } from 'react';
import { View } from 'react-native';

import { Button, Chip, Glass, Icon, ProgressDots, Screen, Txt } from '@/components';
import { setLang, useLang, useT } from '@/lib/i18n';
import { radius, useColors } from '@/theme/tokens';

// A page for the team: every shared component with an example of how to use it.
// Open it from Home ("Komponentet"). Switch your iPhone to dark mode to check both looks.
export default function ComponentGallery() {
  const t = useT();
  const lang = useLang();
  const c = useColors();
  const [chip, setChip] = useState('Ujëvara');
  const [step, setStep] = useState(3);

  return (
    <Screen scroll>
      <View style={{ gap: 28 }}>
        <View style={{ gap: 6 }}>
          <Txt variant="largeTitle">{t({ sq: 'Komponentet', en: 'Components' })}</Txt>
          <Txt variant="subheadline" tone="label2">
            {t({ sq: 'Ndërtohen nga Rinori. Përdori në çdo ekran.', en: 'Built by Rinor. Use them on every screen.' })}
          </Txt>
        </View>

        <Section title="Gjuha · useT()">
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Chip label="Shqip" selected={lang === 'sq'} onPress={() => setLang('sq')} />
            <Chip label="English" selected={lang === 'en'} onPress={() => setLang('en')} />
          </View>
          <Txt variant="callout" tone="label2">
            {t({ sq: 'Ky tekst është shqip. Ndërro gjuhën lart.', en: 'This text is English. Change the language above.' })}
          </Txt>
        </Section>

        <Section title="Txt · variant">
          <Txt variant="largeTitle">Large title 34</Txt>
          <Txt variant="title2">Title 2 · 22</Txt>
          <Txt variant="headline">Headline 17 · 600</Txt>
          <Txt variant="body">Body 17</Txt>
          <Txt variant="subheadline" tone="label2">Subheadline 15, label2</Txt>
          <Txt variant="footnote" tone="label2">Footnote 13, label2</Txt>
          <Txt variant="footnote" tone="stone">Vend i shenjtë · vizito në heshtje (stone)</Txt>
        </Section>

        <Section title="Button · variant">
          <Button label={t({ sq: 'Vazhdo', en: 'Continue' })} />
          <Button label={t({ sq: 'Shiko përreth', en: 'Look around' })} variant="secondary" icon="map" />
          <Button label={t({ sq: 'Kalo', en: 'Skip' })} variant="text" />
          <Button label={t({ sq: 'Hap vendin', en: 'Unlock' })} variant="reward" icon="camera" />
          <Button label={t({ sq: 'I çaktivizuar', en: 'Disabled' })} disabled />
        </Section>

        <Section title="Chip · selected">
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {['Ujëvara', 'Kala', 'Maja', 'Shpella', 'Liqene'].map((x) => (
              <Chip key={x} label={x} selected={chip === x} onPress={() => setChip(x)} />
            ))}
          </View>
        </Section>

        <Section title="ProgressDots · step / total">
          <ProgressDots step={step} total={7} />
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Chip label="−" onPress={() => setStep((s) => Math.max(1, s - 1))} />
            <Chip label="+" onPress={() => setStep((s) => Math.min(7, s + 1))} />
          </View>
        </Section>

        <Section title="Icon · SF Symbols">
          <View style={{ flexDirection: 'row', gap: 22 }}>
            <Icon name="house.fill" size={26} />
            <Icon name="map.fill" size={26} />
            <Icon name="book.closed.fill" size={26} />
            <Icon name="person.2.fill" size={26} />
            <Icon name="location.fill" size={26} tone="blue" />
            <Icon name="star.fill" size={26} tone="gold" />
          </View>
        </Section>

        <Section title="Glass · only on controls">
          <View style={{ height: 120, borderRadius: radius.card, backgroundColor: c.blue, alignItems: 'center', justifyContent: 'center' }}>
            <Glass interactive style={{ height: 44, paddingHorizontal: 18, borderRadius: radius.pill, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Icon name="location.fill" size={16} />
              <Txt variant="subheadline" weight="600">Prizren · 14°</Txt>
            </Glass>
          </View>
        </Section>
      </View>
    </Screen>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 12 }}>
      <Txt variant="footnote" tone="label2" weight="600" style={{ textTransform: 'uppercase' }}>
        {title}
      </Txt>
      {children}
    </View>
  );
}
