import { MapPin } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useLang, useT } from '../i18n';
import './Nav.css';

/** The top bar on every page: logo, links, the SQ / EN switch and the waiting-list button. */
export function Nav() {
  const t = useT();
  const { lang, setLang } = useLang();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  // HashRouter owns the URL hash, so section links scroll to the id instead of changing it.
  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const scroll = () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    if (pathname === '/') scroll();
    else {
      navigate('/');
      setTimeout(scroll, 50);
    }
  };
  return (
    <header className="nav wrap">
      <Link to="/" className="nav-logo">
        <span className="logo-mark"><MapPin size={19} strokeWidth={2.2} /></span>
        <span className="nav-name">Discover Kosovo</span>
      </Link>
      <nav className="nav-links">
        <a href="#si-funksionon" onClick={go('si-funksionon')}>{t({ sq: 'Si funksionon', en: 'How it works' })}</a>
        <a href="#vecorite" onClick={go('vecorite')}>{t({ sq: 'Veçoritë', en: 'Features' })}</a>
        <Link to="/aplikacioni">{t({ sq: 'Aplikacioni', en: 'The app' })}</Link>
        <a href="#pyetje" onClick={go('pyetje')}>{t({ sq: 'Pyetje', en: 'FAQ' })}</a>
      </nav>
      <div className="nav-lang" role="group" aria-label="Language">
        {(['sq', 'en'] as const).map((l) => (
          <button key={l} className={l === lang ? 'on' : ''} onClick={() => setLang(l)} aria-pressed={l === lang}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>
      <Link to="/lista-e-pritjes" className="btn">{t({ sq: 'Lista e pritjes', en: 'Waiting list' })}</Link>
    </header>
  );
}
