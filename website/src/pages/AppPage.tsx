import { useT } from "../i18n";
import {
  ArrowRight,
  Lock,
  LifeBuoy,
  MapPin,
  MessageCircleQuestion,
  Stamp,
  Camera,
  AppleIcon,
} from "lucide-react";
import { Phone } from "../components/Phone";
import "./AppPage.css";
import { ShieldCheck, CircleHelp, Globe } from "lucide-react";

export default function AppPage() {
  const t = useT();

  const infoCards = [
    {
      icon: ShieldCheck,
      title: t({ sq: "Privatësia", en: "Privacy" }),
      text: t({
        sq: "Vendndodhja është e fikur derisa ta ndash, dhe ndarja mbaron vetë. Fshi llogarinë dhe çdo foto kur të duash.",
        en: "Location is off until you share it, and sharing ends on its own. Delete your account and any photo whenever you want.",
      }),
      linkLabel: t({ sq: "Politika e privatësisë", en: "Privacy policy" }),
      href: "/privatesia",
    },
    {
      icon: CircleHelp,
      title: t({ sq: "Mbështetja", en: "Support" }),
      text: t({
        sq: "Diçka nuk punon ose mungon një vend? Na shkruaj dhe të përgjigjet një njeri brenda dy ditësh.",
        en: "Something not working or a place missing? Write to us and a person replies within two days.",
      }),
      linkLabel: "hello@discoverkosovo.app",
      href: "mailto:hello@discoverkosovo.app",
    },
    {
      icon: Globe,
      title: t({ sq: "Pyetje", en: "Questions" }),
      text: t({
        sq: "Falas? Po. Pa internet? Historitë dhe karta e emergjencës po. Cilët telefona? iPhone me iOS 26.",
        en: "Free? Yes. Offline? Stories and the emergency map, yes. Which phones? iPhones on iOS 26.",
      }),
      linkLabel: t({ sq: "Të gjitha pyetjet", en: "All questions" }),
      href: "/#pyetje",
    },
  ];

  // JSX:
  <section className="app-info">
    <div className="app-info__grid">
      {infoCards.map(({ icon: Icon, title, text, linkLabel, href }) => (
        <article className="info-card" key={title}>
          <span className="info-card__icon">
            <Icon size={16} />
          </span>
          <h3 className="info-card__title">{title}</h3>
          <p className="info-card__text">{text}</p>
          <a className="info-card__link" href={href}>
            {linkLabel} →
          </a>
        </article>
      ))}
    </div>
  </section>;
  return (
    <main className="wrap section ap">
      {/* Hero */}
      <header className="ap-hero">
        <div className="ap-icon" aria-hidden="true">
          <MapPin size={44} strokeWidth={2} />
        </div>
        <h1 className="h2">
          {t({
            sq: "Discover Kosovo për iPhone",
            en: "Discover Kosovo for iPhone",
          })}
        </h1>
        <p className="ap-lead">
          {t({
            sq: "Falas, pa reklama. Harta e çdo vendi që ia vlen në Kosovë, një pasaportë që e mbush me vula dhe shokë që eksplorojnë me ty.",
            en: "Free, no ads. A map of every place worth visiting in Kosovo, a passport you fill with stamps, and friends who explore with you.",
          })}
        </p>
        <div className="ap-cta">
          <a
            className="ap-btn ap-btn-dark"
            href="https://testflight.apple.com/join/XXXXXXXX"
          >
            {t({ sq: "Bashkohu në TestFlight", en: "Join on TestFlight" })}
            <ArrowRight size={16} aria-hidden="true" />
          </a>
          <span className="ap-btn ap-btn-ghost" aria-disabled="true">
            <AppleIcon size={16} aria-hidden="true" />
            {t({
              sq: "App Store · pas lansimit",
              en: "App Store · after launch",
            })}
          </span>
        </div>
        <p className="ap-meta">iOS 26 · Shqip, English, Deutsch, Français</p>
      </header>

      <div className="ap-phones">
        <div className="ap-phone ap-phone-l">
          <Phone
            screen="map.png"
            width={250}
            alt={t({
              sq: "Harta me vendet pranë teje",
              en: "Map with places near you",
            })}
          />
        </div>
        <div className="ap-phone ap-phone-c">
          <Phone
            screen="home.png"
            width={290}
            alt={t({
              sq: "Ekrani kryesor: 4% e Kosovës",
              en: "Home screen: 4% of Kosovo",
            })}
          />
        </div>
        <div className="ap-phone ap-phone-r">
          <Phone
            screen="passport.png"
            width={250}
            alt={t({ sq: "Pasaporta me vula", en: "Passport with stamps" })}
          />
        </div>
      </div>

      <section className="ap-row">
        <div className="ap-text">
          <Camera size={28} aria-hidden="true" />
          <h2>
            {t({
              sq: "Hape vendin me një foto,vetëm kur je atje",
              en: "Unlock a place with a photo, only when you’re there..",
            })}
          </h2>
          <p>
            {t({
              sq: "Brenda rrethit të vendit hapet kamera.Serveri kontrollon GPS-in dhe foton,dhe fotoja mbetet private derisa ta dërgosh si kartolinë. ",
              en: "Within the location’s radius, the camera opens. The server verifies the GPS location and the photo, and the photo remains private until you send it as a postcard",
            })}
          </p>
        </div>
        <Phone
          screen="01-camera-in-range.png"
          width={260}
          alt={t({ sq: "Harta", en: "Map" })}
        />
      </section>

      <section className="ap-row ap-row-rev">
        <div className="ap-text">
          <Stamp size={28} aria-hidden="true" />
          <h2>
            {t({
              sq: "Një pasaportë,38 komuna",
              en: "One Passport, 38 Municipalities",
            })}
          </h2>
          <p>
            {t({
              sq: "Çdo vulë shton përqindjen e Kosovës që e ke eksploruar. Shiko komunat, shenjat dhe serinë e javëve.",
              en: "Every stamp adds to the share of Kosovo you have explored. See your municipalities, badges and weekly streak.",
            })}
          </p>
        </div>
        <Phone
          screen="passport.png"
          width={260}
          alt={t({ sq: "Pasaporta", en: "Passport" })}
        />
      </section>

      <section className="ap-cards">
        <a className="ap-card" href="/privatesia">
          <ShieldCheck size={24} aria-hidden="true" />
          <h3>{t({ sq: "Privatësia", en: "Privacy" })}</h3>
          <p>
            {t({
              sq: "Vendndodhja është e fikur derisa ta ndash, dhe ndarja mbaron vetë. Fshi llogarinë dhe çdo foto kur të duash.",
              en: "Location sharing stays off until you choose to share it, and sharing stops automatically. Delete your account and any photo whenever you want.",
            })}
          </p>
          <span className="ap-card-link">
            {t({ sq: "Politika e privatësisë", en: "Privacy policy" })} →
          </span>
        </a>

        <a className="ap-card" href="mailto:hello@discoverkosovo.app">
          <CircleHelp size={24} aria-hidden="true" />
          <h3>{t({ sq: "Mbështetja", en: "Support" })}</h3>
          <p>
            {t({
              sq: "Diçka nuk punon ose mungon një vend? Na shkruaj dhe të përgjigjemi brenda dy ditësh.",
              en: "Is something not working, or is a place missing? Write to us and we’ll reply within two days.",
            })}
          </p>
          <span className="ap-card-link">hello@discoverkosovo.app →</span>
        </a>

        <a className="ap-card" href="/#pyetje">
          <Globe size={24} aria-hidden="true" />
          <h3>{t({ sq: "Pyetje", en: "Questions" })}</h3>
          <p>
            {t({
              sq: "Falas? Po. Pa internet? Historitë dhe karta e emergjencës po. Cilët telefona? iPhone me iOS 26.",
              en: "Free? Yes. No internet? Yes. Stories and emergency card? Yes. Which phones? iPhones running iOS 26.",
            })}
          </p>
          <span className="ap-card-link">
            {t({ sq: "Të gjitha pyetjet", en: "All questions" })} →
          </span>
        </a>
      </section>
    </main>
  );
}
