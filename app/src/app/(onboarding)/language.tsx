import { ScreenPlaceholder } from '@/components/screen-placeholder';

// 1.4 · Artiola · Shqip, English, Deutsch, Français in that order; Shqip selected by default. Step 1 of 7.
export default function Language() {
  return (
    <ScreenPlaceholder
      step="1.4"
      title="Gjuha"
      owner="Artiola"
      design="01-onboarding/04-language.png"
      next="/where-today"
      nextLabel="Vazhdo"
    />
  );
}
