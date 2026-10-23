import { StyleSheet, View } from 'react-native';

import { minTouch, radius, useColors } from '@/theme/tokens';
import { Glass } from './Glass';
import { Icon } from './Icon';
import { Press } from './Press';
import { Txt } from './Txt';

import type { SFSymbol } from 'expo-symbols';

type Props = {
  label: string;
  onPress?: () => void;
  /**
   * primary   = black (white in dark mode), the main action of a screen
   * secondary = soft grey
   * text      = just blue text
   * reward    = gold. ONLY when the user is about to earn a stamp (Unlock inside the circle)
   * glass     = Liquid Glass, for buttons floating over photos or maps
   */
  variant?: 'primary' | 'secondary' | 'text' | 'reward' | 'glass';
  icon?: SFSymbol;
  disabled?: boolean;
  /** stretch to the full width (default) or hug the text */
  fullWidth?: boolean;
};

const HEIGHT = minTouch + 6; // 50 pt

export function Button({ label, onPress, variant = 'primary', icon, disabled, fullWidth = true }: Props) {
  const c = useColors();
  const bg = variant === 'primary' ? c.tint : variant === 'secondary' ? c.fill : variant === 'reward' ? c.gold : 'transparent';
  const fg = variant === 'primary' ? 'onTint' : variant === 'reward' ? 'goldInk' : variant === 'text' ? 'blue' : 'label';
  if (variant === 'glass') {
    return (
      <Press onPress={onPress} disabled={disabled} accessibilityLabel={label} scaleTo={0.96} style={[fullWidth && styles.full, { opacity: disabled ? 0.4 : 1 }]}>
        <Glass interactive style={[styles.base, styles.glassRow]}>
          {icon ? <Icon name={icon} size={18} weight="semibold" /> : null}
          <Txt variant="headline">{label}</Txt>
        </Glass>
      </Press>
    );
  }
  return (
    <Press
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      style={[styles.base, { backgroundColor: bg, opacity: disabled ? 0.4 : 1 }, fullWidth && styles.full]}
    >
      <View style={styles.row}>
        {icon ? <Icon name={icon} size={18} tone={fg} weight="semibold" /> : null}
        <Txt variant="headline" tone={fg}>
          {label}
        </Txt>
      </View>
    </Press>
  );
}

const styles = StyleSheet.create({
  base: { minHeight: HEIGHT, borderRadius: radius.pill, paddingHorizontal: 22, alignItems: 'center', justifyContent: 'center' },
  full: { alignSelf: 'stretch' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  glassRow: { flexDirection: 'row', gap: 8, overflow: 'hidden' },
});
