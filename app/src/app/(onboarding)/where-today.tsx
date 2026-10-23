import { ScreenPlaceholder } from '@/components/screen-placeholder';

// In Kosovo → /interests · Coming home (diaspora) → /kthimi. Step 2 of 7.
export default function WhereAreYouToday() {
  return <ScreenPlaceholder title="Ku je sot?" owner="Erleta" design="01-onboarding/05-where-are-you-today.png" next="/interests" nextLabel="Në Kosovë" />;
}
