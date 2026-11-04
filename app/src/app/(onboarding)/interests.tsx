import { ScreenPlaceholder } from '@/components/screen-placeholder';

// 1.7 · Erleta · Pick any number, or skip. Step 3 of 7.
export default function Interests() {
  return (
    <ScreenPlaceholder
      step="1.7"
      title="Çfarë të pëlqen?"
      owner="Erleta"
      design="01-onboarding/07-interests.png"
      next="/avatar"
      nextLabel="Vazhdo"
      also={[{ href: '/avatar', label: 'Kalo' }]}
    />
  );
}
