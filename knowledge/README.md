# Knowledge Base — Panduan Haji & Umrah

**Internal source-of-truth for the AI content pipeline.**
**NOT served on the public site.**

This folder contains curated knowledge that:

1. **Researcher** agent reads + extends with verified facts from whitelist sources
2. **Writer** agent uses as ground-truth context when drafting articles
3. **Fact-checker** agent verifies article claims against these notes + source URLs

Articles in `src/content/` are the *output*. This folder is the *input*.

---

## Whitelist Source Policy

Citation MUST be from one of these domains. Anything else fails CI.

### Authoritative (Malaysia)
- **JAKIM e-Fatwa** — `e-smaf.islam.gov.my`
- **Mufti Wilayah Persekutuan** — `muftiwp.gov.my`
- **Tabung Haji** — `tabunghaji.gov.my`
- **JAKIM** — `islam.gov.my`

### Authoritative (Indonesia)
- **Kemenag RI** — `kemenag.go.id`, `haji.kemenag.go.id`
- **MUI** — `mui.or.id`

### Primary text
- **Quran** — `quran.com`, `tafsirq.com`, `tafsirweb.com`
- **Hadis** — `sunnah.com`

### Saudi authority (logistics)
- **Hajj Ministry** — `haj.gov.sa`, `moia.gov.sa`

### Singapore conservative reference
- **MUIS** — `muis.gov.sg`

The full enforcement list lives in `src/content.config.ts` → `ALLOWED_SOURCE_DOMAINS`.

---

## Format Convention

Each `.md` file = one topic. Within a file:

```markdown
---
topic: <topic-slug>
lastVerified: 2026-05-24
sources:
  - label: "JAKIM Fatwa - <topic>"
    url: https://e-smaf.islam.gov.my/...
---

# <Topic Name>

## Ringkasan
<2-3 line summary>

## Fakta Utama
- Fact 1 [^source-id]
- Fact 2 [^source-id]

## Hujah Dalil
> Quotation from primary source
[^source-id]

## Persoalan Lazim (FAQ)

**Q: ...?**
A: ... [^source-id]

## Rujukan
[^source-id]: <Source label>. URL. Diakses YYYY-MM-DD.
```

Rules:
- Every claim has `[^source-id]` inline citation.
- Source URLs MUST be on whitelist (CI enforces).
- `lastVerified` updated when Researcher re-runs.
- BM (Bahasa Melayu standard MY/ID) primary; Arabic Quran/hadis preserved verbatim with translation.

---

## Files

- `haji-rukun.md` — 5 rukun haji
- `larangan-ihram.md` — larangan dalam keadaan ihram
- `umrah-rukun.md` — 5 rukun umrah
- `sunnah-harian.md` — sunnah-sunnah harian jemaah
- `dalil-sumber.md` — peta sumber dalil dengan kategori
