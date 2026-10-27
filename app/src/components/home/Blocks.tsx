import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { router, type Href } from 'expo-router';
import type { SFSymbol } from 'expo-symbols';
import { memo, useEffect, useMemo } from 'react';
import { Linking, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

import map from '@/data/kosovo-map.json';
import { events, getMunicipality, municipalities, places, quests, stamps, type Place } from '@/data';
import { placePhotos } from '@/data/photos';
import { useLang, useT, type Text } from '@/lib/i18n';
import { distanceTo, formatKm, nearestMunicipality, requestLocation, restoreLocation, useLocation } from '@/lib/location';
import { useWeather } from '@/lib/weather';
import { useColors, useIsDark } from '@/theme/tokens';
import { Button } from '../Button';
import { GlassButton } from '../GlassButton';
import { GlassIconButton } from '../GlassIconButton';
import { Icon } from '../Icon';
import { Press } from '../Press';
import { Txt } from '../Txt';

// Home, built from what 26 travel, maps, outdoor and social apps have in common (Airbnb, AllTrails, Polarsteps, Swarm,
// Google Maps, Apple Invites…): one search field, one row of category chips that really filter what is below, one big
// photo card, rails of places, one passport-style progress card, and a single accent colour (our ice blue).
// Real data only. Until accounts and unlocks exist (Card 2) the progress is 0 and says so.

const stamped = () => places.filter((p) => stamps[p.slug]);
const nameOf = (p: Place, lang: 'sq' | 'en') => (lang === 'sq' ? p.name_sq : p.name_en);

// ───────────────────────────── categories (chips) ─────────────────────────────

export type Filter = 'all' | 'peak' | 'waterfall' | 'fortress' | 'cave' | 'lake' | 'religious' | 'museum';

const FILTERS: { key: Filter; icon: SFSymbol; label: Text; one: Text }[] = [
  { key: 'all', icon: 'sparkles', label: { sq: 'Të gjitha', en: 'All' }, one: { sq: 'Vend', en: 'Place' } },
  { key: 'peak', icon: 'mountain.2.fill', label: { sq: 'Majat', en: 'Peaks' }, one: { sq: 'Majë', en: 'Peak' } },
  { key: 'waterfall', icon: 'drop.fill', label: { sq: 'Ujëvarat', en: 'Waterfalls' }, one: { sq: 'Ujëvarë', en: 'Waterfall' } },
  { key: 'fortress', icon: 'building.columns.fill', label: { sq: 'Kalatë', en: 'Fortresses' }, one: { sq: 'Kala', en: 'Fortress' } },
  { key: 'cave', icon: 'moon.fill', label: { sq: 'Shpellat', en: 'Caves' }, one: { sq: 'Shpellë', en: 'Cave' } },
  { key: 'lake', icon: 'water.waves', label: { sq: 'Liqenet', en: 'Lakes' }, one: { sq: 'Liqen', en: 'Lake' } },
  { key: 'religious', icon: 'moon.stars.fill', label: { sq: 'Të shenjta', en: 'Sacred' }, one: { sq: 'Vend i shenjtë', en: 'Sacred place' } },
  { key: 'museum', icon: 'photo.artframe', label: { sq: 'Muzetë', en: 'Museums' }, one: { sq: 'Muze', en: 'Museum' } },
];

const kindLabel = (p: Place): Text => FILTERS.find((f) => f.key === p.category)?.one ?? { sq: 'Vend', en: 'Place' };

export const inFilter = (p: Place, f: Filter) => f === 'all' || p.category === f;

// ───────────────────────────── header, search, chips ─────────────────────────────

/** Greeting by the real time of day, the title, and the two native Liquid Glass buttons. */
export function Header() {
  const t = useT();
  const insets = useSafeAreaInsets();
  const h = new Date().getHours();
  const hello = h < 12 ? t({ sq: 'Mirëmëngjes', en: 'Good morning' }) : h < 18 ? t({ sq: 'Mirëdita', en: 'Good afternoon' }) : t({ sq: 'Mirëmbrëma', en: 'Good evening' });
  return (
    <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
      <View style={{ flex: 1 }}>
        <Txt variant="subheadline" weight="600" tone="label2">
          {hello}
        </Txt>
        <Txt variant="largeTitle" weight="800" style={{ letterSpacing: -0.8 }}>
          {t({ sq: 'Zbulo Kosovën', en: 'Discover Kosovo' })}
        </Txt>
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <GlassIconButton name="bell" label={t({ sq: 'Njoftimet', en: 'Notifications' })} size={48} />
        <GlassIconButton name="person" label={t({ sq: 'Pasaporta jote', en: 'Your passport' })} size={48} onPress={() => router.navigate('/passport')} />
      </View>
    </View>
  );
}

export function SearchPill() {
  const t = useT();
  const c = useColors();
  const dark = useIsDark();
  return (
    <Press
      onPress={() => router.navigate('/search')}
      accessibilityLabel={t({ sq: 'Kërko', en: 'Search' })}
      scaleTo={0.985}
      style={[styles.search, { backgroundColor: dark ? c.card : '#FFFFFF', borderColor: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)' }]}
    >
      <Icon name="magnifyingglass" size={18} tone="label2" weight="semibold" />
      <Txt variant="body" tone="label2" numberOfLines={1} style={{ flex: 1 }}>
        {t({ sq: 'Kërko vende, qytete, ngjarje', en: 'Search places, cities, events' })}
      </Txt>
    </Press>
  );
}

/** Category chips. The one picked filters the places below it, with real counts. */
export function Chips({ value, onChange }: { value: Filter; onChange: (f: Filter) => void }) {
  const t = useT();
  const c = useColors();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
      {FILTERS.map((f) => {
        const on = f.key === value;
        const n = places.filter((p) => inFilter(p, f.key)).length;
        return (
          <Press
            key={f.key}
            onPress={() => {
              Haptics.selectionAsync();
              onChange(f.key);
            }}
            accessibilityLabel={`${t(f.label)}, ${n}`}
            accessibilityState={{ selected: on }}
            scaleTo={0.95}
            style={[styles.chip, { backgroundColor: on ? c.ice : c.fill }]}
          >
            <Icon name={f.icon} size={15} tone={on ? 'iceInk' : 'label'} />
            <Txt variant="subheadline" weight="700" tone={on ? 'iceInk' : 'label'}>
              {t(f.label)}
            </Txt>
          </Press>
        );
      })}
    </ScrollView>
  );
}

// ───────────────────────────── place of the day ─────────────────────────────

/** One big photo card, like the App Store's Today card: the place, the real weather there, and the two ways in. */
export function Today({ place }: { place: Place }) {
  const t = useT();
  const lang = useLang();
  const { width } = useWindowDimensions();
  const weather = useWeather(place.lat, place.lng);
  const loc = useLocation();
  const km = distanceTo(loc.coords, place);
  const muni = getMunicipality(place.municipality);
  const w = width - 32;
  return (
    <Press onPress={() => router.navigate('/map')} accessibilityLabel={nameOf(place, lang)} scaleTo={0.985} style={[styles.today, { width: w, height: Math.min(w * 1.25, 480) }]}>
      <Image source={placePhotos[place.slug]} contentFit="cover" transition={300} style={StyleSheet.absoluteFill} />
      <LinearGradient pointerEvents="none" colors={['rgba(0,0,0,0.38)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0.72)']} locations={[0, 0.25, 0.5, 1]} style={StyleSheet.absoluteFill} />
      <View style={styles.todayTop}>
        <Txt variant="footnote" weight="800" style={{ color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 1 }}>
          {t({ sq: 'Vendi i ditës', en: 'Place of the day' })}
        </Txt>
        {weather ? (
          <View style={styles.weather}>
            <Icon name={weather.symbol} size={14} tone="onTint" />
            <Txt variant="footnote" weight="700" style={{ color: '#FFFFFF', fontVariant: ['tabular-nums'] }}>
              {Math.round(weather.tempC)}°
            </Txt>
          </View>
        ) : null}
      </View>
      <View style={styles.todayBottom}>
        <Txt variant="title1" weight="800" numberOfLines={2} style={{ color: '#FFFFFF', fontSize: 34, lineHeight: 38, letterSpacing: -0.8 }}>
          {nameOf(place, lang)}
        </Txt>
        <Txt variant="callout" weight="500" style={{ color: 'rgba(255,255,255,0.85)', marginBottom: 14 }}>
          {[muni ? (lang === 'sq' ? muni.name_sq : muni.name_en) : '', t(kindLabel(place)), km === undefined ? '' : t({ sq: `${formatKm(km)} nga ti`, en: `${formatKm(km)} from you` })].filter(Boolean).join(' · ')}
        </Txt>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <GlassButton label={t({ sq: 'Shiko vendin', en: 'View place' })} icon="location.fill" onPress={() => router.navigate('/map')} />
          <GlassIconButton name="camera" label={t({ sq: 'Hape me një foto', en: 'Unlock with a photo' })} size={50} />
        </View>
      </View>
    </Press>
  );
}

// ───────────────────────────── rails ─────────────────────────────

export function Section({ title, link, to, children, first }: { title: string; link?: string; to?: Href; children: React.ReactNode; first?: boolean }) {
  const c = useColors();
  return (
    <View style={{ marginTop: first ? 20 : 32 }}>
      {title ? (
        <Press onPress={to ? () => router.navigate(to) : undefined} disabled={!to} accessibilityLabel={link ? `${title}, ${link}` : title} style={styles.sectionHead}>
          <Txt variant="title2" weight="800" style={{ letterSpacing: -0.4 }}>
            {title}
          </Txt>
          {to ? <Icon name="chevron.right" size={15} tone="label2" weight="bold" /> : null}
          {link ? (
            <Txt variant="subheadline" weight="600" style={{ color: c.label2, marginLeft: 'auto' }}>
              {link}
            </Txt>
          ) : null}
        </Press>
      ) : null}
      {children}
    </View>
  );
}

/** Places for the chosen category: photo cards first (Airbnb style), then a plain list for places without a photo yet. */
export function Popular({ filter }: { filter: Filter }) {
  const t = useT();
  const lang = useLang();
  const c = useColors();
  const list = useMemo(() => places.filter((p) => inFilter(p, filter)).sort((a, b) => b.score - a.score), [filter]);
  const withPhoto = list.filter((p) => placePhotos[p.slug]);
  const rest = list.filter((p) => !placePhotos[p.slug]).slice(0, 4);
  return (
    <View>
      {withPhoto.length ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 14 }}>
          {withPhoto.map((p) => {
            const muni = getMunicipality(p.municipality);
            return (
              <Press key={p.slug} accessibilityLabel={nameOf(p, lang)} style={{ width: 188 }} onPress={() => router.navigate('/map')}>
                <Image source={placePhotos[p.slug]} contentFit="cover" transition={250} style={styles.railPhoto} />
                <Txt variant="callout" weight="700" numberOfLines={1} style={{ marginTop: 9 }}>
                  {nameOf(p, lang)}
                </Txt>
                <Txt variant="footnote" tone="label2" numberOfLines={1}>
                  {[muni ? (lang === 'sq' ? muni.name_sq : muni.name_en) : '', t(kindLabel(p))].filter(Boolean).join(' · ')}
                </Txt>
              </Press>
            );
          })}
        </ScrollView>
      ) : null}
      {rest.length ? (
        <View style={[styles.list, { backgroundColor: c.surface, marginTop: withPhoto.length ? 18 : 0 }]}>
          {rest.map((p, i) => {
            const muni = getMunicipality(p.municipality);
            return (
              <Press key={p.slug} accessibilityLabel={nameOf(p, lang)} scaleTo={0.99} onPress={() => router.navigate('/map')} style={[styles.row, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.separator }]}>
                <View style={[styles.rowIcon, { backgroundColor: c.fill }]}>
                  <Icon name={FILTERS.find((f) => f.key === p.category)?.icon ?? 'mappin'} size={18} />
                </View>
                <View style={{ flex: 1 }}>
                  <Txt variant="callout" weight="700" numberOfLines={1}>
                    {nameOf(p, lang)}
                  </Txt>
                  <Txt variant="footnote" tone="label2" numberOfLines={1}>
                    {[muni ? (lang === 'sq' ? muni.name_sq : muni.name_en) : '', t(kindLabel(p))].filter(Boolean).join(' · ')}
                  </Txt>
                </View>
                <Icon name="chevron.right" size={13} tone="label3" />
              </Press>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}


// ───────────────────────────── near you ─────────────────────────────

/**
 * The places closest to you, with the real distance. Location is asked for once, when you tap, with the reason shown
 * first; it stays on the phone. Until then, and when it is refused, the block says so instead of showing made-up numbers.
 */
export function NearYou() {
  const t = useT();
  const lang = useLang();
  const c = useColors();
  const loc = useLocation();
  useEffect(() => {
    restoreLocation();
  }, []);
  const near = useMemo(() => (loc.coords ? places.map((p) => ({ p, km: distanceTo(loc.coords, p)! })).sort((a, b) => a.km - b.km).slice(0, 10) : []), [loc.coords]);

  if (loc.status === 'granted' && loc.coords) {
    const city = nearestMunicipality(loc.coords);
    return (
      <View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 20, marginTop: -4, marginBottom: 12 }}>
          <Icon name="location.fill" size={13} tone="label2" />
          <Txt variant="footnote" tone="label2">
            {t({ sq: `Komuna më e afërt: ${city.name_sq}`, en: `Closest municipality: ${city.name_en}` })}
          </Txt>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
          {near.map(({ p, km }) => {
            const muni = getMunicipality(p.municipality);
            return (
              <Press key={p.slug} accessibilityLabel={`${nameOf(p, lang)}, ${formatKm(km)}`} style={{ width: 150 }} onPress={() => router.navigate('/map')}>
                {placePhotos[p.slug] ? (
                  <Image source={placePhotos[p.slug]} contentFit="cover" transition={250} style={styles.nearPhoto} />
                ) : (
                  <View style={[styles.nearPhoto, { backgroundColor: c.surface, alignItems: 'center', justifyContent: 'center' }]}>
                    <Icon name={FILTERS.find((f) => f.key === p.category)?.icon ?? 'mappin'} size={30} tone="label3" />
                  </View>
                )}
                <Txt variant="callout" weight="700" numberOfLines={1} style={{ marginTop: 8 }}>
                  {nameOf(p, lang)}
                </Txt>
                <Txt variant="footnote" tone="label2" numberOfLines={1} style={{ fontVariant: ['tabular-nums'] }}>
                  {[formatKm(km), muni ? (lang === 'sq' ? muni.name_sq : muni.name_en) : ''].filter(Boolean).join(' · ')}
                </Txt>
              </Press>
            );
          })}
        </ScrollView>
      </View>
    );
  }

  const denied = loc.status === 'denied';
  const waiting = loc.status === 'asking' || loc.status === 'granted';
  return (
    <View style={[styles.card, { backgroundColor: c.surface, marginHorizontal: 16, padding: 18, gap: 14 }]}>
      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
        <View style={[styles.rowIcon, { backgroundColor: c.fill }]}>
          <Icon name={denied ? 'location.slash' : 'location'} size={19} />
        </View>
        <View style={{ flex: 1 }}>
          <Txt variant="headline" weight="700">
            {waiting ? t({ sq: 'Po e gjejmë ku je…', en: 'Finding where you are…' }) : denied ? t({ sq: 'Vendndodhja është e fikur', en: 'Location is off' }) : t({ sq: 'Shiko çfarë ka pranë teje', en: 'See what is near you' })}
          </Txt>
          <Txt variant="footnote" tone="label2">
            {denied
              ? t({ sq: 'Ndize te Cilësimet që të shohësh distancat.', en: 'Turn it on in Settings to see distances.' })
              : t({ sq: 'Përdoret vetëm në telefonin tënd. Shokët nuk e shohin kurrë pa lejen tënde.', en: 'Used only on your phone. Friends never see it without your permission.' })}
          </Txt>
        </View>
      </View>
      {waiting ? null : denied ? (
        <Button variant="secondary" label={t({ sq: 'Hap Cilësimet', en: 'Open Settings' })} onPress={() => Linking.openSettings()} />
      ) : (
        <Button variant="primary" icon="location.fill" label={t({ sq: 'Lejo vendndodhjen', en: 'Allow location' })} onPress={() => requestLocation()} />
      )}
    </View>
  );
}

// ───────────────────────────── your Kosovo ─────────────────────────────

function Ring({ value, total, label, sub }: { value: number; total: number; label: string; sub: string }) {
  const c = useColors();
  const r = 31;
  const len = 2 * Math.PI * r;
  const frac = total ? Math.min(value / total, 1) : 0;
  return (
    <View style={{ alignItems: 'center', flex: 1 }} accessible accessibilityLabel={`${label}, ${value} / ${total}`}>
      <View style={{ width: 80, height: 80, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={80} height={80} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
          <Circle cx={40} cy={40} r={r} stroke={c.fill} strokeWidth={9} fill="none" />
          <Circle cx={40} cy={40} r={r} stroke={c.ice} strokeWidth={9} fill="none" strokeLinecap="round" strokeDasharray={`${len * frac} ${len}`} />
        </Svg>
        <Txt variant="title3" weight="800" style={{ fontVariant: ['tabular-nums'] }}>
          {value}
        </Txt>
      </View>
      <Txt variant="footnote" weight="700" style={{ marginTop: 8 }}>
        {label}
      </Txt>
      <Txt variant="caption" tone="label2" style={{ fontVariant: ['tabular-nums'] }}>
        {sub}
      </Txt>
    </View>
  );
}

/** Passport-style progress (the Swarm and Fog of World idea): share of Kosovo explored, three rings, and what to do next. */
export function YourKosovo() {
  const t = useT();
  const c = useColors();
  const list = stamped();
  const munis = new Set(list.map((p) => p.municipality)).size;
  const pct = Math.round((list.length / places.length) * 100);
  return (
    <View style={[styles.card, { backgroundColor: c.surface, marginHorizontal: 16 }]}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, paddingTop: 18, paddingHorizontal: 20 }}>
        <Txt variant="largeTitle" weight="800" style={{ fontVariant: ['tabular-nums'] }}>
          {pct}%
        </Txt>
        <Txt variant="callout" weight="600" tone="label2">
          {t({ sq: 'e Kosovës e eksploruar', en: 'of Kosovo explored' })}
        </Txt>
      </View>
      <View style={{ flexDirection: 'row', paddingTop: 16, paddingHorizontal: 8 }}>
        <Ring value={list.length} total={places.length} label={t({ sq: 'Vende', en: 'Places' })} sub={`/ ${places.length}`} />
        <Ring value={munis} total={38} label={t({ sq: 'Komuna', en: 'Municipalities' })} sub="/ 38" />
        <Ring value={0} total={quests.length} label={t({ sq: 'Sfida', en: 'Quests' })} sub={`/ ${quests.length}`} />
      </View>
      <View style={styles.cta}>
        <View style={{ flex: 1 }}>
          <Txt variant="headline" weight="700">
            {list.length ? t({ sq: 'Vazhdo eksplorimin', en: 'Keep exploring' }) : t({ sq: 'Vula e parë të pret', en: 'Your first stamp is waiting' })}
          </Txt>
          <Txt variant="footnote" tone="label2">
            {t({ sq: 'Shko te një vend dhe hape me kamerë.', en: 'Go to a place and unlock it with the camera.' })}
          </Txt>
        </View>
        <GlassIconButton name="camera" label={t({ sq: 'Hape me një foto', en: 'Unlock with a photo' })} size={50} />
      </View>
    </View>
  );
}

/** The quests, as small cards with a real progress bar. */
export function Quests() {
  const lang = useLang();
  const t = useT();
  const c = useColors();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
      {quests.map((q) => {
        const title = lang === 'sq' ? q.title_sq : q.title_en;
        return (
          <Press key={q.slug} accessibilityLabel={`${title}, 0/${q.target}`} style={[styles.quest, { backgroundColor: c.surface }]}>
            <View style={[styles.rowIcon, { backgroundColor: c.ice }]}>
              <Icon name="flag.fill" size={18} tone="iceInk" />
            </View>
            <Txt variant="headline" weight="700" numberOfLines={2} style={{ marginTop: 10, minHeight: 44 }}>
              {title}
            </Txt>
            <View style={[styles.bar, { backgroundColor: c.fill }]} />
            <Txt variant="caption" tone="label2" style={{ marginTop: 6, fontVariant: ['tabular-nums'] }}>
              {t({ sq: `0 nga ${q.target} vula`, en: `0 of ${q.target} stamps` })}
            </Txt>
          </Press>
        );
      })}
    </ScrollView>
  );
}

// ───────────────────────────── municipalities ─────────────────────────────

const shapes = map.municipalities.map((m) => {
  const nums = m.d.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? [];
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (let i = 0; i + 1 < nums.length; i += 2) {
    x0 = Math.min(x0, nums[i]);
    x1 = Math.max(x1, nums[i]);
    y0 = Math.min(y0, nums[i + 1]);
    y1 = Math.max(y1, nums[i + 1]);
  }
  const side = Math.max(x1 - x0, y1 - y0) + 2;
  return { slug: m.slug, d: m.d, view: `${(x0 + x1) / 2 - side / 2} ${(y0 + y1) / 2 - side / 2} ${side} ${side}` };
});

const Silhouette = memo(function Silhouette({ d, view, fill }: { d: string; view: string; fill: string }) {
  return (
    <Svg width={52} height={52} viewBox={view}>
      <Path d={d} fill={fill} />
    </Svg>
  );
});

/** All 38 municipalities, A to Z, each as its own shape cut from the real map; stamped ones are ice blue. */
export function Komunat() {
  const lang = useLang();
  const c = useColors();
  const visited = new Set(stamped().map((p) => p.municipality));
  const list = useMemo(
    () =>
      municipalities
        .map((m) => ({ m, shape: shapes.find((x) => x.slug === m.slug) }))
        .filter((x) => x.shape)
        .sort((a, b) => (lang === 'sq' ? a.m.name_sq : a.m.name_en).localeCompare(lang === 'sq' ? b.m.name_sq : b.m.name_en, lang)),
    [lang],
  );
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}>
      {list.map(({ m, shape }) => {
        const on = visited.has(m.slug);
        const label = lang === 'sq' ? m.name_sq : m.name_en;
        return (
          <View key={m.slug} style={[styles.komuna, { backgroundColor: c.surface }]} accessible accessibilityLabel={`${label}${on ? ', ✓' : ''}`}>
            <Silhouette d={shape!.d} view={shape!.view} fill={on ? c.ice : c.fillStrong} />
            <Txt variant="caption" weight={on ? '800' : '600'} numberOfLines={1} style={{ marginTop: 6 }}>
              {label}
            </Txt>
          </View>
        );
      })}
    </ScrollView>
  );
}

// ───────────────────────────── events ─────────────────────────────

/** The next real events, with how long is left. Tentative ones say the date is still to confirm. */
export function ComingUpList() {
  const t = useT();
  const lang = useLang();
  const c = useColors();
  const locale = lang === 'sq' ? 'sq-AL' : 'en-GB';
  const now = new Date();
  const list = events.filter((e) => new Date(e.ends_at) >= now).sort((a, b) => a.starts_at.localeCompare(b.starts_at)).slice(0, 4);
  return (
    <View style={[styles.list, { backgroundColor: c.surface }]}>
      {list.map((e, i) => {
        const d = new Date(e.starts_at);
        const city = getMunicipality(e.municipality);
        const days = Math.ceil((d.getTime() - now.getTime()) / 86_400_000);
        const when = days <= 0 ? t({ sq: 'sot', en: 'now' }) : days === 1 ? t({ sq: 'nesër', en: 'tomorrow' }) : t({ sq: `pas ${days} ditësh`, en: `in ${days} days` });
        const sub = [city ? (lang === 'sq' ? city.name_sq : city.name_en) : '', e.tentative ? t({ sq: 'data e pasigurt', en: 'date tbc' }) : when].filter(Boolean).join(' · ');
        return (
          <Press key={e.slug} accessibilityLabel={lang === 'sq' ? e.title_sq : e.title_en} scaleTo={0.99} style={[styles.row, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.separator }]}>
            <View style={[styles.date, { backgroundColor: c.ice }]}>
              <Txt variant="caption" weight="800" tone="iceInk" style={{ textTransform: 'uppercase' }}>
                {d.toLocaleDateString(locale, { month: 'short' }).replace('.', '')}
              </Txt>
              <Txt variant="title3" weight="800" tone="iceInk" style={{ lineHeight: 24 }}>
                {d.getDate()}
              </Txt>
            </View>
            <View style={{ flex: 1 }}>
              <Txt variant="callout" weight="700" numberOfLines={1}>
                {lang === 'sq' ? e.title_sq : e.title_en}
              </Txt>
              <Txt variant="footnote" tone="label2" numberOfLines={1}>
                {sub}
              </Txt>
            </View>
            <Icon name="chevron.right" size={13} tone="label3" />
          </Press>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 10 },
  search: { marginHorizontal: 16, marginTop: 6, height: 54, borderRadius: 27, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, shadowColor: '#000000', shadowOpacity: 0.08, shadowRadius: 14, shadowOffset: { width: 0, height: 4 } },
  chip: { height: 40, paddingHorizontal: 14, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 6 },
  today: { alignSelf: 'center', borderRadius: 32, borderCurve: 'continuous', overflow: 'hidden', backgroundColor: '#1C2233' },
  todayTop: { position: 'absolute', top: 20, left: 22, right: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  weather: { height: 30, paddingHorizontal: 11, borderRadius: 15, backgroundColor: 'rgba(0,0,0,0.32)', flexDirection: 'row', alignItems: 'center', gap: 5 },
  todayBottom: { position: 'absolute', left: 22, right: 22, bottom: 22 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 20, marginBottom: 12, minHeight: 32 },
  railPhoto: { width: 188, height: 236, borderRadius: 22, borderCurve: 'continuous' },
  nearPhoto: { width: 150, height: 150, borderRadius: 20, borderCurve: 'continuous' },
  list: { marginHorizontal: 16, borderRadius: 24, borderCurve: 'continuous', overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 14 },
  rowIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  card: { borderRadius: 28, borderCurve: 'continuous', overflow: 'hidden' },
  cta: { margin: 14, marginTop: 20, flexDirection: 'row', alignItems: 'center', gap: 12 },
  quest: { width: 176, borderRadius: 22, borderCurve: 'continuous', padding: 14 },
  bar: { height: 6, borderRadius: 3, marginTop: 10 },
  komuna: { width: 92, borderRadius: 20, borderCurve: 'continuous', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 4 },
  date: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
});
