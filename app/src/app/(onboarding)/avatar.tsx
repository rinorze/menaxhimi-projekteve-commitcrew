import { ScreenPlaceholder } from '@/components/screen-placeholder';

// 1.8 · Elvina · Avatar creator: tabs, option grid, shuffle. Step 4 of 7.
export default function Avatar() {
  return (
    <ScreenPlaceholder
      step="1.8"
      title="Pamja jote"
      owner="Elvina"
      design="01-onboarding/08-avatar-creator.png"
      next="/avatar-rewards"
      nextLabel="Përdor këtë fytyrë"
    />
  );
}
