import { Text, type TextProps } from 'react-native';

import { text, useColors, type Palette } from '@/theme/tokens';

type Variant = keyof typeof text;
type Tone = 'label' | 'label2' | 'label3' | 'blue' | 'red' | 'green' | 'onTint' | 'stone' | 'gold' | 'goldInk';

type Props = TextProps & {
  /** the size from the iOS type ramp (see docs/design/kit/typography.png) */
  variant?: Variant;
  /** the colour name from the palette; never write a hex value */
  tone?: Tone;
  weight?: '400' | '500' | '600' | '700' | '800' | '900';
  align?: 'left' | 'center' | 'right';
};

/** All text goes through Txt: right size, right colour in light and dark mode, grows with the user's text size setting. */
export function Txt({ variant = 'body', tone = 'label', weight, align, style, ...rest }: Props) {
  const c: Palette = useColors();
  return <Text {...rest} style={[text[variant], { color: c[tone] }, weight && { fontWeight: weight }, align && { textAlign: align }, style]} />;
}
