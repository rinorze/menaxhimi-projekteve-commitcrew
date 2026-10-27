import { SymbolView, type SFSymbol } from 'expo-symbols';

import { useColors, type Palette } from '@/theme/tokens';

type Props = {
  /** SF Symbol name; browse all names in the free SF Symbols app (https://developer.apple.com/sf-symbols/) */
  name: SFSymbol;
  size?: number;
  tone?: keyof Palette;
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
};

/** Apple's own icons. One weight and style across the whole app (docs/design/README.md). */
export function Icon({ name, size = 22, tone = 'label', weight = 'medium' }: Props) {
  const c = useColors();
  return <SymbolView name={name} size={size} tintColor={c[tone]} weight={weight} />;
}
