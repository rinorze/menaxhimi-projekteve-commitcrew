import { ScreenPlaceholder } from '@/components/screen-placeholder';

// 1.2 · Artiola · Guest map, no account needed. The pin you tap opens that place.
export default function LookAround() {
  return (
    <ScreenPlaceholder
      step="1.2"
      title="Shiko përreth"
      owner="Artiola"
      design="01-onboarding/02-look-around-guest-map.png"
      next="/guest-place"
      nextLabel="Hap Kalanë e Novobërdës"
    />
  );
}
