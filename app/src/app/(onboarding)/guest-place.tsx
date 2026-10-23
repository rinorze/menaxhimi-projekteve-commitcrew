import { ScreenPlaceholder } from '@/components/screen-placeholder';

// The place the guest tapped. “Save” opens /save-passport with that place named.
export default function GuestPlace() {
  return <ScreenPlaceholder title="Vendi" owner="Artiola" design="01-onboarding/03-guest-place.png" next="/save-passport" nextLabel="Ruaje në pasaportë" />;
}
