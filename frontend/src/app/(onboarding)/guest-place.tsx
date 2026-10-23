import { ScreenPlaceholder } from '@/components/screen-placeholder';

// The place the guest tapped. “Save” opens /save-passport with that place named.
export default function GuestPlace() {
  return <ScreenPlaceholder title="Guest place" owner="Artiola" design="GuestPlace" next="/save-passport" nextLabel="Save to my passport" />;
}
