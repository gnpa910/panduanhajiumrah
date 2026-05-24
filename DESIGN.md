---
version: alpha
name: Panduan Haji & Umrah
description: Editorial Islamic gravitas — Madinah ink, saffron illumination, cream paper.
colors:
  primary: "#0F2922"
  secondary: "#5C5854"
  tertiary: "#0E7C66"
  illumination: "#8B5A1F"
  neutral: "#FAF7F2"
  surface: "#FFFFFF"
  surface-soft: "#F0EDE6"
  border: "#E0DAD0"
  accent-soft: "#E6F2EF"
  illumination-soft: "#FBF3E2"
  on-primary: "#FAF7F2"
  on-tertiary: "#FFFFFF"
  on-neutral: "#1A1A18"
  success: "#2F5D3F"
  warning: "#8B5A1F"
typography:
  display:
    fontFamily: Lora
    fontSize: 3.5rem
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  h1:
    fontFamily: Lora
    fontSize: 2.5rem
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.015em"
  h2:
    fontFamily: Lora
    fontSize: 1.75rem
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  h3:
    fontFamily: Inter
    fontSize: 1.25rem
    fontWeight: 600
    lineHeight: 1.3
  body-lg:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: 400
    lineHeight: 1.7
  body-md:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.7
  body-sm:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.6
  label-caps:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.1em"
  arabic:
    fontFamily: Amiri
    fontSize: 1.5rem
    fontWeight: 400
    lineHeight: 2.2
rounded:
  none: "0px"
  sm: 2px
  md: 6px
  lg: 12px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  2xl: 80px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.sm}"
    padding: 14px
    typography: "{typography.label-caps}"
  button-primary-hover:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.on-tertiary}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.sm}"
    padding: 14px
    typography: "{typography.label-caps}"
  button-secondary-hover:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.primary}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-neutral}"
    rounded: "{rounded.md}"
    padding: 24px
  card-hover:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-neutral}"
  card-feature:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: 32px
  badge:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.primary}"
    rounded: "{rounded.full}"
    padding: 6px
    typography: "{typography.label-caps}"
  pullquote:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.primary}"
    rounded: "{rounded.none}"
    padding: 24px
---

## Overview

Panduan Haji & Umrah is a Bahasa Melayu reference site for jemaah, fact-checked
against JAKIM, Mufti Wilayah, Tabung Haji, Kemenag RI, sunnah.com, and
quran.com. The visual identity translates that mission: editorial scholarship
with spiritual warmth, never tourism brochure.

The mood sits between a long-form religious journal (think Aljazeera Magazine,
The Atlantic) and a kitab — paper-cream surfaces, ink-deep type, sparse saffron
illumination where attention is earned. Restraint is the brand. Gold is rare,
green is dignified, and white space carries reverence.

## Colors

- **Primary `{colors.primary}` (Madinah Ink):** Deep emerald-black for
  headlines, primary buttons, and the masthead. Reads as authority, not
  decoration. Use for any element a reader's eye should land on first.
- **Secondary `{colors.secondary}` (Tabung Stone):** Warm gray for body
  metadata, captions, dates, source bylines. Recedes deliberately.
- **Tertiary `{colors.tertiary}` (Saffron):** Manuscript illumination color.
  Reserved for active link state, hover transitions, decorative rules,
  pullquote bars, and the favicon mark. Never the body of a CTA.
- **Neutral `{colors.neutral}` (Kertas Cream):** Page background. Off-white
  warmth — pure `#FFFFFF` would feel clinical. Cream signals "this is meant to
  be read slowly."
- **Surface `{colors.surface}`:** Cards and elevated panels lift to pure white
  against the cream page, creating gentle contrast without shadow.
- **Accent Soft `{colors.accent-soft}` (Saffron Tint):** Pullquote and feature
  card background. Diluted saffron — warm without shouting.

Pure black is forbidden. Body text uses `{colors.on-neutral}` (`#1A1A18`)
which carries a warm undertone matching the cream paper.

## Typography

Two families. Lora (serif) for display and headings carries the journalistic
weight — its calligraphic terminals echo Arabic manuscript tradition without
caricature. Inter (sans) for body and UI keeps long Bahasa Melayu paragraphs
readable on phones.

Hierarchy is carried by **size and weight**, not color shifts. Headlines stay
in primary ink. Inter's tabular numerals keep dates and reading-time metadata
aligned in cards.

Arabic and Quranic inline text uses Amiri at 1.5rem with generous 2.2 line
height, RTL direction. Never resize Arabic below 1.25rem — diacritics become
illegible.

Letter-spacing on display sizes is tightened (`-0.02em`); body and small text
use natural tracking. The `label-caps` token (`0.1em` tracking, uppercase 700)
is the only place ALL-CAPS appears — category badges and button labels.

## Layout

Spacing scale is a 4px baseline. Reading column locks to `max-w-2xl` (672px)
for prose — research-backed line length for sustained reading. Index and
landing pages widen to `max-w-4xl` (896px) for two-column card grids.

Section rhythm:
- `xl` (48px) between sibling sections within a page
- `2xl` (80px) between major page regions (hero → grid → footer)
- `lg` (24px) between cards in a grid
- `md` (16px) between paragraphs

Hero sections use the cream neutral with a 1px tertiary-saffron rule beneath,
not gradients. Solid color, single accent line — kitab cover feel.

## Shapes

Corners are minimal. `sm` (2px) on buttons, `md` (6px) on cards. No `lg` or
`xl` rounding — soft corners read as consumer-app, which undercuts gravitas.
`full` is reserved for category badges (pill) and the Arabic mark in the
header.

No drop shadows. Elevation is signaled by surface color shift (cream →
white) and a 1px `{colors.border}` outline.

## Components

- **`button-primary`** is the only ink-colored CTA per screen. Hover flips
  to saffron — the single moment gold becomes prominent on the page.
- **`button-secondary`** is the chrome action: white surface, ink text,
  ink border. Used for "Artikel Terkini" and similar parallel choices.
- **`card`** is the default container — white surface on cream page, 1px
  border, 6px radius. Hovering adds a saffron border, no movement.
- **`card-feature`** uses the saffron-tint background for hero callouts,
  "Mulakan di sini" panels, and editor's-pick blocks.
- **`badge`** is the category tag (Haji / Umrah / Persiapan). Pill-shaped,
  cream-tint surface, ink label-caps text. Sits above the article title.
- **`pullquote`** has zero radius, saffron-tint background, full-width within
  the prose column, and a 4px tertiary-saffron left bar (added in CSS, not
  token-defined). Used for Quran/hadith excerpts.

## Do's and Don'ts

- **Do** keep saffron rare. If two saffron elements are visible at once on a
  screen, remove one. Scarcity is what makes it read as illumination.
- **Do** lead headlines with Lora. Section headings inside articles can use
  Inter h3 to avoid serif fatigue.
- **Do** check Arabic line height when introducing new component types.
  Diacritics (harakat) clip below 2.0.
- **Don't** introduce new greens. The single ink primary covers all
  authoritative uses. "Brighter green for buttons" is exactly the tourism
  brochure look this brand rejects.
- **Don't** use shadow elevation. The white-on-cream surface shift carries
  hierarchy.
- **Don't** nest component variants. `button-primary-hover` is a sibling key
  in `components`, not `button-primary.hover`.
- **Don't** mix the ink primary with pure black on the same screen. The
  warm-undertone primary will read as muddy next to true black.
