import { ScreenPlaceholder } from '@/components/screen-placeholder';

// Returning users. Cancel goes back to /welcome.
export default function SignIn() {
  return <ScreenPlaceholder title="Hyr" owner="Artiola" design="01-onboarding/14-sign-in-returning-users.png" next="/home" nextLabel="Hyr" />;
}
