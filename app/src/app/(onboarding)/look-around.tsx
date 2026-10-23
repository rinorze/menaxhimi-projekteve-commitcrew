import { ScreenPlaceholder } from '@/components/screen-placeholder';

// Guest map, no account needed. Each pin opens /guest-place with that place.
export default function LookAround() {
  return <ScreenPlaceholder title="Shiko përreth" owner="Artiola" design="01-onboarding/02-look-around-guest-map.png" next="/guest-place" nextLabel="Hap një vend" />;
}
