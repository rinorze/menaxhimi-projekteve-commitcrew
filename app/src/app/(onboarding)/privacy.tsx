import { ScreenPlaceholder } from '@/components/screen-placeholder';

// 1.11 · Erleta · Explains the privacy rules; asks for no permission. Step 6 of 7.
export default function Privacy() {
  return (
    <ScreenPlaceholder
      step="1.11"
      title="Privat që në fillim"
      owner="Erleta"
      design="01-onboarding/11-privacy.png"
      next="/one-friend"
      nextLabel="Në rregull"
    />
  );
}
