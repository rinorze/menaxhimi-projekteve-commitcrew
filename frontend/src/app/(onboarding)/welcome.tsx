import { ScreenPlaceholder } from '@/components/screen-placeholder';

// Buttons: Look around first → /look-around · Make my passport → /language · I already have an account → /sign-in
export default function Welcome() {
  return <ScreenPlaceholder title="Welcome" owner="Artiola" design="Welcome2" next="/language" nextLabel="Make my passport" />;
}
