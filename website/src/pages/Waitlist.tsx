import { useT } from '../i18n';

// Krenare builds this page (Card 8, #143). Design: docs/design/screens/10-website/02-waiting-list.png
export default function Waitlist() {
  const t = useT();
  return (
    <main className="wrap section">
      <div style={{ textAlign: 'center' }}>
        <div className="kicker">{t({ sq: 'Lista e pritjes', en: 'Waiting list' })}</div>
        <h1 className="h2">{t({ sq: 'Merr betën i pari.', en: 'Get the beta first.' })}</h1>
      </div>
      <div className="todo" style={{ maxWidth: 560, margin: '48px auto 0' }}>
        <b>The form card</b>: email, language of the email (Shqip selected), “Më fut në listë”, the privacy line. On submit, hide the form and show the dark
        “Je në listë” card with the share link and “Kopjo lidhjen” (navigator.clipboard.writeText). No queue position.
      </div>
    </main>
  );
}
