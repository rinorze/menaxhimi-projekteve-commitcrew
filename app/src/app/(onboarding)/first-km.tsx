import { ScreenPlaceholder } from '@/components/screen-placeholder';

// 1.13 · Elvina · Three real places near you and how unlocking works.
export default function FirstKm() {
  return (
    <ScreenPlaceholder
      step="1.13"
      title="Kilometri i parë"
      owner="Elvina"
      design="01-onboarding/13-first-kilometre.png"
      next="/sign-in"
      nextLabel="Më çoj te harta"
    />
  );
}
