import { Stack } from 'expo-router';

/**
 * The onboarding chain. Every screen is its own file, so each person works only in their own files.
 * Screens cross-fade (calm, premium first run) instead of the sideways push used inside the app.
 */
export default function OnboardingLayout() {
  return <Stack screenOptions={{ headerShown: false, animation: 'fade', animationDuration: 320 }} />;
}
