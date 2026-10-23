import { ScreenPlaceholder } from '@/components/screen-placeholder';

// Returning users. Cancel goes back to /welcome.
export default function SignIn() {
  return <ScreenPlaceholder title="Sign in" owner="Artiola" design="SignIn" next="/home" nextLabel="Sign in" />;
}
