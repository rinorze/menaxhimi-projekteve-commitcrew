import type { SFSymbol } from 'expo-symbols';

import { Glass } from './Glass';
import { Icon } from './Icon';
import { Press } from './Press';

/** A round 44 pt Liquid Glass button with an SF Symbol (bell, ghost mode, back…). */
export function GlassIconButton({ name, label, onPress, size = 44 }: { name: SFSymbol; label: string; onPress?: () => void; size?: number }) {
  return (
    <Press onPress={onPress} accessibilityLabel={label} scaleTo={0.92}>
      <Glass interactive style={{ width: size, height: size, borderRadius: size / 2, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <Icon name={name} size={20} />
      </Glass>
    </Press>
  );
}
