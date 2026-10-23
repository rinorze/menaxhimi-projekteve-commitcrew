# Design

The final design of Discover Kosovo: **one version of every screen**, in the order a user meets the app (the same numbers as the canvas: 1.1, 1.2 …), in light mode (Home also in dark mode). Onboarding is shown in Albanian, the language the app opens in. The app is **in Albanian first**, then English; German and French can be chosen on the Language screen.

## Folders

| Folder | What is inside |
| --- | --- |
| [kit/](kit) | **Start here.** [Colours](kit/colors.png) (light and dark, with codes), [typography](kit/typography.png), [spacing, corners, buttons, shadows](kit/spacing-corners-buttons.png) |
| [screens/01-onboarding](screens/01-onboarding) | The 14 onboarding screens, numbered in the order the user sees them (1.1 Welcome … 1.14 Sign in) |
| [screens/02-home](screens/02-home) | Home (full scroll), Home in dark mode, loading, notifications, widgets |
| [screens/03-map](screens/03-map) | Places & Pins: Kosovo zoom, city zoom, pin card front and back, location primer, 3D, layers |
| [screens/04-places](screens/04-places) | Search, search results, city, place, collection, events, municipality complete |
| [screens/05-unlock-passport](screens/05-unlock-passport) | Camera (in range / too far), photo rejected, stamp, stamp detail, postcard, passport |
| [screens/06-friends-chat](screens/06-friends-chat) | Friends, add a friend, friend added, friend profile, Together stamp, chats |
| [screens/07-plan-play](screens/07-plan-play) | Trips, new trip, trip plan, Ask Kosovo, challenges |
| [screens/08-stay-eat-safety](screens/08-stay-eat-safety) | Stay, eat, dish, emergency, offline packs |
| [screens/09-profile-settings](screens/09-profile-settings) | Profile, settings |
| [screens/10-website](screens/10-website) | Landing page, waiting list, app page |
| [screens/11-design-system](screens/11-design-system) | The component kit and the motion spec (timings and haptics) |
| [assets/photos](assets/photos) | The place photos used in the design ([credits](assets/photos/CREDITS.md): keep them) |
| [assets/avatars](assets/avatars) | The avatars (SVG). Made with [DiceBear Micah](https://www.dicebear.com/styles/micah/), CC BY 4.0, credit Micah Lanier |

## Using it in Figma

1. Make a page per folder and drag the screen pictures in (they are 390 × 844, the iPhone size). Lock them, then draw on top or next to them.
2. **Colours:** open [kit/colors.png](kit/colors.png), and create a Figma colour style for each row (`label`, `bg`, `blue`…) by pasting the code. The eyedropper also works on the swatches.
3. **Text:** create the text styles from [kit/typography.png](kit/typography.png) (size / line height / weight). Font: **SF Pro**.
4. **Real iOS parts:** duplicate Apple’s free iOS 26 kit (tab bar, buttons, sheets, keyboard) into your drafts and copy from it instead of drawing your own.

## Links

| What | Link |
| --- | --- |
| Apple design resources (iOS 26 Figma kit, templates) | https://developer.apple.com/design/resources/ |
| Real iPhone frames for the website (Product Bezels) | https://developer.apple.com/design/resources/#product-bezels |
| SF Pro font (install it to see the right font in Figma) | https://developer.apple.com/fonts/ |
| SF Symbols app (all icon names; in code: `expo-symbols`) | https://developer.apple.com/sf-symbols/ |
| Human Interface Guidelines | https://developer.apple.com/design/human-interface-guidelines/ |
| Materials and Liquid Glass | https://developer.apple.com/design/human-interface-guidelines/materials |
| Motion references from real apps | https://60fps.design/ |
| Expo (the app framework) | https://docs.expo.dev/ |

## Rules

- Colours only from the kit. **Gold only for rewards** (stamps, badges, Unlock when you are inside the circle).
- Real data only: no invented numbers.
- Tap targets at least 44 × 44 pt.
- Texts in Albanian first (`sq`), English second (`en`).
