import { EmailForm } from "../components/EmailForm";
import { Phone } from "../components/Phone";
import { useT } from "../i18n";
import "./Landing.css";
import { Ghost, MapPin, Send, Users, WifiOff } from "lucide-react";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";

// Krenare builds this page (Card 7, #142). Design: docs/design/screens/10-website/01-landing-page.png
// The hero below is a working example of the shared parts; replace each "todo" box with the real section.
const steps = [
  {
    n: "01",
    tint: "blue",
    screen: "map.png",
    title: { sq: "Gjej një vend", en: "Find a place" },
    text: {
      sq: "Çdo pikë në hartë është një foto e vendit: ujëvara, kala, kulla, maja.",
      en: "Every pin on the map is a photo of the place: waterfalls, castles, towers, peaks.",
    },
    alt: { sq: "Harta me vendet", en: "The map with places" },
  },
  {
    n: "02",
    tint: "sand",
    screen: "01-camera-in-range.png",
    title: { sq: "Shko dhe fotografo", en: "Go and take a photo" },
    text: {
      sq: "Brenda rrethit të vendit hapet kamera. Fotoja mbetet e jotja.",
      en: "Inside the place’s circle the camera opens. The photo stays yours.",
    },
    alt: { sq: "Kamera brenda vendit", en: "The camera inside the place" },
  },
  {
    n: "03",
    tint: "green",
    screen: "04-stamp-collected.png",
    title: { sq: "Mblidh vulën", en: "Collect the stamp" },
    text: {
      sq: "Vula hyn në pasaportë. Mbush një komunë, pastaj të 38-tat.",
      en: "The stamp goes into your passport. Fill a municipality, then all 38.",
    },
    alt: { sq: "Vula e re në pasaportë", en: "The new stamp in your passport" },
  },
] as const;
const places = [
  "Prishtinë",
  "Prizren",
  "Pejë",
  "Gjakovë",
  "Mitrovicë",
  "Ferizaj",
  "Gjilan",
];

const faqs = [
  {
    q: { sq: "A është falas?", en: "Is it free?" },
    a: {
      sq: "Po. Aplikacioni është falas, pa reklama dhe pa blerje brenda tij.",
      en: "Yes. The app is free, with no ads and no in-app purchases.",
    },
  },
  {
    q: {
      sq: "Si e di aplikacioni që jam vërtet atje?",
      en: "How does the app know I’m really there?",
    },
    a: {
      sq: "Kamera hapet vetëm kur GPS-i tregon se je brenda rrethit të vendit.",
      en: "The camera only opens when GPS shows you are inside the place’s circle.",
    },
  },
  {
    q: { sq: "Kush e sheh ku jam?", en: "Who can see where I am?" },
    a: {
      sq: "Askush, derisa ta ndash vetë. Je në modalitetin fantazmë si parazgjedhje.",
      en: "Nobody, until you share it yourself. You are in ghost mode by default.",
    },
  },
  {
    q: { sq: "Funksionon pa internet?", en: "Does it work offline?" },
    a: {
      sq: "Po. Paketat e Rugovës dhe Sharrit, historitë e vendeve dhe karta e emergjencës 112 punojnë offline.",
      en: "Yes. The Rugova and Sharr packs, place stories and the 112 emergency card work offline.",
    },
  },
  {
    q: { sq: "Kur del?", en: "When is it out?" },
    a: {
      sq: "Beta hapet në TestFlight këtë dimër. Lër emailin dhe të shkruajmë një herë, kur hapet.",
      en: "The beta opens on TestFlight this winter. Leave your email and we write once, when it opens.",
    },
  },
] as const;
const stats = [
  { n: "318", label: { sq: "vende", en: "places" } },
  { n: "38", label: { sq: "komuna", en: "municipalities" } },
  { n: "4", label: { sq: "gjuhë", en: "languages" } },
] as const;
export default function Landing() {
  const t = useT();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <main>
      <section className="wrap hero">
        <div className="hero-text">
          <span className="pill">
            <span className="dot" />
            {t({
              sq: "Beta në TestFlight · këtë dimër",
              en: "TestFlight beta · this winter",
            })}
          </span>
          <h1>
            {t({
              sq: "Kosova, një vulë në një kohë.",
              en: "Kosovo, one stamp at a time.",
            })}
          </h1>
          <p className="muted">
            {t({
              sq: "Gjej vende të vërteta në një hartë të gjallë. Shko atje, bëj foton në aplikacion dhe mblidh vulën në pasaportën tënde. Me shokët, pa postime dhe pa pëlqime.",
              en: "Find real places on a living map. Go there, take the photo in the app and collect the stamp in your passport. With friends, no posts and no likes.",
            })}
          </p>
          <EmailForm onJoin={() => {}} />
          <small className="muted">
            {t({
              sq: "Vetëm emaili. Të shkruajmë një herë, kur hapet beta.",
              en: "Only your email. We write once, when the beta opens.",
            })}
          </small>
          <ul className="hero-stats">
            {stats.map((s) => (
              <li key={s.n}>
                <b>{s.n}</b>
                <span className="muted">{t(s.label)}</span>
              </li>
            ))}
          </ul>{" "}
        </div>
        <div className="hero-visual">
          <img
            className="hero-photo"
            src={`${import.meta.env.BASE_URL}photos/gjeravica.jpg`}
            alt="Gjeravica"
          />
          <div className="hero-phone">
            <Phone
              screen="home.png"
              width={340}
              alt={t({
                sq: "Ballina e aplikacionit",
                en: "The app home screen",
              })}
            />
          </div>
        </div>
      </section>

     
        <section id="si-funksionon" className="wrap section how">
          <p className="how-eyebrow">
            {t({ sq: "SI FUNKSIONON", en: "HOW IT WORKS" })}
          </p>
          <h2 className="how-title">
            {t({
              sq: "Tre hapa. Një pasaportë.",
              en: "Three steps. One passport.",
            })}
          </h2>

          <ol className="how-grid">
            {steps.map((s) => (
              <li key={s.n} className="how-step">
                <div className={`how-panel how-panel--${s.tint}`}>
                  <Phone screen={s.screen} width={260} alt={t(s.alt)} />
                </div>
                <div className="how-caption">
                  <span className="how-num">{s.n}</span>
                  <h3>{t(s.title)}</h3>
                </div>
                <p className="muted how-text">{t(s.text)}</p>
              </li>
            ))}
          </ol>
      </section>
        <section id="vecorite" className="wrap section feat">
          <p className="feat-eyebrow">
            {t({ sq: "VEÇORITË", en: "FEATURES" })}
          </p>
          <h2 className="feat-title">
            {t({
              sq: "Gjithçka për të eksploruar Kosovën me shokët.",
              en: "Everything to explore Kosovo with your friends.",
            })}
          </h2>

          <div className="feat-grid">
            <article className="feat-tile feat-tile--map">
              <div className="feat-map-text">
                <span className="feat-icon">
                  <MapPin size={22} />
                </span>
                <h3>
                  {t({
                    sq: "Një hartë që duket si vendet",
                    en: "A map that looks like the places",
                  })}
                </h3>
                <p>
                  {t({
                    sq: "Zmadho dhe çdo foto merr etiketën e vet. Prek një pikë dhe ajo rritet në kartën e vendit, me historinë dhe kamerën.",
                    en: "Zoom in and every photo gets its label. Tap a pin and it grows into the place’s card, with its story and the camera.",
                  })}
                </p>
              </div>
              <div className="feat-map-phone">
                <Phone
                  screen="03-pin-grows-into-its-card.png"
                  width={320}
                  alt={t({ sq: "Karta e vendit", en: "The place card" })}
                />
              </div>
            </article>

            <article className="feat-tile feat-tile--light">
              <span className="feat-icon">
                <Users size={22} />
              </span>
              <h3>{t({ sq: "Shokë, pa feed", en: "Friends, no feed" })}</h3>
              <p className="muted">
                {t({
                  sq: "Shihni vulat e njëri-tjetrit dhe planifikoni udhëtime. Pa postime, pa pëlqime, pa komente.",
                  en: "See each other’s stamps and plan trips. No posts, no likes, no comments.",
                })}
              </p>
              <div className="feat-avatars">
                {[
                  "av-elira.svg",
                  "av-dren.svg",
                  "av-blend.svg",
                  "av-arta.svg",
                ].map((n) => (
                  <img
                    key={n}
                    src={`${import.meta.env.BASE_URL}avatars/${n}`}
                    alt=""
                  />
                ))}
              </div>
            </article>
            <article className="feat-tile feat-tile--light">
              <span className="feat-icon">
                <Ghost size={22} />
              </span>
              <h3>
                {t({ sq: "Fantazmë si parazgjedhje", en: "Ghost by default" })}
              </h3>
              <p className="muted">
                {t({
                  sq: "Askush nuk të sheh derisa ta ndash, dhe ndarja mbaron vetë.",
                  en: "Nobody sees you until you share, and the sharing ends by itself.",
                })}
              </p>
              <div className="feat-toggle" aria-hidden="true">
                <span>
                  {t({ sq: "Modaliteti fantazmë", en: "Ghost mode" })}
                </span>
                <span className="feat-switch">
                  <span className="feat-knob" />
                </span>
              </div>
            </article>

            <article className="feat-tile feat-tile--photo">
              <img
                className="feat-photo"
                src={`${import.meta.env.BASE_URL}photos/municipality-prizren.jpg`}
                alt={t({ sq: "Prizreni nga lart", en: "Prizren from above" })}
              />
              <div className="feat-photo-text">
                <Send size={22} />
                <h3>{t({ sq: "Kthimi", en: "The Return" })}</h3>
                <p>
                  {t({
                    sq: "Jeton jashtë? Zgjidh muajin e kthimit dhe gjej vendet e komunës së familjes.",
                    en: "Live abroad? Pick the month you come back and find the places in your family’s municipality.",
                  })}
                </p>
              </div>
            </article>

            <article className="feat-tile feat-tile--light">
              <span className="feat-icon">
                <WifiOff size={22} />
              </span>
              <h3>{t({ sq: "Edhe pa sinjal", en: "Even without signal" })}</h3>
              <p className="muted">
                {t({
                  sq: "Paketat e Rugovës dhe Sharrit, historitë e vendeve dhe karta e emergjencës 112 punojnë offline.",
                  en: "The Rugova and Sharr packs, place stories and the 112 emergency card work offline.",
                })}
              </p>
            </article>
          </div>
      </section>
      <section className="wrap section">
        <section className="wrap section">
          <div className="map-card">
            <div className="map-visual">
              <img
                src={`${import.meta.env.BASE_URL}screens/kosovo-map.png`}
                alt={t({
                  sq: "Harta e Kosovës me komunat",
                  en: "Map of Kosovo with its municipalities",
                })}
              />
            </div>
            <div className="map-text">
              <p className="map-eyebrow">
                {t({ sq: "TË GJITHA KOMUNAT", en: "ALL MUNICIPALITIES" })}
              </p>
              <h2>
                {t({
                  sq: "Nga Gjeravica në Partesh.",
                  en: "From Gjeravica to Partesh.",
                })}
              </h2>
              <p className="muted">
                {t({
                  sq: "Të 38 komunat dhe 7 rajonet, me vende të vërteta nga OpenStreetMap dhe Wikidata. Komunat që i ke vizituar mbushen në hartën tënde.",
                  en: "All 38 municipalities and 7 regions, with real places from OpenStreetMap and Wikidata. The municipalities you visit fill in on your map.",
                })}
              </p>
              <ul className="map-chips">
                {places.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <ul className="map-legend">
                <li>
                  <i className="map-dot map-dot--visited" />
                  {t({ sq: "e vizituar", en: "visited" })}
                </li>
                <li>
                  <i className="map-dot map-dot--here" />
                  {t({ sq: "ku je tani", en: "you are here" })}
                </li>
                <li>
                  <i className="map-dot map-dot--fog" />
                  {t({ sq: "ende në mjegull", en: "still in the fog" })}
                </li>
              </ul>
            </div>
          </div>
        </section>{" "}
      </section>
        <section id="pyetje" className="wrap section faq">
          <div className="faq-head">
            <p className="faq-eyebrow">{t({ sq: "PYETJE", en: "FAQ" })}</p>
            <h2>
              {t({
                sq: "Pyetjet më të shpeshta.",
                en: "Frequently asked questions.",
              })}
            </h2>
          </div>
          <div className="faq-list">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={i} className="faq-item">
                  <button
                    type="button"
                    className="faq-q"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span>{t(f.q)}</span>
                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                  </button>
                  {isOpen && <p className="faq-a muted">{t(f.a)}</p>}
                </div>
              );
            })}
          </div>
        </section>
      <section className="wrap section">
        <div className="cta">
          <img
            className="cta-photo"
            src={`${import.meta.env.BASE_URL}photos/gryka-e-rugoves.jpg`}
            alt={t({ sq: "Gryka e Rugovës", en: "The Rugova Gorge" })}
          />
          <div className="cta-overlay" />
          <div className="cta-content">
            <h2>{t({ sq: "Kosova të pret.", en: "Kosovo awaits you." })}</h2>
            <p>
              {t({
                sq: "Bëhu i pari në beta. Shqip, English, Deutsch, Français.",
                en: "Be the first in the beta. Shqip, English, Deutsch, Français.",
              })}
            </p>
            <EmailForm onDark onJoin={() => {}} />
          </div>
        </div>
      </section>
    </main>
  );
}
