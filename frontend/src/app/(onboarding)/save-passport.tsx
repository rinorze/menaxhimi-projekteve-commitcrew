import { ScreenPlaceholder } from '@/components/screen-placeholder';

// Account: Apple, or username, email, password, year of birth. Step 5 of 7.
export default function SaveYourPassport() {
  return <ScreenPlaceholder title="Save your passport" owner="Elvina" design="SavePassport" next="/privacy" nextLabel="Save my passport" />;
}
