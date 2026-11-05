import { ScreenPlaceholder } from '@/components/screen-placeholder';

// 9.1 · Artiola · Your profile. Design: docs/design/screens/12-new-design/you/profile.png
// The buttons below are only a temporary way for the team to open the new screens while they are placeholders.
export default function Profile() {
  return (
    <ScreenPlaceholder
      step="9.1"
      title="Profili"
      owner="Artiola"
      design="12-new-design/you/profile.png"
      also={[
        { href: '/edit-profile', label: 'Ndrysho profilin' },
        { href: '/private-photos', label: 'Fotot private' },
        { href: '/privacy-settings', label: 'Privatësia dhe vendndodhja' },
        { href: '/emergency', label: 'Emergjenca' },
        { href: '/data-sources', label: 'Burimet e të dhënave' },
        { href: '/accessibility', label: 'Qasshmëria' },
      ]}
    />
  );
}
