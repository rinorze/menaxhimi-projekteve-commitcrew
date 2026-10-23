import { ScreenPlaceholder } from '@/components/screen-placeholder';

// In Kosovo → /interests · Coming home (diaspora) → /kthimi. Step 2 of 7.
export default function WhereAreYouToday() {
  return <ScreenPlaceholder title="Where are you today?" owner="Erleta" design="WhereToday" next="/interests" nextLabel="I’m in Kosovo" />;
}
