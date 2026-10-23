import { useT } from '../i18n';

// Krenare builds this page (Card 8, #143). Design: docs/design/screens/10-website/03-app-page.png
export default function AppPage() {
  const t = useT();
  return (
    <main className="wrap section">
      <div style={{ textAlign: 'center' }}>
        <h1 className="h2">{t({ sq: 'Discover Kosovo për iPhone', en: 'Discover Kosovo for iPhone' })}</h1>
      </div>
      <div className="todo" style={{ marginTop: 48 }}>
        <b>Sections</b>: app icon and “Bashkohu në TestFlight”; three Phones side by side (map, home, passport); two feature rows (unlock, passport);
        the Privatësia / Mbështetja / Pyetje cards. The App Store needs the privacy and support parts.
      </div>
    </main>
  );
}
