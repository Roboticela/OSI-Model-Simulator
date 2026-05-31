import type { RouteSeoConfig } from './routes';
import { canonicalUrl, DEFAULT_OG_IMAGE, SITE_NAME } from './site';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function replaceMeta(
  html: string,
  selector: 'name' | 'property',
  key: string,
  content: string,
): string {
  const attr = selector === 'name' ? 'name' : 'property';
  const pattern = new RegExp(
    `<meta\\s+${attr}="${key}"\\s+content="[^"]*"\\s*/?>`,
    'i',
  );
  const replacement = `<meta ${attr}="${key}" content="${escapeHtml(content)}" />`;

  if (pattern.test(html)) {
    return html.replace(pattern, replacement);
  }

  return html.replace('</head>', `    ${replacement}\n  </head>`);
}

function replaceLinkCanonical(html: string, href: string): string {
  const pattern = /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i;
  const replacement = `<link rel="canonical" href="${escapeHtml(href)}" />`;

  if (pattern.test(html)) {
    return html.replace(pattern, replacement);
  }

  return html.replace('</head>', `    ${replacement}\n  </head>`);
}

/** Inject route SEO into static HTML (build-time prerender). */
export function injectSeoIntoHtml(html: string, route: RouteSeoConfig): string {
  const url = canonicalUrl(route.path);
  let next = html;

  next = next.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(route.title)}</title>`);
  next = replaceMeta(next, 'name', 'title', route.title);
  next = replaceMeta(next, 'name', 'description', route.description);
  next = replaceMeta(next, 'name', 'keywords', route.keywords);
  next = replaceMeta(next, 'property', 'og:title', route.title);
  next = replaceMeta(next, 'property', 'og:description', route.description);
  next = replaceMeta(next, 'property', 'og:url', url);
  next = replaceMeta(next, 'property', 'og:site_name', SITE_NAME);
  next = replaceMeta(next, 'property', 'og:image', DEFAULT_OG_IMAGE);
  next = replaceMeta(next, 'property', 'twitter:title', route.title);
  next = replaceMeta(next, 'property', 'twitter:description', route.description);
  next = replaceMeta(next, 'property', 'twitter:image', DEFAULT_OG_IMAGE);
  next = replaceLinkCanonical(next, url);

  return next;
}
