import { StyleSheet } from 'react-native';

import { radius, useColors } from '@/theme/tokens';
import { Press } from './Press';
import { Txt } from './Txt';

type Props = {
  label: string;
  /** selected chips are filled black (white in dark mode) */
  selected?: boolean;
  onPress?: () => void;
};

/** A pill to pick one option or filter (interests, language, map filters). 44 pt tall so it is easy to hit. */
export function Chip({ label, selected = false, onPress }: Props) {
  const c = useColors();
  return (
    <Press
      onPress={onPress}
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      scaleTo={0.95}
      style={[styles.chip, { backgroundColor: selected ? c.tint : c.fill }]}
    >
      <Txt variant="subheadline" weight="600" tone={selected ? 'onTint' : 'label'}>
        {label}
      </Txt>
    </Press>
  );
}

const styles = StyleSheet.create({
  chip: { minHeight: 44, paddingHorizontal: 16, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
});
