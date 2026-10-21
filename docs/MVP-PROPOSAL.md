# Discover Kosovo — Propozimi i MVP-së

**Grupi:** CommitCrew · **Lënda:** Menaxhimi i Projekteve · **Profesori:** Lorent Sinani
**Repository:** `menaxhimi-projekteve-commitcrew` (privat) · **Menaxhimi i taskave:** [GitHub Projects](https://github.com/users/rinorze/projects/1)
**Kohëzgjatja:** 11 sprinte javore (19 tetor 2026 – 10 janar 2027)

---

## 1. Ideja

**Discover Kosovo është një rrjet social për udhëtime, ku çdo postim është një vizitë e vërtetuar.**
Përdoruesi eksploron hartën e Kosovës (monumente, natyrë, vende të fshehura), shkon fizikisht në vend dhe bën *check-in* me kamerën e aplikacionit. Fotoja bëhet postim në *feed*-in e miqve, ndërsa në **Pasaportën digjitale të Kosovës** shtohet një vulë. Shtigjet tematike (**Besa Quests**), harta që “pastrohet nga mjegulla” sa më shumë që eksploron dhe renditjet javore e bëjnë përdoruesin të rikthehet.

> Me një fjali: *Instagram × Strava × pasaportë me vula, e ndërtuar posaçërisht për Kosovën.*

**Për kë:** vizitorët e huaj · diaspora që kthehet çdo verë dhe festë · studentët dhe të rinjtë vendas.

**Pse tani:** në vitin 2025 Kosova regjistroi **762,836 vizitorë (60.7% të huaj)** dhe vetëm në korrik 2026 hotelet kishin **99,053 vizitorë (+27.8%)**. Aplikacionet ekzistuese (Visit Kosovo, Dardania Live, EduPrizrenin, Prishtina Online) janë katalogë statikë. Asnjëri nuk e vërteton vizitën dhe asnjëri nuk ka anë sociale.

## 2. Çka përfshin MVP-ja (P0, i domosdoshëm për demon finale)

1. **Llogaria dhe profili:** regjistrimi, *onboarding*, emri i përdoruesit, fotoja, qyteti ose shteti i diasporës.
2. **Eksploro:** hartë me mbi 60 vende në të **7 rajonet**, faqja e vendit, kërkimi dhe filtrat.
3. **Check-in i verifikuar:** vetëm kamera e aplikacionit dhe GPS brenda rrezes së vendit (~100 m), me verifikim në server. Rezultati është **postim i verifikuar** plus **vulë**.
4. **Feed social:** *Following* dhe *Community*, pëlqime, komente, profile, *follow*, njoftime, raportim dhe bllokim.
5. **Pasaporta:** vulat sipas rajoneve dhe progresi.
6. **Besa Quests:** të paktën 5 shtigje tematike (p.sh. Vushtrri: Kalaja → Hamami → Ura e Gurit).
7. **Paneli admin në web:** menaxhimi i vendeve, shtigjeve dhe eventeve, si dhe moderimi i përmbajtjes.
8. **Gjuha shqipe dhe angleze** në tërë aplikacionin.
9. **Modaliteti demo** (simulim i lokacionit) për prezantimin në klasë.

**P1 (i planifikuar):** XP dhe nivele, *leaderboards*, harta me mjegull, eventet dhe vulat e festivaleve (DokuFest, Sunny Hill, Anibar), profili publik në web, *offline cache*.
**P2 (shtesë nëse ka kohë):** kamera “Atëherë & Sot”, verifikimi i fotos me AI, audio-histori, *push notifications*.
**Jashtë fushëveprimit:** kuponë biznesesh, chat/DM, asistent RAG, publikim në App Store dhe Play Store (shpërndajmë APK).

## 3. Teknologjia

| Shtresa | Zgjedhja |
| --- | --- |
| Aplikacioni mobil | React Native me **Expo SDK 58**, Expo Router, TypeScript, harta **MapLibre** + OpenFreeMap |
| Backend | **Supabase:** PostgreSQL + PostGIS, autentifikim, ruajtje e fotove, *Row Level Security* |
| Ueb (admin dhe profil publik) | **Next.js 16**, Tailwind CSS, shadcn/ui, i hostuar në Vercel |
| Organizimi i kodit | Monorepo (pnpm + Turborepo), GitHub Actions CI, testim me Maestro dhe Playwright |
| Dizajni | Figma, Maputnik (stili i hartës) |

## 4. Ndarja e punës

| Anëtari | Roli | Përgjegjësitë kryesore |
| --- | --- | --- |
| **Rinor Zeqiri** | Product Designer (UI/UX) · Product Owner | Hulumtimi i përdoruesve, wireframes, identiteti vizual, UI kit, të gjithë ekranet në Figma, stili i hartës, sistemi i vulave, testimi i përdorshmërisë |
| **Elios Mernica** | Tech Lead: backend dhe të dhënat | Arkitektura, skema e databazës dhe siguria (RLS), verifikimi i check-in, feed-i dhe gamifikimi në backend, importi i të dhënave nga OSM/Wikidata, publikimi |
| **Artiola Ferizi** | Web Developer · QA | Paneli admin (vendet, shtigjet, eventet), moderimi, profili publik në web, landing page, plani i testimit dhe CI |
| **Erleta Qerimi** | Mobile: Eksploro dhe Quests | Navigimi, harta, faqja e vendit, kërkimi, modaliteti demo, harta me mjegull, Besa Quests |
| **Elvina Sinani** | Mobile: Check-in dhe Pasaporta | Autentifikimi, onboarding, kamera dhe check-in, pasaporta dhe vulat, XP, eventet |
| **Krenare Veseli** | Mobile: Social · Scrum Master | Feed-i, komentet, profilet, *follow*, njoftimet, raportimi, *leaderboards*; planifikimi dhe raportet e sprinteve |

Përmbajtja (përshkrimet në shqip dhe anglisht, fotot me licencë) ndahet sipas rajoneve te të gjithë anëtarët.

## 5. Plani 11-javor

| Sprinti | Datat | Qëllimi |
| --- | --- | --- |
| 1 | 19–25 tetor | Miratimi i MVP-së, hulumtimi, spike teknik, PR-ja e parë e secilit |
| 2 | 26 tetor – 1 nëntor | Monorepo, skema e databazës, navigimi dhe hyrja; wireframes |
| 3 | 2–8 nëntor | Identiteti vizual dhe UI kit; harta shfaq vendet; hyrja në admin |
| 4 | 9–15 nëntor | 60+ vende në 7 rajone; faqja e vendit; CRUD në admin |
| 5 | 16–22 nëntor | **Check-in-i i parë krijon postim të verifikuar në feed** |
| 6 | 23–29 nëntor | Pasaporta me vula; njoftimet; raportimi dhe moderimi |
| 7 | 30 nëntor – 6 dhjetor | Besa Quests; XP; testimi i dytë me përdorues |
| 8 | 7–13 dhjetor | Leaderboards, harta me mjegull, eventet; **beta test me 8+ përdorues** |
| 9 | 14–20 dhjetor | Polish, aksesueshmëria, siguria, offline, bug bash |
| 10 | 21–27 dhjetor | Release candidate (APK) dhe raporti final |
| 11 | 4–10 janar | **v1.0.0, prezantimi dhe dorëzimi** |

## 6. Mënyra e punës në GitHub

- **Scrum me sprinte javore.** Çdo task është *issue* me pronar, sprint, prioritet (P0/P1/P2), madhësi dhe kritere pranimi, dhe kontrollohet çdo javë në GitHub Projects.
- **Degët:** `main` (versioni stabil i çdo sprinti) ← `develop` (integrimi) ← `feat/<issue>-<emri>` (një degë për çdo task).
- Çdo ndryshim hyn përmes **Pull Request** me një review nga shoku i ekipit dhe CI të gjelbër.

## 7. Kriteret e suksesit (demo finale)

Përdoruesi i ri instalon APK-në, regjistrohet, gjen një vend në hartë, bën check-in (në modalitetin demo) dhe sheh **postimin e verifikuar** në feed-in e mikut dhe **vulën** në pasaportë. Miku e pëlqen dhe e komenton postimin. Një Besa Quest përfundon me *badge*. Admini shton një vend në web dhe ai shfaqet menjëherë në hartë. Të gjitha këto funksionojnë në shqip dhe në anglisht.

*Plani i detajuar (anglisht): [docs/PROJECT-PLAN.md](PROJECT-PLAN.md).*
