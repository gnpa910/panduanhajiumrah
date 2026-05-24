/**
 * Astro Content Collections — strict Zod schema for AI-generated content.
 *
 * Design intent:
 *   The schema is the ENFORCEMENT layer. Even when a cheaper model writes,
 *   `astro sync` + `astro build` will reject malformed frontmatter at CI time.
 *   This is intentional: model quality drift cannot bypass these gates.
 *
 *   Schema rules > prompt instructions. Always.
 */

import { defineCollection, reference, z } from "astro:content";
import { glob, file } from "astro/loaders";

import { ALLOWED_SOURCE_DOMAINS, isWhitelistedSource } from "./data/whitelist-sumber";

/* ──────────────────────────────────────────────────────────────────────────
 *  WHITELIST: see src/data/whitelist-sumber.ts (PAN-5).
 *  Validate via isWhitelistedSource — exact host match only.
 * ──────────────────────────────────────────────────────────────────────────
 */

const sourceSchema = z.object({
  label: z.string().min(3, "Source label too short").max(120),
  url: z.string().url().refine(isWhitelistedSource, {
    message: `URL must belong to whitelist. See src/data/whitelist-sumber.ts`,
  }),
  accessedAt: z.coerce.date(),
  /** Optional excerpt of the cited passage, max 280 chars (tweet length) */
  excerpt: z.string().max(280).optional(),
});

/* ──────────────────────────────────────────────────────────────────────────
 *  COLLECTION 1: guide
 *  Evergreen A-Z reference. Lives at /panduan/<section>/<slug>
 * ──────────────────────────────────────────────────────────────────────────
 */
const guide = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/guide" }),
  schema: z.object({
    title: z.string().min(10).max(120),
    description: z.string().min(50).max(200),

    /** Section determines URL: /panduan/<section>/<slug> */
    section: z.enum([
      "persiapan",      // dokumen, kewangan, kesihatan, ilmu asas
      "ihram-miqat",    // ihram, miqat, larangan
      "umrah",          // rukun, wajib, sunat umrah
      "haji",           // jenis haji, rukun, wajib, sunat
      "tempat",         // Mekah, Madinah, Mina, Arafah, Muzdalifah
      "doa-zikir",      // doa harian, talbiyah, dll
      "hukum-khas",     // wanita haid, sakit, lansia, OKU
      "selepas",        // selepas pulang, mabrur
    ]),

    /** Within-section ordering (1-99). Lower = earlier in TOC */
    order: z.number().int().min(1).max(99),

    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),

    author: reference("author"),

    sources: z.array(sourceSchema).min(1, "At least 1 whitelist source required").max(15),

    /** Fact-checker gate. Defaults false — only true after CI verification passes */
    factChecked: z.boolean().default(false),
    factCheckedAt: z.coerce.date().optional(),
    factCheckedBy: z.string().optional(),

    /** Set true while drafting; build excludes drafts in production */
    draft: z.boolean().default(true),

    /** Estimated reading time in minutes (auto-calc by writer agent) */
    readingMinutes: z.number().int().min(1).max(60).optional(),
  }),
});

/* ──────────────────────────────────────────────────────────────────────────
 *  COLLECTION 2: article
 *  Fresh content: persoalan khusus, muzakarah, berita, pengalaman.
 *  Lives at /artikel/<category>/<slug>
 * ──────────────────────────────────────────────────────────────────────────
 */
const article = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/article" }),
  schema: z.object({
    title: z.string().min(10).max(120),
    description: z.string().min(50).max(200),

    category: z.enum([
      "persoalan",   // Q&A khusus, fatwa
      "muzakarah",   // hasil muzakarah tahunan
      "berita",      // kuota, pakej, JAKIM updates
      "pengalaman",  // testimonial jemaah
    ]),

    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),

    author: reference("author"),

    /** SEO tags, kebab-case, BM */
    tags: z.array(z.string().regex(/^[a-z0-9-]+$/, "tags must be kebab-case ASCII")).max(8),

    sources: z.array(sourceSchema).min(1).max(15),

    factChecked: z.boolean().default(false),
    factCheckedAt: z.coerce.date().optional(),
    factCheckedBy: z.string().optional(),

    draft: z.boolean().default(true),

    /** Optional related-content links to guide chapters */
    relatedGuides: z.array(reference("guide")).max(5).optional(),

    readingMinutes: z.number().int().min(1).max(60).optional(),
  }),
});

/* ──────────────────────────────────────────────────────────────────────────
 *  COLLECTION 3: author
 * ──────────────────────────────────────────────────────────────────────────
 */
const author = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/author" }),
  schema: z.object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    name: z.string(),
    bio: z.string(),
    credentials: z.array(z.string()),
    /** Optional public profile URL (e.g. LinkedIn) */
    url: z.string().url().optional(),
  }),
});

export const collections = { guide, article, author };
