import { Redirect } from 'expo-router';

// Until sign-in exists, the app starts at onboarding.
export default function Index() {
  return <Redirect href="/welcome" />;
}
