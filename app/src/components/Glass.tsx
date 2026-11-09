import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useIsDark } from '@/theme/tokens';

type Props = {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** true when the glass is a button the user can press */
  interactive?: boolean;
};

const native = Platform.OS === 'ios' && isLiquidGlassAvailable();

/**
 * Liquid Glass on iPhones with iOS 26, a soft translucent surface everywhere else.
 * Use it only for controls (buttons, bars, chips on photos), never for content, and never glass on glass.
 */
export function Glass({ children, style, interactive = false }: Props) {
  const dark = useIsDark();
  if (native) {
    return (
      <GlassView glassEffectStyle="regular" isInteractive={interactive} style={style}>
        {children}
      </GlassView>
    );
  }
  return (
    <View
      style={[
        { backgroundColor: dark ? 'rgba(44,44,48,0.72)' : 'rgba(255,255,255,0.78)', borderColor: dark ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.9)', borderWidth: StyleSheet.hairlineWidth },
        style,
      ]}
    >
      {children}
    </View>
  );
}
