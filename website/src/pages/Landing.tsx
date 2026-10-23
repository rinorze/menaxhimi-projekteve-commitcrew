import { EmailForm } from '../components/EmailForm';
import { Phone } from '../components/Phone';
import { useT } from '../i18n';
import './Landing.css';

// Krenare builds this page (#142). Design: docs/design/screens/10-website/01-landing-page.png
// The hero below is a working example of the shared parts; replace each "todo" box with the real section.
export default function Landing() {
  const t = useT();
  return (
    <main>
      <section className="wrap hero">
        <div className="hero-text">
          <span className="pill"><span className="dot" />{t({ sq: 'Beta në TestFlight · këtë dimër', en: 'TestFlight beta · this winter' })}</span>
          <h1>{t({ sq: 'Kosova, një vulë në një kohë.', en: 'Kosovo, one stamp at a time.' })}</h1>
          <p className="muted">{t({
            sq: 'Gjej vende të vërteta në një hartë të gjallë. Shko atje, bëj foton në aplikacion dhe mblidh vulën në pasaportën tënde. Me shokët, pa postime dhe pa pëlqime.',
            en: 'Find real places on a living map. Go there, take the photo in the app and collect the stamp in your passport. With friends, no posts and no likes.',
          })}</p>
          <EmailForm onJoin={() => {}} />
          <small className="muted">{t({ sq: 'Vetëm emaili. Të shkruajmë një herë, kur hapet beta.', en: 'Only your email. We write once, when the beta opens.' })}</small>
        </div>
        <div className="hero-visual">
          <img className="hero-photo" src={`${import.meta.env.BASE_URL}photos/gjeravica.jpg`} alt="Gjeravica" />
          <div className="hero-phone"><Phone screen="home.png" width={340} alt={t({ sq: 'Ballina e aplikacionit', en: 'The app home screen' })} /></div>
        </div>
      </section>

      <section id="si-funksionon" className="wrap section">
        <div className="todo"><b>Tre hapa. Një pasaportë.</b> Three soft-coloured panels (var(--tint-blue), var(--tint-sand), var(--tint-green)), each with a Phone, a number, a title and one line.</div>
      </section>
      <section id="vecorite" className="wrap section">
        <div className="todo"><b>Veçoritë</b> The feature tiles: map (dark, big), friends, ghost mode, Kthimi (Prizren photo), offline. Icons from lucide-react.</div>
      </section>
      <section className="wrap section">
        <div className="todo"><b>Nga Gjeravica në Partesh.</b> The big Kosovo map with the 7 regions.</div>
      </section>
      <section id="pyetje" className="wrap section">
        <div className="todo"><b>Pyetjet më të shpeshta</b> Five questions; the first one open (useState to open and close).</div>
      </section>
      <section className="wrap section">
        <div className="todo"><b>Kosova të pret.</b> The Rugova photo with the dark EmailForm (onDark).</div>
      </section>
    </main>
  );
}
