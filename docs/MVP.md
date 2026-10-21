# Discover Kosovo: Propozimi i MVP-së

**Grupi:** CommitCrew · **Lënda:** Menaxhimi i Projekteve · **Profesori:** Lorent Sinani
**Repository:** `menaxhimi-projekteve-commitcrew` (privat) · **Menaxhimi i taskave:** [GitHub Projects](https://github.com/users/rinorze/projects/1) · **Kohëzgjatja:** 11 sprinte javore (19 tetor 2026 – 10 janar 2027)

---

## 1. Ideja

**Discover Kosovo është një aplikacion mobil që bashkon zbulimin, udhëtimin dhe rrjetin social për të gjitha 38 komunat e Kosovës.**

Përdoruesi zgjedh një qytet, gjen vendet në hartë (2D dhe 3D), shkon atje dhe e **zhbllokon vendin me kamerën e aplikacionit**. Fotoja bëhet postim te miqtë, ndërsa në koleksionin e tij shtohet një vulë. Miqtë reagojnë, komentojnë, bisedojnë në chat dhe, nëse e lejojnë, shohin njëri-tjetrin në hartë. Një asistent AI njeh Kosovën dhe të ndihmon ta planifikosh ditën.

**Problemi:** në vitin 2025 Kosova pati mbi **762,000 vizitorë**, dhe çdo verë kthehen qindra mijëra bashkatdhetarë. Megjithatë, shumica e vendeve mbeten të panjohura. Informacioni është i shpërndarë, aplikacionet ekzistuese (Visit Kosovo, Dardania Live, EduPrizrenin) janë katalogë statikë, dhe njerëzit planifikojnë në Google Maps, ndajnë në Instagram e bisedojnë në WhatsApp. **Asnjë aplikacion nuk i bashkon këto, dhe asnjë nuk e vërteton që ke qenë vërtet në vend.**

**Për kë:** vizitorët e huaj · diaspora · të rinjtë dhe studentët vendas.

## 2. MVP-ja (çka duhet të funksionojë në demon finale)

1. **Llogaria:** regjistrimi, kyçja, profili, interesat dhe lejet (lokacioni, kamera).
2. **Qytetet:** të gjitha **38 komunat** në 7 rajone, me faqe për çdo qytet dhe vendet kryesore.
3. **Harta:** vendet në hartë (të zhbllokuara dhe të pazhbllokuara), filtrat, **modaliteti 3D** me terren.
4. **Zhbllokimi me kamerë:** vetëm kamera e aplikacionit dhe GPS brenda rrezes së vendit, me verifikim në server (Python + PostGIS). Rezultati është **vulë + postim**.
5. **Rrjeti social:** feed-i i miqve, pëlqimet, komentet, *follow*, profilet, njoftimet.
6. **Chat:** biseda 1:1 në kohë reale (grupet vijnë më pas).
7. **Koleksioni:** vulat sipas qyteteve dhe rajoneve, progresi ("12 nga 38 komuna").
8. **Paneli admin (Django):** qytetet, vendet, eventet dhe moderimi.
9. **Shqip dhe anglisht** në të gjithë aplikacionin, si dhe modaliteti demo për prezantim.

**E planifikuar më pas (Should):** miqtë në hartë (opsional, me *ghost mode*), grupet në chat, asistenti AI *Ask Kosovo*, *Plan my day*, verifikimi i fotos me AI, eventet (DokuFest, Sunny Hill, Anibar), leaderboard.

## 3. Teknologjia

| Pjesa | Zgjedhja |
| --- | --- |
| **Frontend** (`frontend/`) | React Native me Expo, TypeScript, Mapbox (harta 2D/3D), Expo Camera dhe Location |
| **Backend** (`backend/`) | **Python**: Django, Django REST Framework, GeoDjango, Django Channels (chat dhe lokacion në kohë reale) |
| **Databaza** | **PostgreSQL** me PostGIS (pikat e vendeve, poligonet e komunave), Redis |
| **AI** | Modele për imazh dhe tekst, të thirrura vetëm nga backend-i |
| **Dizajni** | Figma, FigJam |

## 4. Ndarja e punës

| Anëtari | Roli | Puna kryesore |
| --- | --- | --- |
| **Rinor Zeqiri** | Product Designer (UI/UX) | Hulumtimi, wireframes, sistemi i dizajnit, të gjithë ekranet në Figma, testimi me përdorues |
| **Elios Mernica** | Backend Lead (Python) | Django, PostgreSQL/PostGIS, autentifikimi, API e vendeve, verifikimi i zhbllokimit, AI |
| **Krenare Veseli** | Backend · Scrum Master | Modelet e qyteteve, postimet, komentet, njoftimet, chat-i, lokacioni live; raportet e sprinteve |
| **Artiola Ferizi** | Frontend | Onboarding, regjistrimi, kërkimi, feed-i, postimet, profili, cilësimet |
| **Erleta Qerimi** | Frontend | Qytetet, faqja e qytetit, harta 2D/3D, eventet, *Plan my day* |
| **Elvina Sinani** | Frontend | Faqja e vendit, kamera dhe zhbllokimi, koleksioni, chat-i, *Ask Kosovo* |

Përmbajtja e 38 komunave ndahet sipas rajoneve te të gjithë anëtarët.

## 5. Plani javor

| Sprinti | Datat | Çka ndërtojmë |
| --- | --- | --- |
| 1 | 19–25 tetor | MVP-ja, hulumtimi, skeleti i `frontend/` dhe `backend/`, PR-ja e parë e secilit |
| 2 | 26 tetor – 1 nëntor | **Onboarding:** splash, mirëseardhja, regjistrimi, kyçja; rrjeti i 38 qyteteve; API e autentifikimit |
| 3 | 2–8 nëntor | Faqja Explore, faqja e qytetit dhe e vendit; API e vendeve; *follow* |
| 4 | 9–15 nëntor | **Harta 2D/3D**, kamera; API e zhbllokimit; përmbajtja e 38 komunave |
| 5 | 16–22 nëntor | **Zhbllokimi → vula → postimi në feed** (cikli kryesor) |
| 6 | 23–29 nëntor | Komentet, njoftimet, profili, koleksioni, eventet; backend-i i chat-it |
| 7 | 30 nëntor – 6 dhjetor | **Chat-i**, miqtë në hartë, cilësimet e privatësisë |
| 8 | 7–13 dhjetor | **AI:** *Ask Kosovo* dhe *Plan my day*; grupet; njoftimet push |
| 9 | 14–20 dhjetor | Polish, aksesueshmëria, siguria, **beta test me 8+ përdorues** |
| 10 | 21–27 dhjetor | Versioni për publikim (APK) dhe raporti final |
| 11 | 4–10 janar | **v1.0, prezantimi dhe dorëzimi** |

## 6. Mënyra e punës

- **Scrum me sprinte javore:** planifikimi pas orës, *stand-up* tri herë në javë në grup dhe rishikimi në klasë.
- **GitHub Projects:** një kartelë për çdo anëtar për çdo javë (66 kartela), me listë detyrash brenda.
- **Degët:** të gjithë punojnë në **`staging`**. Puna e testuar kalon në `develop`, ndërsa në fund të çdo sprinti në `main`. `develop` dhe `main` janë të mbrojtura, kështu që gjithmonë kemi një kopje të sigurt.

## 7. Demo finale

Një përdorues i ri regjistrohet dhe sheh **të 38 qytetet**. Hap Prizrenin, e kthen hartën në **3D** dhe zhbllokon një vend me kamerë. Postimi i shfaqet mikut në feed, i cili e pëlqen, e komenton dhe i shkruan në **chat**. Koleksioni tregon vulën e re dhe progresin. *Ask Kosovo* përgjigjet "çka të shoh në Gjakovë?", ndërsa admini shton një vend në panel dhe ai shfaqet menjëherë në aplikacion.

*Plani i detajuar: [docs/PLAN.md](PLAN.md)*
