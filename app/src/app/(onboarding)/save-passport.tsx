import { ScreenPlaceholder } from '@/components/screen-placeholder';

// 1.10 · Erleta · Continue with Apple, username, email, password, year of birth (the form only). Step 5 of 7.
export default function SavePassport() {
  return (
    <ScreenPlaceholder
      step="1.10"
      title="Ruaje pasaportën"
      owner="Erleta"
      design="01-onboarding/10-save-your-passport.png"
      next="/privacy"
      nextLabel="Ruaje pasaportën time"
    />
  );
}
