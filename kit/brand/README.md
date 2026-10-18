# Hola Egipto — Brand Kit v1.0 (Next.js edition)

Paths below are inside the kit (`kit/brand/…`).

Everything in this kit is vector-first. SVGs have no font dependencies (text is outlined), so they render the same everywhere. The artwork is identical to the v1.0 WordPress kit; only the integration notes changed.

## 01-logo

| File | Use it for |
|---|---|
| `logo-stacked-*` | Primary logo. Print, social posts, documents, anywhere with vertical room. |
| `logo-horizontal-*` | Website header, email signatures, invoices, narrow banners. |
| `logo-horizontal-tagline-*` | Same as horizontal, when there's room for "SINCE 2026". |
| `mark-*` | Emblem alone: avatars, stamps, watermarks, merch. |
| `mark-simple-color` | Mark below **40px** tall (no masonry or sun stripes). |
| `wordmark-*` | Name alone, when the mark already appears elsewhere on the page. |

Colour variants:

- `color` sits on light backgrounds (papyrus, linen, white).
- `reverse` sits on Deep Oasis or dark photos.
- `mono-black` and `mono-white` are for one-colour print, embroidery, laser and stamps.
- `mono-teal` is a one-ink brand print.

`web/` has ready-sized files: `header-logo.svg` (site header), header PNGs at 56px / 112px tall, a reverse footer logo, and a 480px email-signature logo.

**In the app:** copy `web/header-logo.svg` and `web/footer-logo-reverse.svg` to `public/brand/` and render them with `<img>` or `next/image` (`unoptimized` for SVG), with `alt="Hola Egipto"`. Never inline-rebuild the wordmark in live text.

### Rules

- **Clear space:** keep empty space around any logo equal to the height of the capital **H** in the wordmark.
- **Minimum size:** horizontal logo 120px wide (30mm in print). Stacked logo 90px wide (25mm). Full mark 40px tall.
- **Don't:**
  - recolour outside the palette
  - stretch, rotate or add effects/shadows
  - put the colour logo on busy photos (use reverse plus a dark overlay)
  - rebuild the wordmark in a live font
  - add the hyphen back ("Hola-Egipto")

## 02-favicon

**In the app** (Next.js metadata files, no `<head>` snippet needed):

| Kit file | Copy to |
|---|---|
| `favicon.ico` | `src/app/favicon.ico` |
| `favicon.svg` | `src/app/icon.svg` |
| `apple-touch-icon.png` | `src/app/apple-icon.png` |
| `android-chrome-192x192.png`, `android-chrome-512x512.png`, `maskable-512x512.png` | `public/` |
| `site.webmanifest` | becomes `src/app/manifest.ts` (same values; theme colour Deep Oasis) |

Notes: the 16px frame inside `favicon.ico` is hand-simplified (no Nile ribbon) so it stays crisp in tabs. `apple-touch-icon.png` is full-bleed (iOS rounds the corners). The maskable icon keeps the mark inside the safe zone. `source-*.svg` are the masters for those PNGs.

## 03-pattern

A seamless 160px tile in four colourways. Each comes as an SVG tile (use as a CSS background), a 2x PNG tile and a 1920×1080 swatch.

| Colourway | Use |
|---|---|
| `papyrus` | Subtle page or section texture on light backgrounds |
| `deep` | Footer, trust bar, dark sections |
| `teal` | Feature bands, social backgrounds |
| `brand` | Full colour: wrapping paper, merch, tickets, stories. Not for behind body text. |

The `divider-*` files are a repeatable Nile-wave rule (120px period) for section breaks.

**In the app:** copy the `*-tile.svg` and `divider-*.svg` files to `public/brand/pattern/`. `brand-tokens.css` already points `--he-pattern-papyrus` and `--he-pattern-deep` there.

```css
.footer { background: var(--he-deep-oasis) var(--he-pattern-deep) repeat; background-size: 160px; }
```

## 04-social

| File | Size | Use |
|---|---|---|
| `og-default-en` / `og-default-es` | 1200×630 | Default link preview (Open Graph / WhatsApp / X) per language |
| `profile-avatar-1080` | 1080×1080 | WhatsApp Business, Instagram, Facebook, Google Business. Safe for circle crops. |
| `cover-1640x624` | 1640×624 | Facebook / LinkedIn cover. The logo stays in the centre safe area. |

**In the app:** copy the two OG PNGs to `public/brand/og/` and use them as the per-locale fallback `openGraph.images` in `generateMetadata` when a document has no image of its own.

## 05-tokens

- `brand-tokens.css` — CSS custom properties for colour, type scale, spacing, radius, shadow and motion, plus reference classes. Copy it to `src/styles/tokens.css` and import it once in the root layout; it is the only source of design values.
- `fonts/` — self-hosted **Fraunces** (display) and **Plus Jakarta Sans** (UI/body) woff2 files, latin + latin-ext, both SIL OFL (licences included). Self-hosting avoids loading Google Fonts from EU visitors' browsers, which matters for a Spanish audience under GDPR.
- `fonts.css` — the `@font-face` rules (with `unicode-range`) for every face.

**In the app** (contracts §17): copy the woff2 files to `public/fonts/`, use `fonts.css` as the global font stylesheet with its `url('./fonts/…')` paths rewritten to `/fonts/…`, and add exactly two preloads in `<head>`: `/fonts/fraunces-latin-600-normal.woff2` and `/fonts/plus-jakarta-sans-latin-400-normal.woff2`. Do not use `next/font`. The token file's `--he-font-display` and `--he-font-sans` already name the families.

## Palette

| Name | Hex | Role | Contrast |
|---|---|---|---|
| Deep Oasis | `#133232` | Text, dark sections | 12.2:1 on Papyrus |
| Nile Teal | `#145B6B` | Primary brand, links, logo | 6.8:1 on Papyrus |
| Terracotta | `#B5572A` | Primary buttons (white text) | 4.8:1 with white |
| Terracotta Ink | `#A84F25` | Eyebrows, small labels | 4.9:1 on Papyrus |
| Sun Sand | `#E0B57C` | Accent, sun, rules; text on dark only | 7.2:1 on Deep Oasis |
| Sand Ink | `#8C6235` | Small sand-coloured text on light | 4.8:1 on Papyrus |
| Papyrus | `#F7F1E6` | Page background | — |
| Linen | `#FDFAF3` | Cards, surfaces | — |
| Stone | `#5B6664` | Secondary text | 5.3:1 on Papyrus |

The mockup's CTA colour `#BC5C2C` was darkened to `#B5572A`, because white text on the original was 4.46:1, just under WCAG AA. WhatsApp green `#25D366` is reserved for WhatsApp buttons only.

## Typography

- **Fraunces SemiBold 600** for headings and the wordmark. Use Regular 400 italic for pull quotes.
- **Plus Jakarta Sans** for body text (400), UI (500/600) and eyebrows (600, uppercase, +8% tracking).
- **Tagline:** Plus Jakarta Sans 600, uppercase, +42% tracking, Sand Ink on light or Sun Sand on dark.
