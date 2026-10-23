import { ScreenPlaceholder } from '@/components/screen-placeholder';

// Buttons: “Shiko përreth fillimisht” → /look-around (biggest) · “Krijo pasaportën time” → /language · “Kam llogari” → /sign-in
export default function Welcome() {
  return <ScreenPlaceholder title="Mirë se vjen" owner="Artiola" design="01-onboarding/01-welcome.png" next="/language" nextLabel="Krijo pasaportën time" />;
}
