import { ScreenPlaceholder } from '@/components/screen-placeholder';

// Guest map, no account needed. Each pin opens /guest-place with that place.
export default function LookAround() {
  return <ScreenPlaceholder title="Look around" owner="Artiola" design="GuestMap" next="/guest-place" nextLabel="Open a place" />;
}
