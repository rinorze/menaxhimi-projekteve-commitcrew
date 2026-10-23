import { ScreenPlaceholder } from '@/components/screen-placeholder';

// 1.1 · Artiola · “Shiko përreth fillimisht” is the biggest button in the design; the photo is Gjeravica.
export default function Welcome() {
  return (
    <ScreenPlaceholder
      step="1.1"
      title="Mirë se vjen"
      owner="Artiola"
      design="01-onboarding/01-welcome.png"
      next="/language"
      nextLabel="Krijo pasaportën time"
      also={[{ href: '/look-around', label: 'Shiko përreth fillimisht' }, { href: '/sign-in', label: 'Kam llogari' }]}
    />
  );
}
