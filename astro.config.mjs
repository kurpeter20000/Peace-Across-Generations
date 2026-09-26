// @ts-check
import { createHash } from 'node:crypto';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { lowDataInit } from './src/lib/inline-scripts.mjs';

const sha256 = (s) => `sha256-${createHash('sha256').update(s).digest('base64')}`;

// [TBD] Replace with the final domain once registered.
const SITE = 'https://peaceacrossgenerations.org';

export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  i18n: {
    // Only English exists at launch. Add 'ar' (RTL) and South Sudanese
    // languages here once the first translated page is ready.
    defaultLocale: 'en',
    locales: ['en'],
    routing: { prefixDefaultLocale: false },
  },
  // Shiki's inline styles break the CSP, and the site shows no code.
  markdown: { syntaxHighlight: false },
  integrations: [sitemap({ filter: (page) => !page.includes('/404') })],
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data: https://i.ytimg.com https://*.fbcdn.net",
        "media-src 'self'",
        "font-src 'self'",
        "connect-src 'self' https://cloudflareinsights.com",
        "frame-src https://www.youtube-nocookie.com https://www.facebook.com",
        "base-uri 'self'",
        "form-action 'self'",
        "object-src 'none'",
      ],
      scriptDirective: {
        resources: ["'self'", 'https://static.cloudflareinsights.com'],
        hashes: [sha256(lowDataInit)],
      },
    },
  },
});
