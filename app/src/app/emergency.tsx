
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { radius, space, useColors } from '@/theme/tokens';


type Language = 'sq' | 'en';

type Translation = {
  title: string;
  call: string;
  police: string;
  fire: string;
  ambulance: string;
  sendSms: string;
  nearest: string;
  locating: string;
  noLocation: string;
  noHospital: string;
  smsBody: string;
  sources: string;
  toConfirm: string;
  back: string;
  walkingDirections: string;
};

const TEXT: Record<Language, Translation> = {
  sq: {
    title: 'Emergjenca',
    call: 'Thirr numrin e emergjencës',
    police: 'Policia',
    fire: 'Zjarrfikësit',
    ambulance: 'Ambulanca',
    sendSms: 'Dërgo vendndodhjen me SMS',
    nearest: 'Spitali më i afërt',
    locating: 'Duke gjetur vendndodhjen…',
    noLocation: 'Vendndodhja nuk është e disponueshme',
    noHospital: 'Nuk u gjet spital afër',
    smsBody: 'Kam nevojë për ndihmë. Vendndodhja ime:',
    sources:
      '© OpenStreetMap contributors · Numrat: GOV.UK, Ambasada e Italisë në Prishtinë',
    toConfirm: 'për t’u konfirmuar',
    back: 'Kthehu',
    walkingDirections: 'Udhëzime në këmbë për',
  },

  en: {
    title: 'Emergency',
    call: 'Call the emergency number',
    police: 'Police',
    fire: 'Fire brigade',
    ambulance: 'Ambulance',
    sendSms: 'Send location by SMS',
    nearest: 'Nearest hospital',
    locating: 'Finding your location…',
    noLocation: 'Location unavailable',
    noHospital: 'No hospital found nearby',
    smsBody: 'I need help. My location:',
    sources:
      '© OpenStreetMap contributors · Numbers: GOV.UK, Italian Embassy in Pristina',
    toConfirm: 'to be confirmed',
    back: 'Back',
    walkingDirections: 'Walking directions to',
  },
};

const LANG: Language = 'sq';

const t = (key: keyof Translation) => TEXT[LANG][key];

type Hospital = {
  name: string;
  km: number;
};

type OverpassElement = {
  lat?: number;
  lon?: number;
  center?: {
    lat: number;
    lon: number;
  };
  tags?: {
    name?: string;
    'name:sq'?: string;
  };
};

const NUMBERS = [
  {
    n: '192',
    icon: 'shield-checkmark-outline',
    label: 'police',
  },
  {
    n: '193',
    icon: 'flame-outline',
    label: 'fire',
  },
  {
    n: '194',
    icon: 'medical-outline',
    label: 'ambulance',
  },
] as const;

function distanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const r = Math.PI / 180;

  const h =
    Math.sin(((lat2 - lat1) * r) / 2) ** 2 +
    Math.cos(lat1 * r) *
      Math.cos(lat2 * r) *
      Math.sin(((lon2 - lon1) * r) / 2) ** 2;

  return 12742 * Math.asin(Math.sqrt(h));
}

async function fetchHospitals(
  lat: number,
  lon: number,
): Promise<Hospital[]> {
  const query = `
    [out:json][timeout:15];
    nwr["amenity"="hospital"](around:15000,${lat},${lon});
    out center 10;
  `;

  const response = await fetch(
    'https://overpass-api.de/api/interpreter',
    {
      method: 'POST',
      body: query,
    },
  );

  if (!response.ok) {
    throw new Error('Failed to fetch hospitals');
  }

  const json: { elements: OverpassElement[] } =
    await response.json();

  return json.elements
    .map((element) => {
      const hospitalLat = element.lat ?? element.center?.lat;
      const hospitalLon = element.lon ?? element.center?.lon;

      if (hospitalLat === undefined || hospitalLon === undefined) {
        return null;
      }

      return {
        name:
          element.tags?.['name:sq'] ??
          element.tags?.name ??
          'Spital',
        km: distanceKm(lat, lon, hospitalLat, hospitalLon),
      };
    })
    .filter((hospital): hospital is Hospital => hospital !== null)
    .sort((a, b) => a.km - b.km)
    .slice(0, 2);
}

export default function Emergency() {
  const c = useColors();
  const router = useRouter();

  const [coords, setCoords] = useState<{
    lat: number;
    lon: number;
  } | null>(null);

  const [place, setPlace] = useState('');
  const [hospitals, setHospitals] = useState<Hospital[] | null>(null);
  const [locError, setLocError] = useState(false);

  useEffect(() => {
    let active = true;

    const getLocation = async () => {
      try {
        const { status } =
          await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          if (active) setLocError(true);
          return;
        }

        const position = await Location.getCurrentPositionAsync({});

        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        if (!active) return;

        setCoords({ lat, lon });

        try {
          const [address] = await Location.reverseGeocodeAsync({
            latitude: lat,
            longitude: lon,
          });

          if (active) {
            setPlace(
              [address?.street ?? address?.name, address?.city]
                .filter(Boolean)
                .join(', '),
            );
          }
        } catch {
          // Reverse geocoding is optional.
        }

        try {
          const result = await fetchHospitals(lat, lon);

          if (active) setHospitals(result);
        } catch {
          if (active) setHospitals([]);
        }
      } catch {
        if (active) {
          setLocError(true);
          setHospitals([]);
        }
      }
    };

    getLocation();

    return () => {
      active = false;
    };
  }, []);

  const call = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

  const sendSms = () => {
    if (!coords) return;

    const mapLink =
      `https://maps.google.com/?q=${coords.lat},${coords.lon}`;

    const body = `${t('smsBody')} ${mapLink}`;

    Linking.openURL(`sms:?body=${encodeURIComponent(body)}`);
  };

  const walkTo = (name: string) => {
    Linking.openURL(
      `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(name)}&travelmode=walking`,
    );
  };

  // Colors from theme/tokens.ts
  const card = {
    backgroundColor: c.card,
    borderRadius: radius.card,
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: c.bg,
      }}
      contentContainerStyle={{
        padding: space.lg,
        paddingTop: 64,
        gap: space.sm,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: space.md,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel={t('back')}
          style={{
            width: 56,
            height: 56,
            borderRadius: radius.pill,
            backgroundColor: c.card,
            alignItems: 'center',
            justifyContent: 'center',
            elevation: 3,
          }}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={c.label}
          />
        </Pressable>

        <Text
          style={{
            flex: 1,
            textAlign: 'center',
            marginRight: 56,
            fontSize: 18,
            fontWeight: '600',
            color: c.label,
          }}
        >
          {t('title')}
        </Text>
      </View>

      {/* Emergency 112 */}
      <Pressable
        onPress={() => call('112')}
        accessibilityRole="button"
        accessibilityLabel={`${t('call')} 112`}
        style={{
          backgroundColor: c.red,
          borderRadius: radius.sheet,
          paddingVertical: space.xl,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: space.md,
        }}
      >
        <Ionicons
          name="call-outline"
          size={44}
          color="#FFFFFF"
        />

        <View>
          <Text
            style={{
              color: '#FFFFFF',
              fontSize: 52,
              fontWeight: '700',
              lineHeight: 56,
            }}
          >
            112
          </Text>

          <Text
            style={{
              color: '#FFFFFF',
              fontSize: 15,
              fontWeight: '600',
            }}
          >
            {t('call')}
          </Text>
        </View>
      </Pressable>

      {/* Police / Fire / Ambulance */}
      <View
        style={{
          flexDirection: 'row',
          gap: space.sm,
        }}
      >
        {NUMBERS.map((item) => (
          <Pressable
            key={item.n}
            onPress={() => call(item.n)}
            accessibilityRole="button"
            accessibilityLabel={`${t(item.label)} ${item.n}`}
            style={[
              card,
              {
                flex: 1,
                alignItems: 'center',
                paddingVertical: space.md,
                gap: space.xs,
              },
            ]}
          >
            <Ionicons
              name={item.icon}
              size={24}
              color={c.label}
            />

            <Text
              style={{
                fontSize: 24,
                fontWeight: '700',
                color: c.label,
              }}
            >
              {item.n}
            </Text>

            <Text
              style={{
                fontSize: 14,
                color: c.label,
              }}
            >
              {t(item.label)}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* SMS */}
      <Pressable
        onPress={sendSms}
        disabled={!coords}
        accessibilityRole="button"
        accessibilityLabel={t('sendSms')}
        style={[
          card,
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: space.sm,
            paddingVertical: space.lg,
            opacity: coords ? 1 : 0.5,
          },
        ]}
      >
        <Ionicons
          name="paper-plane-outline"
          size={22}
          color={c.label}
        />

        <Text
          style={{
            fontSize: 17,
            fontWeight: '600',
            color: c.label,
          }}
        >
          {t('sendSms')}
        </Text>
      </Pressable>

      {/* Coordinates */}
      <View
        style={[
          card,
          {
            padding: space.lg,
            gap: space.xs,
          },
        ]}
      >
        {coords ? (
          <>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: c.label,
              }}
            >
              {coords.lat.toFixed(5)}, {coords.lon.toFixed(5)}
            </Text>

            {!!place && (
              <Text style={{ color: c.label2 }}>
                {place}
              </Text>
            )}
          </>
        ) : (
          <Text style={{ color: c.label2 }}>
            {locError ? t('noLocation') : t('locating')}
          </Text>
        )}
      </View>

      {/* Nearest hospitals */}
      <Text
        style={{
          fontSize: 22,
          fontWeight: '700',
          color: c.label,
          marginTop: space.md,
        }}
      >
        {t('nearest')}
      </Text>

      <View
        style={[
          card,
          {
            paddingHorizontal: space.lg,
          },
        ]}
      >
        {hospitals === null && !locError ? (
          <ActivityIndicator
            style={{ padding: space.lg }}
            color={c.label}
          />
        ) : hospitals?.length ? (
          hospitals.map((hospital, index) => (
            <View
              key={`${hospital.name}-${index}`}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: space.md,
                borderTopWidth: index ? 1 : 0,
                borderTopColor: c.separator,
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: radius.row,
                  backgroundColor: c.fill,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: space.md,
                }}
              >
                <Ionicons
                  name="medical-outline"
                  size={22}
                  color={c.label}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 17,
                    color: c.label,
                  }}
                >
                  {hospital.name}
                </Text>

                <Text style={{ color: c.label2 }}>
                  {hospital.km.toFixed(1)} km
                </Text>
              </View>

              <Pressable
                onPress={() => walkTo(hospital.name)}
                accessibilityRole="button"
                accessibilityLabel={`${t('walkingDirections')} ${hospital.name}`}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: radius.pill,
                  backgroundColor: c.fill,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons
                  name="walk-outline"
                  size={24}
                  color={c.label}
                />
              </Pressable>
            </View>
          ))
        ) : (
          <Text
            style={{
              color: c.label2,
              padding: space.lg,
            }}
          >
            {t('noHospital')}
          </Text>
        )}
      </View>

      {/* Sources */}
      <Text
        style={{
          color: c.label2,
          fontSize: 14,
          lineHeight: 20,
        }}
      >
        {t('sources')}{' '}

        <Text
          style={{
            backgroundColor: '#FFF3C4',
            color: '#7A5B00',
            fontSize: 13,
          }}
        >
          {t('toConfirm')}
        </Text>
      </Text>
    </ScrollView>
  );
}
