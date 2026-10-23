import { StyleSheet, View } from 'react-native';

import { useT } from '@/lib/i18n';
import { useColors } from '@/theme/tokens';
import { Icon } from '../Icon';
import { Press } from '../Press';
import { Txt } from '../Txt';

/** Weeks in a row with at least one stamp, and this week's seven days. Empty until the first stamp. */
export function StreakStrip({ weeks, doneDays }: { weeks: number; doneDays: boolean[] }) {
  const t = useT();
  const c = useColors();
  const today = (new Date().getDay() + 6) % 7;
  const letters = t({ sq: 'HMMEPSD', en: 'MTWTFSS' }).split('');
  const title = weeks ? t({ sq: `${weeks} javë`, en: `${weeks} ${weeks === 1 ? 'week' : 'weeks'}` }) : t({ sq: 'Nis një seri', en: 'Start a streak' });
  const sub = weeks ? t({ sq: 'seri', en: 'streak' }) : t({ sq: '1 vulë në javë', en: '1 stamp a week' });
  return (
    <Press accessibilityLabel={`${title}, ${sub}`} style={[styles.card, { backgroundColor: c.card }]}>
      <Icon name="flame.fill" size={26} tone={weeks ? 'blue' : 'label3'} />
      <View style={{ width: 92 }}>
        <Txt variant="headline" weight="800" numberOfLines={1}>
          {title}
        </Txt>
        <Txt variant="caption" tone="label2" numberOfLines={1}>
          {sub}
        </Txt>
      </View>
      <View style={styles.days}>
        {letters.map((l, i) => {
          const done = doneDays[i];
          const isToday = i === today;
          return (
            <View key={i} style={{ alignItems: 'center', gap: 4 }}>
              <View style={[styles.day, done ? { backgroundColor: c.label } : { borderColor: isToday ? c.blue : c.label3, borderWidth: isToday ? 2.5 : 1.5, borderStyle: isToday ? 'solid' : 'dashed' }]}>
                {done ? <Icon name="checkmark" size={11} tone="bg" weight="bold" /> : null}
              </View>
              <Txt variant="caption" weight="700" tone={isToday ? 'blue' : 'label2'}>
                {l}
              </Txt>
            </View>
          );
        })}
      </View>
    </Press>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: 16, height: 62, borderRadius: 22, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 8 },
  days: { flex: 1, flexDirection: 'row', justifyContent: 'space-between' },
  day: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
});
