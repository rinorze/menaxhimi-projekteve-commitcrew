import { ScreenPlaceholder } from '@/components/screen-placeholder';

// 1.6 · Erleta · Country, family municipality (all 38), month; the ticket card at the bottom.
export default function Kthimi() {
  return (
    <ScreenPlaceholder
      step="1.6"
      title="Kthimi"
      owner="Erleta"
      design="01-onboarding/06-kthimi-diaspora.png"
      next="/interests"
      nextLabel="Vazhdo"
    />
  );
}
