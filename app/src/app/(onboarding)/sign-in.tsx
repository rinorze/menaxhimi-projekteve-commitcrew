import { ScreenPlaceholder } from '@/components/screen-placeholder';

// 1.14 · Artiola · For returning users. Only the screen, no real login yet.
export default function SignIn() {
  return (
    <ScreenPlaceholder
      step="1.14"
      title="Hyr"
      owner="Artiola"
      design="01-onboarding/14-sign-in-returning-users.png"
      next="/home"
      nextLabel="Hyr"
      also={[{ href: '/welcome', label: 'Anulo' }]}
    />
  );
}
