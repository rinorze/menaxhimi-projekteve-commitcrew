import { ScreenPlaceholder } from '@/components/screen-placeholder';

// 1.12 · Elvina · Friend code + QR and the invite. Step 7 of 7.
export default function OneFriend() {
  return (
    <ScreenPlaceholder
      step="1.12"
      title="Mjafton një shok"
      owner="Elvina"
      design="01-onboarding/12-one-friend-is-enough.png"
      next="/first-km"
      nextLabel="Dërgo ftesën time"
      also={[{ href: '/first-km', label: 'Do të eksploroj vetëm' }]}
    />
  );
}
