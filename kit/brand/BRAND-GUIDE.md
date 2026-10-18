# Hola Egipto — Brand Guide

Hola Egipto is a travel brand selling Egypt tours, Nile cruises, excursions and destination guides to Spanish- and English-speaking travellers. The identity is a striped sun rising behind three pyramids over Nile ribbons, a Fraunces wordmark, and a warm papyrus / Nile-teal / terracotta palette.

Token names below are the CSS custom properties in `05-tokens/brand-tokens.css` (without the `--he-` prefix).

## Content fundamentals

- **Voice:** a local friend who plans trips, not a booking engine. Warm, specific, honest. Prefer concrete places, times and inclusions over adjectives.
- **Address the traveller directly:** "you" in English, **tú** in Spanish (not *usted*). Speak as "we".
- **Casing:** sentence case for headings, menus and buttons ("Plan my trip", "Online booking is on its way"). UPPERCASE is reserved for `eyebrow` labels and the tagline.
- **Bilingual parity:** every page exists in both languages. Never mix languages inside one sentence. Spanish runs 20–30% longer, so leave room in buttons and the header.
- **Claims must be true and checkable.** Show a rating, review count, "free cancellation" or "pay on arrival" only once it is live and true. No invented testimonials, no "best in Egypt".
- **No emoji in UI copy or headings.** WhatsApp messages may use them sparingly.
- Real examples:
  - "We're finishing our first verified excursions and tours in Egypt. Meanwhile, tell us what you're planning and we'll reply personally."
  - "The corners of Egypt worth building your trip around"

## Logo

- **Primary:** `hola-egipto-logo-stacked-color.svg`.
- **Website header:** `hola-egipto-logo-horizontal-color.svg` (or `web/header-logo.svg`), 44–56px tall.
- **On `deep-oasis` or dark photos:** the `-reverse` files.
- **One-ink print:** `-mono-black` / `-mono-white`.
- **Under 40px tall:** `hola-egipto-mark-simple-color.svg` (no masonry, no sun stripes).
- **Clear space:** the height of the wordmark's capital H on every side.
- **Minimum sizes:** horizontal 120px wide; stacked 90px wide.
- **Never:** recolour outside these tokens, stretch, rotate, add shadows or outlines, rebuild the wordmark in live type, or write the name with a hyphen ("Hola-Egipto").
- **The name is always "Hola Egipto":** two words, both capitalised.

## Colour

- The page ground is `papyrus`. Cards sit on `linen` with `shadow-sm`.
- Headings and body are `deep-oasis`. Secondary text is `stone`.
- `terracotta` fills the one primary action per view ("Plan my trip"), with white text. Everything else uses `nile-teal` outlines or text links.
- Dark bands (trust bar, booking band, footer) are `deep-oasis` with `papyrus` text and `sun-sand` accents. They may carry the `deep` pattern.
- Small coloured text on light grounds uses the `-ink` variants: `terracotta-ink` for eyebrows and badges, `sand-ink` for captions. Never put `terracotta` or `sun-sand` text on light grounds.
- `whatsapp` green appears only on WhatsApp buttons and icons.
- **Focus ring:** 2px solid `nile-teal` with a 2px offset on light grounds; 2px `sun-sand` on dark bands.

## Type

- **Display and headings:** Fraunces SemiBold (`text-display`, `text-h1`–`text-h4`, large stat numerals). Fraunces Italic 400 for pull quotes.
- **Everything else:** Plus Jakarta Sans (`text-lead`, `text-body`, `text-small`, nav 500, buttons 600, eyebrows 600 uppercase with `tracking-eyebrow`).
- The tagline treatment (`tracking-tagline`) belongs to the logo lockup only.
- Fonts are self-hosted woff2 files with `@font-face` (kit/docs/03-CONTRACTS.md §17). Never load them from Google's CDN, because of GDPR for EU visitors.
- Line length is 60–75 characters for body copy. One `h1` per page.

## Pattern and dividers

- The seamless 160px tile comes in four colourways.
- `papyrus` is a subtle texture for light sections. `deep` is for the footer and dark bands. `teal` is for feature bands. `brand` (full colour) is for merch, tickets and social only, never behind body text.
- `hola-egipto-divider-teal.svg` repeats horizontally (120px period) as a section break. At most once per page section.

## Layout, shape and motion

- **Container:** `container` (1200px) with `gutter` side padding.
- **Section padding:** `section-y` (fluid 64 → 120px).
- **Radii:** `radius-sm` for buttons and inputs (near-square, as in the mockup); `radius-md` for cards and images; `radius-lg` for feature panels; `radius-pill` for badges and chips.
- **Motion:** `dur` (200ms) with `ease`, on hover and focus only. No parallax, no autoplay carousels. Respect `prefers-reduced-motion`.

## Imagery

- Real places and real light: temples, reefs, felucca decks, desert camps, local guides at work. Warm, natural-light photos. Avoid heavy filters, posed camel-at-sunset shots and stock models.
- **Text over photos:** a `deep-oasis` overlay at 55–65% and the reverse logo.
- **Image ratios:** tour/cruise cards 4:3; destination tiles 3:4; hero 16:9 desktop / 4:5 mobile.
- Until real photos exist, use generated branded placeholders (palette + pattern + label), never stock photos.

## Iconography

- One open-source line set, **Lucide**, at 24px, 1.75px stroke, in `nile-teal` on light and `sun-sand` on dark. Inline SVG (e.g. `lucide-react`), no icon CDN.
- Replace the mockup's emoji-style icons (clover, shield, headset, card) with Lucide equivalents.
- **WhatsApp:** the official WhatsApp glyph on a `whatsapp` disc, only on WhatsApp actions.
