# Panduan Haji & Umrah

Content site untuk jemaah haji dan umrah Malaysia & Indonesia, dalam Bahasa Melayu,
disemak fakta terhadap sumber rasmi (JAKIM, Mufti Wilayah, Tabung Haji, Kemenag).

## Stack

- **Astro 6** static site (hybrid-ready untuk chatbot API future)
- **Tailwind CSS v4** styling
- **MDX** content (rich markdown dengan komponen)
- **Vercel** deployment
- **Paperclip + Hermes Agent** orchestration (panduanhajiumrah company)

## Architecture

```
knowledge/                  ← Internal source-of-truth (NOT served)
src/content/
  ├── guide/                ← /panduan/<section>/<slug> (evergreen A-Z)
  ├── article/              ← /artikel/<category>/<slug> (fresh content)
  └── author/               ← Author profiles
src/content.config.ts       ← Strict Zod schema + whitelist enforcement
```

## Content Pipeline

| Agent              | Role                                                  |
|--------------------|-------------------------------------------------------|
| **Researcher**     | Reads whitelist sources, populates `knowledge/`       |
| **Writer**         | Drafts MDX article from researched knowledge          |
| **Fact-checker**   | Verifies every claim against whitelist URLs           |
| **SEO Specialist** | Refines title/description/tags for search intent      |
| **Video Script**   | Adapts published article into TikTok voiceover script |
| **CEO (Aiman)**    | Approval gate via Paperclip dashboard                 |

## Whitelist Sources (CI-enforced)

JAKIM e-Fatwa, Mufti Wilayah Persekutuan, Tabung Haji, JAKIM, Kemenag RI,
MUI, MUIS Singapore, Hajj Ministry Saudi, Quran.com, Sunnah.com, TafsirQ,
TafsirWeb. Full list dalam `src/content.config.ts`.

## Develop

```bash
pnpm install
pnpm dev    # http://localhost:4321
pnpm build
```
