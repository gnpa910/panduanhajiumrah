/**
 * Whitelist sumber rasmi untuk panduanhajiumrah.com (PAN-5).
 *
 * Single source of truth — referenced by:
 *   1. src/content.config.ts schema (URL refinement on guide.sources)
 *   2. tools/citation-linter (PAN-10) — CI gate before publish
 *   3. Researcher agent (PAN-9) — fetches only from these
 *
 * Rules untuk tambah domain baru:
 *   - Mesti `.gov.my`, `.gov.sg`, `.gov.sa`, `.go.id`, atau organisasi
 *     yang diiktiraf rasmi dalam bidang haji/umrah/fiqh
 *   - Saudi: kerajaan / vendor authorized hajj services
 *   - Hadis/Quran: hanya yang ada chain reference + scholarly review
 *   - JANGAN tambah blogspot/medium/wordpress generic — hanya tapak
 *     dengan editorial review
 */

export const WHITELIST_SUMBER = {
  /** Malaysian official authorities */
  malaysia: [
    "e-smaf.islam.gov.my", // JAKIM e-fatwa
    "muftiwp.gov.my", // Mufti Wilayah Persekutuan
    "tabunghaji.gov.my", // Tabung Haji
    "www.tabunghaji.gov.my",
    "islam.gov.my", // JAKIM
    "www.islam.gov.my",
    "muis.gov.sg", // MUIS Singapore
  ],

  /** Indonesian official authorities */
  indonesia: [
    "kemenag.go.id", // Kementerian Agama RI
    "haji.kemenag.go.id",
    "mui.or.id", // Majlis Ulama Indonesia
  ],

  /** Saudi Arabia (haji logistics + ministry) */
  saudi: [
    "haj.gov.sa", // Ministry of Hajj & Umrah
    "moia.gov.sa", // Ministry of Islamic Affairs
  ],

  /** Quran + hadis primary sources */
  primary: [
    "quran.com",
    "sunnah.com",
    "tafsirq.com",
    "tafsirweb.com",
  ],
} as const;

/** Flat list — used by Zod refinement + linter */
export const ALLOWED_SOURCE_DOMAINS = [
  ...WHITELIST_SUMBER.malaysia,
  ...WHITELIST_SUMBER.indonesia,
  ...WHITELIST_SUMBER.saudi,
  ...WHITELIST_SUMBER.primary,
] as const;

export type WhitelistDomain = (typeof ALLOWED_SOURCE_DOMAINS)[number];

/**
 * Validate URL against whitelist. Used by:
 *   - content.config.ts (Zod refinement) — fails astro check
 *   - citation linter (PAN-10) — fails CI before deploy
 */
export function isWhitelistedSource(url: string): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return (ALLOWED_SOURCE_DOMAINS as readonly string[]).includes(host);
  } catch {
    return false;
  }
}

/** Pretty-print domain category for editor surfacing / error messages */
export function whitelistCategory(url: string): string | null {
  try {
    const host = new URL(url).hostname.toLowerCase();
    for (const [cat, doms] of Object.entries(WHITELIST_SUMBER)) {
      if ((doms as readonly string[]).includes(host)) return cat;
    }
    return null;
  } catch {
    return null;
  }
}
