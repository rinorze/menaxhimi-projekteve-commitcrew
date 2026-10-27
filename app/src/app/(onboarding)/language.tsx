import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const LANGUAGES = [
  { code: 'SQ', name: 'Shqip' },
  { code: 'EN', name: 'English' },
  { code: 'DE', name: 'Deutsch' },
  { code: 'FR', name: 'Français' },
];

export default function Language() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedLanguage, setSelectedLanguage] = useState('SQ');

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 12 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.progress} accessibilityLabel="Hapi 1 nga 7">
          {Array.from({ length: 7 }, (_, index) => (
            <View
              key={index}
              style={[styles.progressStep, index === 0 && styles.progressStepActive]}
            />
          ))}
        </View>

        <Text style={styles.title}>Në cilën gjuhë të flasë Kosova?</Text>
        <Text style={styles.subtitle}>Which language? · Welche Sprache? · Quelle langue ?</Text>

        <View style={styles.languages}>
          {LANGUAGES.map((language) => {
            const selected = selectedLanguage === language.code;

            return (
              <Pressable
                key={language.code}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                onPress={() => setSelectedLanguage(language.code)}
                style={({ pressed }) => [
                  styles.language,
                  selected && styles.languageSelected,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={[styles.languageCode, !selected && styles.languageCodeUnselected]}>
                  {language.code}
                </Text>
                <Text style={styles.languageName}>{language.name}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.note}>
          Historitë e vendeve vijnë nga Wikipedia në çdo gjuhë kur ekziston. Emrat në veri
          tregohen edhe në serbisht.
        </Text>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) + 20 }]}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/where-today')}
          style={({ pressed }) => [styles.continueButton, pressed && styles.pressed]}
        >
          <Text style={styles.continueText}>Vazhdo</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { paddingHorizontal: 16, paddingBottom: 24 },
  progress: {
    flexDirection: 'row',
    gap: 6,
    marginHorizontal: 8,
    marginBottom: 28,
  },
  progressStep: { flex: 1, height: 4, borderRadius: 2, backgroundColor: '#E5E5E5' },
  progressStepActive: { backgroundColor: '#0B0B0F' },
  title: { fontSize: 29, lineHeight: 36, fontWeight: '800', color: '#000000' },
  subtitle: { marginTop: 4, fontSize: 16, lineHeight: 21, color: '#8E8E93' },
  languages: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 10 },
  language: {
    width: '48.5%',
    minHeight: 96,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 13,
    backgroundColor: '#F1F1F1',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  languageSelected: { backgroundColor: '#FFFFFF', borderColor: '#0B0B0F' },
  languageCode: { fontSize: 18, fontWeight: '700', color: '#000000' },
  languageCodeUnselected: { color: '#A0A0A5' },
  languageName: { fontSize: 16, fontWeight: '600', color: '#000000' },
  note: { marginTop: 18, fontSize: 13, lineHeight: 18, color: '#8E8E93' },
  footer: { paddingHorizontal: 16, paddingTop: 12 },
  continueButton: {
    height: 54,
    borderRadius: 28,
    backgroundColor: '#0B0B0F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  pressed: { opacity: 0.8 },
});
