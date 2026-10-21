<div align="center">

# Discover Kosovo

### See it. Snap it. Unlock it.

**A social travel app for exploring all 38 municipalities of Kosovo with your friends.**
Find places on a 2D and 3D map, go there, unlock them with your camera, share the moment, and chat with the people you explore with.

![Expo](https://img.shields.io/badge/Expo-React_Native-000020?logo=expo&logoColor=white)
![Python](https://img.shields.io/badge/Python-Django-092E20?logo=django&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-PostGIS-336791?logo=postgresql&logoColor=white)
![Mapbox](https://img.shields.io/badge/Maps-2D_%26_3D-000000?logo=mapbox&logoColor=white)

[Project board](https://github.com/users/rinorze/projects/1) · [Plan](docs/PLAN.md) · [MVP (Shqip)](docs/MVP.md) · [How we work](CONTRIBUTING.md)

</div>

---

## The idea

Kosovo is small enough to cross in two hours, yet most people only know a handful of its places: Prishtina's boulevard, Prizren's fortress, Rugova's gorge. The rest, like the waterfalls of Mirusha, the fortress of Novo Brdo, the hidden bridges of Gjakova and the vineyards of Rahovec, stay invisible. They are spread across tourism websites, Instagram posts and word of mouth.

At the same time, the people who would love these places are everywhere. **More than 760,000 visitors came to Kosovo in 2025**, hundreds of thousands of diaspora come home every summer, and young locals are always looking for somewhere new to go on the weekend. Today they plan in Google Maps, share on Instagram and coordinate in WhatsApp, and nothing connects the three.

**Discover Kosovo puts discovering, travelling and social media into one app:**

- a living **map** of every city and place worth seeing, in 2D or in 3D over Kosovo's real mountains;
- a **camera unlock**: when you are really at a place, you snap it in the app and it unlocks, so every post is proof you were there;
- a **social layer** where friends see your unlocks, react, comment, chat, and (if you choose) see where you are;
- an **AI guide** that knows Kosovo and plans your day around the places you haven't unlocked yet.

## How it works

| 1. Pick a city | 2. Find a place | 3. Go and snap it | 4. Unlock and share |
| --- | --- | --- | --- |
| Browse all 38 municipalities as big photo cards and open a city to see its best places, events and posts. | Explore the map in 2D, or tilt to 3D to see Rugova, Sharr and Bjeshkët e Nemuna in real terrain. | Inside the place's radius, the camera opens. GPS (and AI, later) checks you are really there. | The place unlocks with an animation, your photo becomes a post, and your city progress grows. |

## What's inside

**🧭 Explore**
- City grid with all **38 municipalities** and **7 regions**, plus a detail page per city (top places, events, posts, your progress)
- Place pages with photos, history, opening hours, directions and the posts people made there
- Search, categories (history, nature, food, culture, nightlife, hidden gems) and saved places

**🗺️ Map: 2D and 3D**
- Switch between a clean 2D map and a 3D view with terrain and buildings
- Locked and unlocked places, friends who share their location, and live events on one map

**📸 Unlock and collection**
- Unlock a place by taking a photo of it with the in-app camera while you are there
- Every unlock adds a stamp to your collection. Finish a city or a whole region and its gold stamp is yours
- The big goal: one stamp in **every one of the 38 municipalities**
- City progress ("12 of 30 places in Prizren") and festival stamps that exist only during DokuFest, Sunny Hill or Anibar

**💬 Social**
- A home feed of friends' unlocks and posts, with likes, comments and shares
- Friends and followers, profiles with your posts, your stamps and your map
- **Chat** one-to-one and in groups, and send a place or a post straight into a chat
- **Friends on the map** (opt-in), with ghost mode and city-level precision for privacy

**✨ AI**
- *Ask Kosovo*: a chat guide that answers questions using our own place data
- *Plan my day*: a trip plan built from your time, interests and locked places
- Photo check: AI confirms the photo really shows the place you are unlocking

**🛡️ Safe by design**
- Location sharing is off by default, and photos and posts can be reported, users can be blocked, and you can delete your account at any time
- Admin panel for places, cities, events and moderation

## Every city of Kosovo

| Region | Municipalities |
| --- | --- |
| **Prishtinë** | Prishtinë · Fushë Kosovë · Obiliq · Lipjan · Podujevë · Drenas · Graçanicë · Novobërdë |
| **Mitrovicë** | Mitrovicë · Mitrovicë e Veriut · Vushtrri · Skënderaj · Zveçan · Zubin Potok · Leposaviq |
| **Pejë** | Pejë · Istog · Klinë |
| **Prizren** | Prizren · Suharekë · Malishevë · Dragash · Mamushë |
| **Ferizaj** | Ferizaj · Kaçanik · Shtime · Shtërpcë · Hani i Elezit |
| **Gjilan** | Gjilan · Kamenicë · Viti · Kllokot · Ranillug · Partesh |
| **Gjakovë** | Gjakovë · Rahovec · Deçan · Junik |

## Who it's for

- **Visitors**: a trustworthy, beautiful guide that shows what is actually worth seeing, with a reason to go beyond the capital.
- **The diaspora**: rediscover home with family and friends, keep the memories, and see who else is in town this summer.
- **Locals and students**: weekend plans, friendly competition between friends and cities, and a social feed built around real places.

## Built with

| | |
| --- | --- |
| **Frontend** (`frontend/`) | React Native with Expo · TypeScript · Expo Router · Mapbox (2D/3D) · Expo Camera and Location |
| **Backend** (`backend/`) | Python · Django and Django REST Framework · GeoDjango · Django Channels (chat and live location) |
| **Database** | PostgreSQL with PostGIS · Redis |
| **AI** | Vision and language models, called only from the backend |
| **Design** | Figma · FigJam |

## Team: CommitCrew

| Member | Role |
| --- | --- |
| Rinor Zeqiri · [@rinorze](https://github.com/rinorze) | Product Designer: UI/UX and the whole look and feel of the app |
| Elios Mernica · [@eliosmernica15](https://github.com/eliosmernica15) | Backend Lead: Python, database, unlocks, AI |
| Krenare Veseli · [@krenareveselii](https://github.com/krenareveselii) | Backend Developer: social, chat, live location · Scrum Master |
| Artiola Ferizi · [@artiolaferizi](https://github.com/artiolaferizi) | Frontend Developer: onboarding, profile, feed |
| Erleta Qerimi · [@erletaqerimi-oss](https://github.com/erletaqerimi-oss) | Frontend Developer: cities, places, 2D/3D map |
| Elvina Sinani · [@elvinasinani-netizen](https://github.com/elvinasinani-netizen) | Frontend Developer: camera unlock, collection, chat, AI |

Course *Menaxhimi i Projekteve* (Prof. Lorent Sinani): 11 one-week sprints, October 2026 – January 2027. Every task, owner and deadline lives on the [project board](https://github.com/users/rinorze/projects/1).
