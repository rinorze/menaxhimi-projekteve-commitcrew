import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withRepeat, withSpring, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Defs, Path, Pattern, Rect } from 'react-native-svg';

import map from '@/data/kosovo-map.json';
import { motion, useIsDark } from '@/theme/tokens';

const BLUE = '#2F62F5';
const [, , VW, VH] = map.viewBox.split(' ').map(Number);

/**
 * The 38 municipalities. Explored ones are solid, the one you are in is blue, the rest sit under slowly
 * moving dotted fog ("fog of the unexplored"). It settles in once when the screen opens.
 */
export function KosovoMap({ width, visited, current }: { width: number; visited: Set<string>; current?: string }) {
  const dark = useIsDark();
  const reduce = useReducedMotion();
  const height = (width * VH) / VW;
  const fog = useSharedValue(0.6);
  const enter = useSharedValue(0);
  useEffect(() => {
    enter.value = withSpring(1, motion.gentle);
    if (!reduce) fog.value = withRepeat(withTiming(0.95, { duration: 2500, easing: Easing.inOut(Easing.quad) }), -1, true);
  }, [enter, fog, reduce]);
  const fogStyle = useAnimatedStyle(() => ({ opacity: fog.value }));
  const enterStyle = useAnimatedStyle(() => ({ opacity: enter.value, transform: [{ scale: 0.94 + enter.value * 0.06 }] }));

  const fogFill = dark ? '#2C2C30' : '#E3E7EE';
  const inkFill = dark ? '#F2F2F7' : '#14161C';
  const stroke = dark ? '#1C1C1E' : '#FFFFFF';
  const unexplored = map.municipalities.filter((m) => !visited.has(m.slug) && m.slug !== current);

  return (
    <Animated.View style={[{ width, height }, enterStyle]} accessible accessibilityLabel={`Kosova, ${visited.size} / 38 komuna`}>
      <Svg width={width} height={height} viewBox={map.viewBox}>
        {map.municipalities.map((m) => (
          <Path key={m.slug} d={m.d} fill={m.slug === current ? BLUE : visited.has(m.slug) ? inkFill : fogFill} stroke={stroke} strokeWidth={1.3} strokeLinejoin="round" />
        ))}
      </Svg>
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, fogStyle]}>
        <Svg width={width} height={height} viewBox={map.viewBox}>
          <Defs>
            <Pattern id="fog" width={6} height={6} patternUnits="userSpaceOnUse">
              <Rect width={6} height={6} fill="transparent" />
              <Circle cx={1.5} cy={1.5} r={0.9} fill={dark ? 'rgba(255,255,255,0.12)' : 'rgba(20,30,60,0.12)'} />
            </Pattern>
          </Defs>
          {unexplored.map((m) => (
            <Path key={m.slug} d={m.d} fill="url(#fog)" />
          ))}
        </Svg>
      </Animated.View>
    </Animated.View>
  );
}
