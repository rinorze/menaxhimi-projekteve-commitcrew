import { ScreenPlaceholder } from '@/components/screen-placeholder';

// Friend code + QR, or “I’ll explore alone”. Step 7 of 7.
export default function OneFriendIsEnough() {
  return <ScreenPlaceholder title="One friend is enough" owner="Elvina" design="OneFriend" next="/first-km" nextLabel="Continue" />;
}
