# Discover Kosovo: Propozimi i MVP-së

**Grupi:** CommitCrew · **Lënda:** Menaxhimi i Projekteve · **Profesori:** Lorent Sinani
**Repository:** `menaxhimi-projekteve-commitcrew` (privat) · **Menaxhimi i taskave:** [GitHub Projects](https://github.com/users/rinorze/projects/1) · **Kohëzgjatja:** 11 sprinte javore (19 tetor 2026 – 10 janar 2027)

---

## 1. Ideja

**Discover Kosovo është një aplikacion mobil për zbulim dhe udhëtim nëpër të 38 komunat e Kosovës, që ndihet si rrjet social, por pa postime, pa pëlqime dhe pa komente.**

Përdoruesi zgjedh një qytet, gjen vendet në hartë (2D dhe 3D), shkon atje dhe e **zhbllokon vendin me kamerën e aplikacionit**. Vula shtohet në koleksionin e tij, ndërsa miqtë shohin automatikisht se çka ka zhbllokuar dhe (vetëm nëse ai e lejon) ku ndodhet. Bashkë mund të bisedojnë në chat, të planifikojnë udhëtime, të dërgojnë kartolina digjitale, të mbajnë "streak" dhe të kryejnë sfida të përbashkëta. Një asistent AI njeh Kosovën dhe të ndihmon ta planifikosh ditën.

**Problemi:** në vitin 2025 Kosova pati mbi **762,000 vizitorë**, dhe çdo verë kthehen qindra mijëra bashkatdhetarë. Megjithatë, shumica e vendeve mbeten të panjohura. Aplikacionet ekzistuese (Visit Kosovo, Dardania Live, EduPrizrenin) janë katalogë statikë: asnjëri nuk e vërteton vizitën dhe asnjëri nuk e bën eksplorimin diçka që e bën me miqtë.

**Për kë:** vizitorët e huaj · diaspora · të rinjtë dhe studentët vendas.

## 2. MVP-ja (çka duhet të funksionojë në demon finale)

1. **Llogaria:** regjistrimi, kyçja, profili, vendlindja ose shteti i diasporës, interesat, lejet.
2. **Qytetet:** të gjitha **38 komunat** në 7 rajone, me faqe për çdo qytet dhe vendet kryesore.
3. **Harta 2D/3D:** vendet (të zhbllokuara dhe jo), filtrat, terreni 3D, miqtë në hartë (opsionale, me *ghost mode*).
4. **Zhbllokimi me kamerë:** vetëm kamera e aplikacionit dhe GPS brenda rrezes së vendit, me verifikim në server (Python + PostGIS). Rezultati është **vula** në koleksion.
5. **Miqtë (social pa postime):** aktiviteti automatik i miqve, shtimi me kod QR, kartolinat digjitale, *friend streak*, sfidat javore të përbashkëta, renditja mes miqve.
6. **Chat dhe udhëtime:** chat në kohë reale, ndarja e një vendi në chat, udhëtime në grup me listë vendesh.
7. **AI:** *Ask Kosovo* (rekomandon vetëm vende reale nga databaza jonë) dhe *Plan my day*.
8. **Paneli admin (Django):** qytetet, vendet, eventet, moderimi dhe modaliteti demo.
9. **Shqip dhe anglisht** në të gjithë aplikacionin.

Të gjitha veçoritë (mbi 100), secila me pamje të ekranit, janë në **[Feature Atlas](https://claude.ai/artifact/Fh1ASH9JErhpenqCUmFxGw)**.

## 3. Teknologjia

| Pjesa | Zgjedhja |
| --- | --- |
| **Aplikacioni** (`app/`) | React Native me Expo, TypeScript, Apple Maps (harta 2D/3D), Expo Camera dhe Location |
| **Faqja e internetit** (`website/`) | React me TypeScript (Vite) |
| **Backend** (`backend/`) | **Python**: Django, Django REST Framework, GeoDjango, Django Channels (chat dhe lokacion në kohë reale) |
| **Databaza** | **PostgreSQL** në Docker (`docker compose up`), më vonë PostGIS për distancat |
| **AI** | Modele gjuhe dhe imazhi, të thirrura vetëm nga backend-i |
| **Dizajni** | Figma, FigJam |

## 4. Ndarja e punës

Puna ndahet sipas vështirësisë: anëtarët që sapo kanë filluar programimin marrin ekrane të lehta, ndërsa pjesët e vështira i marrin Rinori dhe Eliosi.

| Anëtari | Roli | Puna kryesore |
| --- | --- | --- |
| **Rinor Zeqiri** | Product Designer + frontend i vështirë | Dizajni i të gjitha ekraneve, komponentet e përbashkëta, Ballina, harta, kamera e zhbllokimit, animacionet; Docker dhe databaza |
| **Elios Mernica** | Backend Lead (Python) | Django API, autentifikimi, verifikimi i zhbllokimit, miqtë, chat-i dhe lokacioni në kohë reale, AI |
| **Krenare Veseli** | Faqja e internetit · Scrum Master | Faqja kryesore, lista e pritjes, faqja e aplikacionit; raportet e sprinteve; më vonë miqtë, kartolinat, udhëtimet |
| **Artiola Ferizi** | Ekrane | Onboarding: mirëseardhja, shiko përreth, vendi, gjuha, hyrja; më vonë profili dhe cilësimet |
| **Erleta Qerimi** | Ekrane | Onboarding: ku je sot, Kthimi, interesat, ruaje pasaportën, privatësia; më vonë qytetet, kërkimi, eventet |
| **Elvina Sinani** | Ekrane | Onboarding: krijuesi i avatarit, sendet, një shok, kilometri i parë; më vonë faqja e vendit, koleksioni, chat-i |

## 5. Plani javor

| Sprinti | Datat | Çka ndërtojmë |
| --- | --- | --- |
| 1 | 19–25 tetor | MVP-ja, hulumtimi, skeleti i `app/` dhe `backend/`, mësimi i React Native |
| 2 | 26 tetor – 1 nëntor | **Mirëseardhja:** regjistrimi, kyçja, profili; rrjeti i 38 qyteteve; API e autentifikimit |
| 3 | 2–8 nëntor | Faqja e qytetit dhe e vendit; API e vendeve; përmbajtja e komunave |
| 4 | 9–15 nëntor | **Harta 2D/3D**; API e zhbllokimit; koleksioni; përmbajtja |
| 5 | 16–22 nëntor | **Kamera dhe zhbllokimi → vula**; miqtë; eventet |
| 6 | 23–29 nëntor | Faqja kryesore, aktiviteti i miqve, kartolinat, *ghost mode*; chat-i në backend |
| 7 | 30 nëntor – 6 dhjetor | **Chat-i**, miqtë në hartë, udhëtimet në grup |
| 8 | 7–13 dhjetor | **AI:** *Ask Kosovo* dhe *Plan my day*; sfidat, *streak*, renditja |
| 9 | 14–20 dhjetor | Polish, aksesueshmëria, siguria, **beta test me 8+ përdorues** |
| 10 | 21–27 dhjetor | Versioni për publikim (APK) dhe raporti final |
| 11 | 4–10 janar | **v1.0, prezantimi dhe dorëzimi** |

## 6. Mënyra e punës

- **Scrum me sprinte javore:** planifikimi pas orës, *stand-up* tri herë në javë në grup dhe rishikimi në klasë.
- **GitHub Projects:** një kartelë për çdo anëtar për çdo javë (66 kartela), me listë detyrash brenda.
- **Degët:** të gjithë punojnë në **`staging`**. Puna e testuar kalon në `develop`, ndërsa në fund të çdo sprinti në `main`. `develop` dhe `main` janë të mbrojtura, kështu që gjithmonë kemi një kopje të sigurt.

## 7. Demo finale

Një përdorues i ri regjistrohet dhe sheh **të 38 qytetet**. Hap Prizrenin, e kthen hartën në **3D** dhe zhbllokon një vend me kamerë. Miku e sheh këtë në **aktivitetin e miqve**, i shkruan në **chat** dhe i dërgon një **kartolinë**. Koleksioni tregon vulën e re dhe *streak*-u i tyre rritet. *Ask Kosovo* përgjigjet "Çka të shoh në Gjakovë?", ndërsa admini shton një vend në panel dhe ai shfaqet menjëherë në aplikacion.

*Plani i detajuar: [docs/PLAN.md](PLAN.md)*
