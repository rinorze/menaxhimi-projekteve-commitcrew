<div align="center">

# Discover Kosovo

### See it. Snap it. Unlock it.

**A travel and discovery app for all 38 municipalities of Kosovo that feels like social media, without posts, likes or comments.**
Find places on a 2D and 3D map, go there, unlock them with your camera, and explore Kosovo together with your friends.

![Expo](https://img.shields.io/badge/Expo-React_Native-000020?logo=expo&logoColor=white)
![Python](https://img.shields.io/badge/Python-Django-092E20?logo=django&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-PostGIS-336791?logo=postgresql&logoColor=white)
![Apple Maps](https://img.shields.io/badge/Maps-2D_%26_3D-000000?logo=apple&logoColor=white)
![React](https://img.shields.io/badge/Website-React-20232A?logo=react&logoColor=61DAFB)
![Docker](https://img.shields.io/badge/Docker-PostgreSQL-2496ED?logo=docker&logoColor=white)

[Project board](https://github.com/users/rinorze/projects/1) · [Plan](docs/PLAN.md)

</div>

---

## The idea

Kosovo is small enough to cross in a few hours, yet most people only know a handful of its places: Prishtina's boulevard, Prizren's fortress, Rugova's gorge. The rest, like the waterfalls of Mirusha, the fortress of Novo Brdo, the hidden bridges of Gjakova and the vineyards of Rahovec, stay invisible.

At the same time, the people who would love these places are everywhere. **More than 760,000 visitors came to Kosovo in 2025**, hundreds of thousands of diaspora come home every summer, and young locals are always looking for somewhere new to go on the weekend.

**Discover Kosovo turns exploring the country into something you do with your friends:**

- a living **map** of every city and place worth seeing, in 2D or in 3D over Kosovo's real mountains;
- a **camera unlock**: when you are really at a place, you take the photo in the app and it unlocks, so every stamp proves you were there;
- **friends instead of a feed**: no posts, no likes, no comments. You see what your friends actually do (who unlocked what, who is in Prizren tonight, who is on a streak), and you chat, plan trips, send postcards and finish quests together;
- an **AI guide** that knows Kosovo and plans your day around the places you haven't unlocked yet.

## How it works

| 1. Pick a city | 2. Find a place | 3. Go and snap it | 4. Unlock it, together |
| --- | --- | --- | --- |
| Browse all 38 municipalities as big photo cards and open a city to see its best places and events. | Explore the map in 2D, or tilt to 3D to see Rugova, Sharr and Bjeshkët e Nemuna in real terrain. | Inside the place's radius the camera opens. The server checks GPS, accuracy and fake-GPS. | The stamp lands in your collection, your friends see it in their activity, and your streak grows. |

## What's inside

**🧭 Explore:** all 38 municipalities and 7 regions, city pages, place pages with stories in Albanian and English, search, categories, saved places, events and festivals.

**🗺️ Map 2D & 3D:** places (locked, unlocked, saved), real terrain in 3D, filters, friends on the map, and fog that clears as you explore.

**📸 Unlock & collection:** an in-app camera only, verified on the server, a stamp animation, the collection by region, city completed and the goal of **one stamp in every municipality**.

**🤝 Together (social, without posts):** friend activity, friends nearby, add a friend by QR code, digital postcards, friend streaks, weekly friend quests, leaderboards, co-op places that need two friends, "Bump" when you meet, meetups and circles.

**💬 Chat & trips:** real-time chat, sharing a place in chat, trip group chats, shared trip checklists.

**✨ AI:** *Ask Kosovo* (a guide that only recommends real places) and *Plan my day* (a route for your free hours).

**🛡️ Private by default:** location sharing off by default, ghost mode, precision and time limits, private unlock photos, block and report, and account deletion.

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

## Team: CommitCrew

| Member | Role |
| --- | --- |
| Rinor Zeqiri · [@rinorze](https://github.com/rinorze) | Product Designer: designs every screen; builds the shared components, Home and map; Docker and the database; reviews every pull request |
| Elios Mernica · [@eliosmernica15](https://github.com/eliosmernica15) | Backend Lead: Django API, unlock checks, real time, AI |
| Krenare Veseli · [@krenareveselii](https://github.com/krenareveselii) | The website (landing page, waiting list, app page) · Scrum Master |
| Artiola Ferizi · [@artiolaferizi](https://github.com/artiolaferizi) | Onboarding: welcome, look around, guest place, language, sign in |
| Erleta Qerimi · [@erletaqerimi-oss](https://github.com/erletaqerimi-oss) | Onboarding: where are you today, Kthimi, interests, save passport, privacy |
| Elvina Sinani · [@elvinasinani-netizen](https://github.com/elvinasinani-netizen) | Onboarding: avatar creator, avatar items, one friend, first km |

Course *Menaxhimi i Projekteve* (Prof. Lorent Sinani): 11 one-week sprints, October 2026 – January 2027. Every member has cards on the [project board](https://github.com/users/rinorze/projects/1); work goes on your own branch and into `staging` through a pull request.
