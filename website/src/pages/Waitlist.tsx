import { useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowRight, Check, Copy, Mail } from 'lucide-react';
import './Waitlist.css';
import { useT } from '../i18n';

export default function Waitlist() {
  const t = useT();
  type EmailLang = 'sq' | 'en' | 'de' | 'fr';
const LANGS: { id: EmailLang; label: string }[] = [
  { id: 'sq', label: 'Shqip' },
  { id: 'en', label: 'English' },
  { id: 'de', label: 'Deutsch' },
  { id: 'fr', label: 'Français' },
];

const [email, setEmail] = useState('');
const [lang, setLang] = useState<EmailLang>('sq');
const [joined, setJoined] = useState(false);
const [copied, setCopied] = useState(false);
const [invalid, setInvalid] = useState(false);

const local = email.split('@')[0].split(/[._+-]/)[0];
const name = local ? local.charAt(0).toUpperCase() + local.slice(1) : '';
const link = `discoverkosovo.app/?nga=${name.toLowerCase()}`;

function submit(e: FormEvent) {
  e.preventDefault();
  if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
    setInvalid(true);
    return;
  }
  setInvalid(false);
  // TODO: POST /api/waitlist/ kur Elios e shton
  setJoined(true);
}

async function copy() {
  try {
    await navigator.clipboard.writeText(`https://${link}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  } catch {
    /* clipboard i bllokuar: linku mbetet i dukshëm */
  }
}
  return (
    <main className="wrap wl">
      <div className="wl-head">
        <div className="eyebrow">{t({ sq: 'Lista e pritjes', en: 'Waiting list' })}</div>
        <h1>{t({ sq: 'Merr betën i pari.', en: 'Get the beta first.' })}</h1>
        <p>{t({
          sq: 'Të shkruajmë vetëm një herë, kur hapet beta në TestFlight këtë dimër.',
          en: 'We write once, when the beta opens on TestFlight this winter.',
        })}</p>
      </div>
    {!joined ? (
  <form className="wl-card" onSubmit={submit} noValidate>
    <label className="wl-label" htmlFor="wl-email">
      {t({ sq: 'Emaili', en: 'Email' })}
    </label>
    <div className={`wl-input${invalid ? ' is-invalid' : ''}`}>
      <Mail size={22} aria-hidden="true" />
      <input
        id="wl-email"
        type="email"
        autoComplete="email"
        placeholder="arta@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-invalid={invalid}
      />
    </div>
    {invalid && (
      <p className="wl-error" role="alert">
        {t({ sq: 'Shkruaj një email të vlefshëm.', en: 'Enter a valid email address.' })}
      </p>
    )}

    <span className="wl-label" id="wl-lang-label">
      {t({ sq: 'Gjuha e emailit', en: 'Email language' })}
    </span>
    <div className="wl-seg" role="radiogroup" aria-labelledby="wl-lang-label">
      {LANGS.map((l) => (
        <button
          key={l.id}
          type="button"
          role="radio"
          aria-checked={lang === l.id}
          className={lang === l.id ? 'is-on' : ''}
          onClick={() => setLang(l.id)}
        >
          {l.label}
        </button>
      ))}
    </div>

    <button type="submit" className="wl-submit">
      {t({ sq: 'Më fut në listë', en: 'Add me to the list' })}
      <ArrowRight size={18} strokeWidth={2.2} aria-hidden="true" />
    </button>

    <p className="wl-fine">
      {t({
        sq: 'Ruajmë vetëm emailin dhe gjuhën. Nuk i shesim kurrë dhe i fshijmë kur çregjistrohesh.',
        en: 'We store only your email and language. We never sell them and delete them when you unsubscribe.',
      })}{' '}
      <a href="/privatesia">{t({ sq: 'Privatësia', en: 'Privacy' })}</a>
    </p>
  </form>
) : (
  <section className="wl-done" aria-live="polite">
    <div className="wl-check">
      <Check size={32} strokeWidth={3} aria-hidden="true" />
    </div>
    <h2>
      {name
        ? t({ sq: `Je në listë, ${name}.`, en: `You're on the list, ${name}.` })
        : t({ sq: 'Je në listë.', en: "You're on the list." })}
    </h2>
    <p>
      {t({
        sq: 'Konfirmoje emailin. Të shkruajmë kur hapet beta.',
        en: "Confirm your email. We'll write when the beta opens.",
      })}
    </p>
    <div className="wl-share">
      <input readOnly value={link} aria-label={t({ sq: 'Lidhja jote', en: 'Your link' })} />
      <button type="button" onClick={copy}>
        {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
        {copied ? t({ sq: 'U kopjua', en: 'Copied' }) : t({ sq: 'Kopjo lidhjen', en: 'Copy link' })}
      </button>
    </div>
    <small>
      {t({
        sq: 'Pa renditje: të gjithë në listë e marrin betën njëkohësisht.',
        en: 'No ranking: everyone on the list gets the beta at the same time.',
      })}
    </small>
  </section>
)}
    </main>
  );
}
