import fs from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';
import { injectSeoIntoHtml } from '../src/seo/html';
import { PRERENDER_PATHS, SEO_ROUTES } from '../src/seo/routes';

export function prerenderSeoPlugin(): Plugin {
  return {
    name: 'prerender-seo',
    apply: 'build',
    closeBundle() {
      const distDir = path.resolve('dist');
      const indexPath = path.join(distDir, 'index.html');

      if (!fs.existsSync(indexPath)) {
        console.warn('[prerender-seo] dist/index.html not found, skipping.');
        return;
      }

      const template = fs.readFileSync(indexPath, 'utf-8');

      for (const route of SEO_ROUTES) {
        const html = injectSeoIntoHtml(template, route);
        const outDir =
          route.path === '/'
            ? distDir
            : path.join(distDir, route.path.slice(1));
        const outFile = path.join(outDir, 'index.html');

        if (route.path !== '/') {
          fs.mkdirSync(outDir, { recursive: true });
        }

        fs.writeFileSync(outFile, html, 'utf-8');
      }

      console.info(
        `[prerender-seo] Generated HTML for: ${PRERENDER_PATHS.join(', ')}`,
      );
    },
  };
}
