// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://panduanhajiumrah.vercel.app',
  trailingSlash: 'always',
  adapter: vercel(),

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    mdx(),
    sitemap({
      filter: (page) =>
        !page.includes('/404') &&
        !page.includes('/_') &&
        !page.includes('/tag/'),
      changefreq: 'monthly',
      priority: 0.7,
      lastmod: new Date(),
      i18n: {
        defaultLocale: 'ms',
        locales: { ms: 'ms-MY' },
      },
      serialize(item) {
        const url = item.url;
        // Homepage: highest priority
        if (url === 'https://panduanhajiumrah.vercel.app/') {
          item.priority = 1.0;
          item.changefreq = 'weekly';
        }
        // Section index pages
        else if (
          url.endsWith('/panduan/') ||
          url.endsWith('/artikel/') ||
          url.endsWith('/alat/')
        ) {
          item.priority = 0.9;
          item.changefreq = 'weekly';
        }
        // Guide pages (evergreen reference)
        else if (url.includes('/panduan/')) {
          item.priority = 0.8;
        }
        // Article subsections
        else if (url.match(/\/artikel\/[^/]+\/$/)) {
          item.priority = 0.7;
        }
        // Articles (fresh content)
        else if (url.includes('/artikel/')) {
          item.priority = 0.7;
          item.changefreq = 'weekly';
        }
        // Tools
        else if (url.includes('/alat/')) {
          item.priority = 0.6;
        }
        // Tentang, cari, etc
        else {
          item.priority = 0.4;
        }
        return item;
      },
    }),
  ],
});
