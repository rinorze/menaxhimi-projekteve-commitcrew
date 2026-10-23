import { Stack } from 'expo-router';

/** The onboarding chain. Every screen is its own file, so each person works only in their own files. */
export default function OnboardingLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
