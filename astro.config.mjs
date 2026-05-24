// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://panduanhajiumrah.vercel.app',
  trailingSlash: 'always',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    mdx(),
    sitemap({
      filter: (page) =>
        !page.includes('/404') && !page.includes('/_'),
      changefreq: 'monthly',
      priority: 0.7,
      lastmod: new Date(),
      i18n: {
        defaultLocale: 'ms',
        locales: { ms: 'ms-MY' },
      },
    }),
  ],
});