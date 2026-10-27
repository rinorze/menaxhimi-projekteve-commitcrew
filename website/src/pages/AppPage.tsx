import { ArrowRight, Apple, Camera, CircleHelp, Globe, MapPin, ShieldCheck, Stamp } from "lucide-react";
import { Link } from "react-router-dom";

import { Phone } from "../components/Phone";
import { useT } from "../i18n";
import "./AppPage.css";

// Design: docs/design/screens/10-website/03-app-page.png
export default function AppPage() {
  const t = useT();

  const rows = [
    {
      icon: Camera,
      tint: "sand",
      screen: "01-camera-in-range.png",
      eyebrow: { sq: "HAPJA", en: "UNLOCKING" },
      title: {
        sq: "Hape vendin me një foto, vetëm kur je atje",
        en: "Unlock a place with a photo, only when you’re there",
      },
      text: {
        sq: "Brenda rrethit të vendit hapet kamera. Serveri kontrollon GPS-in dhe foton, dhe fotoja mbetet private derisa ta dërgosh si kartolinë.",
        en: "Inside the place’s circle the camera opens. The server checks the GPS and the photo, and the photo stays private until you send it as a postcard.",
      },
      alt: { sq: "Kamera brenda vendit", en: "The camera inside the place" },
    },
    {
      icon: Stamp,
      tint: "green",
      screen: "passport.png",
      eyebrow: { sq: "PASAPORTA", en: "PASSPORT" },
      title: { sq: "Një pasaportë, 38 komuna", en: "One passport, 38 municipalities" },
      text: {
        sq: "Çdo vulë ka foton tënde dhe datën. Mbush një komunë dhe ajo mbushet në hartën tënde.",
        en: "Every stamp has your photo and the date. Fill a municipality and it fills on your map.",
      },
      alt: { sq: "Pasaporta me vula", en: "The passport with stamps" },
    },
  ] as const;

  const cards = [
    {
      icon: ShieldCheck,
      title: { sq: "Privatësia", en: "Privacy" },
      text: {
        sq: "Vendndodhja është e fikur derisa ta ndash, dhe ndarja mbaron vetë. Fshi llogarinë dhe çdo foto kur të duash.",
        en: "Location is off until you share it, and sharing ends on its own. Delete your account and any photo whenever you want.",
      },
      link: { sq: "Politika e privatësisë", en: "Privacy policy" },
      href: "mailto:hello@discoverkosovo.app?subject=Privacy",
    },
    {
      icon: CircleHelp,
      title: { sq: "Mbështetja", en: "Support" },
      text: {
        sq: "Diçka nuk punon ose mungon një vend? Na shkruaj dhe të përgjigjet një njeri brenda dy ditësh.",
        en: "Something not working or a place missing? Write to us and a person replies within two days.",
      },
      link: { sq: "hello@discoverkosovo.app", en: "hello@discoverkosovo.app" },
      href: "mailto:hello@discoverkosovo.app",
    },
    {
      icon: Globe,
      title: { sq: "Pyetje", en: "Questions" },
      text: {
        sq: "Falas? Po. Pa internet? Historitë dhe karta e emergjencës po. Cilët telefona? iPhone me iOS 26.",
        en: "Free? Yes. Offline? Stories and the emergency card, yes. Which phones? iPhones on iOS 26.",
      },
      link: { sq: "Të gjitha pyetjet", en: "All questions" },
      href: "/",
    },
  ] as const;

  return (
    <main className="wrap ap">
      <header className="ap-hero">
        <div className="ap-icon" aria-hidden="true">
          <MapPin size={48} strokeWidth={2} />
        </div>
        <h1>
          <span>Discover Kosovo</span>
          <span>{t({ sq: "për iPhone", en: "for iPhone" })}</span>
        </h1>
        <p className="ap-lead">
          {t({
            sq: "Falas, pa reklama. Harta e çdo vendi që ia vlen në Kosovë, një pasaportë që e mbush me vula dhe shokë që eksplorojnë me ty.",
            en: "Free, no ads. A map of every place worth a visit in Kosovo, a passport you fill with stamps, and friends who explore with you.",
          })}
        </p>
        <div className="ap-cta">
          <Link className="ap-btn ap-btn-dark" to="/lista-e-pritjes">
            {t({ sq: "Bashkohu në TestFlight", en: "Join on TestFlight" })}
            <ArrowRight size={18} strokeWidth={2.2} aria-hidden="true" />
          </Link>
          <span className="ap-btn ap-btn-ghost" aria-disabled="true">
            <Apple size={18} aria-hidden="true" />
            {t({ sq: "App Store · pas lansimit", en: "App Store · after launch" })}
          </span>
        </div>
        <p className="ap-meta">iOS 26 · Shqip, English, Deutsch, Français</p>
      </header>

      <div className="ap-phones">
        <div className="ap-phone ap-phone-l">
          <Phone
            screen="map.png"
            width={295}
            alt={t({ sq: "Harta me vendet pranë teje", en: "Map with places near you" })}
          />
        </div>
        <div className="ap-phone ap-phone-c">
          <Phone
            screen="home.png"
            width={345}
            alt={t({ sq: "Ekrani kryesor: 4% e Kosovës", en: "Home screen: 4% of Kosovo" })}
          />
        </div>
        <div className="ap-phone ap-phone-r">
          <Phone
            screen="passport.png"
            width={295}
            alt={t({ sq: "Pasaporta me vula", en: "Passport with stamps" })}
          />
        </div>
      </div>

      <div className="ap-rows">
        {rows.map((r, i) => (
          <section key={r.screen} className={`ap-row${i % 2 ? " ap-row-rev" : ""}`}>
            <div className={`ap-panel ap-panel--${r.tint}`}>
              <Phone screen={r.screen} width={310} alt={t(r.alt)} />
            </div>
            <div className="ap-text">
              <span className="ap-icon-sm">
                <r.icon size={24} strokeWidth={1.8} aria-hidden="true" />
              </span>
              <p className="eyebrow">{t(r.eyebrow)}</p>
              <h2>{t(r.title)}</h2>
              <p className="ap-text-p">{t(r.text)}</p>
            </div>
          </section>
        ))}
      </div>

      <section className="ap-cards">
        {cards.map((c) => (
          <a key={c.title.en} className="ap-card" href={c.href}>
            <span className="ap-icon-sm">
              <c.icon size={24} strokeWidth={1.8} aria-hidden="true" />
            </span>
            <h3>{t(c.title)}</h3>
            <p>{t(c.text)}</p>
            <span className="ap-card-link">{t(c.link)} →</span>
          </a>
        ))}
      </section>
    </main>
  );
}
