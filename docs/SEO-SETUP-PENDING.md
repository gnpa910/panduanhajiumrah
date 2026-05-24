# SEO + Domain Migration — Pending Tasks

**Status:** SEO foundation deployed pada `panduanhajiumrah.vercel.app`. Tunggu migrate ke
`panduanhajiumrah.com` (domain sebenar) baru setup Search Console + Analytics, supaya tak
perlu verify dua kali.

**Last commit (foundation):** `e36ead8` — feat(seo): vercel.json + og-default.png

---

## ✅ Apa Yang Dah Siap (jangan ulang)

- `@astrojs/sitemap` integration → `/sitemap-index.xml` + `/sitemap-0.xml` (37 URLs)
- `astro.config.mjs`: `site` set + `trailingSlash: 'always'`
- `BaseLayout.astro`: WebSite + Organization JSON-LD, og:image, robots meta, canonical
- `[section]/[slug].astro` + `[category]/[slug].astro`: Article + BreadcrumbList JSON-LD
- `berita` category emits `NewsArticle` schema (bukan generic Article)
- `public/robots.txt` (points to sitemap-index.xml)
- `public/og-default.png` (1200×630, Madinah ink + saffron 8-point star)
- `public/og-default.svg` (source, regenerate via `rsvg-convert`)
- `src/pages/404.astro` (custom 404 with 3 entry cards)
- `vercel.json` (XML headers, robots cache)

---

## 🔄 Phase 1: Domain Migration (panduanhajiumrah.com)

### A. Vercel — point custom domain

1. Buka https://vercel.com/gnpa910-9440s-projects/panduanhajiumrah/settings/domains
2. Add Domain → `panduanhajiumrah.com` AND `www.panduanhajiumrah.com`
3. Vercel akan bagi DNS records (A + CNAME atau nameservers)
4. Setup di registrar — kalau Cloudflare, gunakan A `76.76.21.21` + CNAME `www → cname.vercel-dns.com`
5. Tunggu DNS propagate (5 min – 1 jam), Vercel auto-provision SSL

### B. Update repo references

```bash
cd /root/projects/panduanhajiumrah
```

Files yang ada `panduanhajiumrah.vercel.app` (replace ke `panduanhajiumrah.com`):

```
astro.config.mjs               (site: ...)
src/layouts/BaseLayout.astro   (siteUrl fallback)
src/pages/panduan/[section]/[slug].astro   (siteUrl fallback)
src/pages/artikel/[category]/[slug].astro  (siteUrl fallback)
public/robots.txt              (Sitemap: ...)
```

Quick sed (verify with grep first):

```bash
grep -rn "panduanhajiumrah.vercel.app" --include="*.astro" --include="*.mjs" --include="*.txt" .
```

### C. Set Vercel primary domain

Settings → Domains → set `panduanhajiumrah.com` sebagai PRIMARY. Vercel akan auto-301 dari
`vercel.app` ke `.com`. Bagus untuk SEO juice consolidation.

### D. Build + deploy

```bash
cd /root/projects/panduanhajiumrah && npm run build && \
vercel deploy --prod --yes --token $(grep -oP 'VERCEL_TOKEN=\K.*' ~/.hermes/secrets/vercel.env)
```

### E. Verify

```bash
curl -sI https://panduanhajiumrah.com/sitemap-index.xml | head -5
curl -s https://panduanhajiumrah.com/robots.txt
curl -sI https://panduanhajiumrah.vercel.app/  # should 308 → .com
```

---

## 🔄 Phase 2: Google Search Console

```
https://search.google.com/search-console
```

1. Add property → **Domain** type (cover semua subdomain): `panduanhajiumrah.com`
2. Verify via DNS TXT record di registrar (Cloudflare/etc)
3. Submit sitemap: `sitemap-index.xml`
4. URL Inspection — request indexing untuk 3-5 top pages:
   - `/`
   - `/panduan/persiapan/istitaah-syarat-mampu-tunai-haji/`
   - `/panduan/haji/rukun-haji-enam-perkara/`
   - `/artikel/berita/persiapan-haji-2026-tabung-haji-malaysia/`

---

## 🔄 Phase 3: Google Analytics 4

```
https://analytics.google.com
```

1. Admin → Create Property → `Panduan Haji Umrah`
2. Timezone: Malaysia (GMT+8), Currency: MYR
3. Industry: Travel / Online Communities
4. Web stream → `https://panduanhajiumrah.com`
5. Dapat Measurement ID `G-XXXXXXXXXX`
6. **Hantar ID ke Hermes** — aku tambah gtag.js dengan Consent Mode v2 ke BaseLayout,
   deploy. Tak guna third-party plugin, direct script supaya tak bag Lighthouse score.

---

## 🔄 Phase 4: Bing Webmaster (optional, 3 min)

```
https://www.bing.com/webmasters
```

- Import from Google Search Console (one-click kalau GSC dah verified)
- Submit sitemap: `https://panduanhajiumrah.com/sitemap-index.xml`
- Bing index lebih cepat untuk niche BM topics + IndexNow API auto-ping

---

## 🔄 Phase 5 (Optional): Privacy-friendly analytics

Kalau tak nak Google tracking, alternative:

- **Umami** (self-host) — boleh deploy ke VPS sebelah Caddy. Free, GDPR-compliant.
- **Plausible** ($9/month) — hosted, no cookies.

GA4 tetap recommended sebab GSC integration & free, tapi kalau audience care privacy
boleh dual-track or replace.

---

## Resume Prompt (paste ke Hermes bila ready)

```
Mari sambung migration panduanhajiumrah.com.

Baca dulu /root/projects/panduanhajiumrah/docs/SEO-SETUP-PENDING.md untuk
context penuh apa yang dah done dan apa pending.

Status sekarang: [tulis kat sini — domain dah point ke Vercel? DNS dah verify?
GSC dah dapat verification code? GA4 dah ada Measurement ID?]

Mula dari Phase yang relevan ikut status di atas.
```
