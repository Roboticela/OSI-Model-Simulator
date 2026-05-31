export const SITE_URL = 'https://app.osi-model-simulator.roboticela.com';

export const SITE_NAME = 'OSI Model Simulator';

export const DEFAULT_OG_IMAGE = `${SITE_URL}/Favicon.svg`;

export function canonicalUrl(path: string): string {
  if (path === '/' || path === '') {
    return `${SITE_URL}/`;
  }
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
