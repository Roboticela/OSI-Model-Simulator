import { canonicalUrl } from './site';

export interface RouteSeoConfig {
  path: '/' | '/quiz' | '/legacy';
  title: string;
  description: string;
  keywords: string;
}

export const SEO_ROUTES: RouteSeoConfig[] = [
  {
    path: '/',
    title: 'OSI Model Simulator - Interactive Network Layers Visualization',
    description:
      'An interactive web application that simulates the OSI model. Learn how data travels across the internet through seven network layers with visual examples.',
    keywords:
      'OSI model, network layers, internet, message transmission, TCP/IP, data encapsulation, networking, Roboticela',
  },
  {
    path: '/quiz',
    title: 'Networking Quiz Game - OSI Model Simulator',
    description:
      'Test your knowledge of the OSI Model, TCP/IP, and general networking concepts in this interactive quiz game.',
    keywords:
      'networking quiz, OSI model quiz, TCP/IP quiz, port matching, network layers game, Roboticela',
  },
  {
    path: '/legacy',
    title: 'Legacy OSI Model Simulator - Classic Interactive Simulation',
    description:
      'Try the legacy version of our OSI Model Simulator. Experience a classic step-by-step interactive networking layers visualization designed for education.',
    keywords:
      'legacy OSI simulator, classic network simulation, OSI model education, networking layers, Roboticela',
  },
];

export const PRERENDER_PATHS = SEO_ROUTES.map((r) => r.path);

const seoByPath = new Map(SEO_ROUTES.map((route) => [route.path, route]));

export function getRouteSeo(pathname: string): RouteSeoConfig {
  const normalized =
    pathname.length > 1 && pathname.endsWith('/')
      ? pathname.slice(0, -1)
      : pathname;

  return seoByPath.get(normalized as RouteSeoConfig['path']) ?? SEO_ROUTES[0];
}

export function getRouteSeoWithCanonical(pathname: string) {
  const route = getRouteSeo(pathname);
  return {
    ...route,
    canonicalUrl: canonicalUrl(route.path),
  };
}
