import { ScreenPlaceholder } from '@/components/screen-placeholder';

// 1.5 · Erleta · Two big photo cards. Step 2 of 7.
export default function WhereToday() {
  return (
    <ScreenPlaceholder
      step="1.5"
      title="Ku je sot?"
      owner="Erleta"
      design="01-onboarding/05-where-are-you-today.png"
      next="/kthimi"
      nextLabel="Në Kosovë"
    />
  );
}
