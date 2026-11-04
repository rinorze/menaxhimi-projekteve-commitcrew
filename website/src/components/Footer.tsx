import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useT } from '../i18n';
import './Footer.css';

export function Footer() {
  const t = useT();
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div>
          <div className="footer-logo"><span className="logo-mark light"><MapPin size={19} strokeWidth={2.2} /></span>Discover Kosovo</div>
          <p>{t({
            sq: 'Projekt studentor i CommitCrew · Menaxhimi i Projekteve, 2026. Vendet nga OpenStreetMap dhe Wikidata, fotot nga Wikimedia Commons.',
            en: 'A student project by CommitCrew · Project Management, 2026. Places from OpenStreetMap and Wikidata, photos from Wikimedia Commons.',
          })}</p>
        </div>
        <div>
          <b>{t({ sq: 'Aplikacioni', en: 'The app' })}</b>
          <Link to="/">{t({ sq: 'Si funksionon', en: 'How it works' })}</Link>
          <Link to="/aplikacioni">{t({ sq: 'Aplikacioni', en: 'The app' })}</Link>
          <Link to="/lista-e-pritjes">{t({ sq: 'Lista e pritjes', en: 'Waiting list' })}</Link>
        </div>
        <div>
          <b>{t({ sq: 'Ndihmë', en: 'Help' })}</b>
          <span>{t({ sq: 'Privatësia', en: 'Privacy' })}</span>
          <span>{t({ sq: 'Mbështetja', en: 'Support' })}</span>
          <span>hello@discoverkosovo.app</span>
        </div>
        <div className="footer-lang">
          <b>{t({ sq: 'Gjuha', en: 'Language' })}</b>
          <span>Shqip · English · Deutsch · Français</span>
        </div>
      </div>
    </footer>
  );
}
