import type { Href } from 'expo-router';

/**
 * Every onboarding screen in the order of the design (docs/design/screens/01-onboarding).
 * The design has several paths (guest, diaspora, returning users), so a normal tap does not visit every screen.
 * DevNav walks this list one by one, so anyone can open screen 1.1 to 1.14 in order.
 * Add a line here when a screen is added; the number is the one in the design.
 */
export const onboardingScreens: { step: string; href: Href; title: string; owner: string }[] = [
  { step: '1.1', href: '/welcome', title: 'Mirë se vjen', owner: 'Artiola' },
  { step: '1.2', href: '/look-around', title: 'Shiko përreth', owner: 'Artiola' },
  { step: '1.3', href: '/guest-place', title: 'Kalaja e Novobërdës', owner: 'Artiola' },
  { step: '1.4', href: '/language', title: 'Gjuha', owner: 'Artiola' },
  { step: '1.5', href: '/where-today', title: 'Ku je sot?', owner: 'Erleta' },
  { step: '1.6', href: '/kthimi', title: 'Kthimi', owner: 'Erleta' },
  { step: '1.7', href: '/interests', title: 'Çfarë të pëlqen?', owner: 'Erleta' },
  { step: '1.8', href: '/avatar', title: 'Pamja jote', owner: 'Elvina' },
  { step: '1.9', href: '/avatar-rewards', title: 'Sende që i fiton', owner: 'Elvina' },
  { step: '1.10', href: '/save-passport', title: 'Ruaje pasaportën', owner: 'Erleta' },
  { step: '1.11', href: '/privacy', title: 'Privat që në fillim', owner: 'Erleta' },
  { step: '1.12', href: '/one-friend', title: 'Mjafton një shok', owner: 'Elvina' },
  { step: '1.13', href: '/first-km', title: 'Kilometri i parë', owner: 'Elvina' },
  { step: '1.14', href: '/sign-in', title: 'Hyr', owner: 'Artiola' },
];
