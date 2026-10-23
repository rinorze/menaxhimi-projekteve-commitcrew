import { ScreenPlaceholder } from '@/components/screen-placeholder';

// 1.3 · Artiola · The place the guest tapped; “Ruaje …” names it on the next screen.
export default function GuestPlace() {
  return (
    <ScreenPlaceholder
      step="1.3"
      title="Kalaja e Novobërdës"
      owner="Artiola"
      design="01-onboarding/03-guest-place.png"
      next="/save-passport"
      nextLabel="Ruaje Novobërdën në pasaportë"
      also={[{ href: '/look-around', label: 'Vazhdo të shikosh' }]}
    />
  );
}
