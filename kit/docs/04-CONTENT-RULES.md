# Content rules — samples, copy and what must never be invented

Every sample document and sample image has `holaSample: true`. The site is behind the coming-soon page, and the owner replaces samples with real content before launch. Launch terms (contracts §4), fixed pages and `site-settings` defaults are real data, not samples.

## §1 Voice

- **Spanish:** neutral and warm, *tú* for the reader, *ustedes* for plural, no *vosotros*.
- **English:** plain and friendly.
- **Casing:** sentence case for headings, menu items and buttons.
- **No:** emoji, exclamation-mark stacks or superlatives.
- **Prefer specifics:** places, times, what is included.
- **Spanish runs longer:** design for it.

Write each language natively. The English is not a word-for-word translation of the Spanish.

## §2 The sample set

Each sample is **one** document with both languages filled and `available: true` in `es` and `en`.

| Collection | Count | Items |
| --- | --- | --- |
| `tours` | 3 | **Egipto clásico en 8 días: El Cairo, Nilo y Abu Simbel** (8 days, Clásico, 1.290 € / $1,390 per person in a double room) · **Egipto y Mar Rojo en 12 días** (12 days, Egipto y Mar Rojo, 1.690 € / $1,820) · **El Cairo y Luxor en 5 días** (5 days, Privado, 890 € / $960) |
| `cruises` | 2 | **Crucero por el Nilo de Luxor a Asuán, 4 noches** (Crucero Luxor–Asuán, ship "Barco 5★ (nombre pendiente)", 640 € / $690) · **Dahabiya por el Nilo, 5 noches** (Dahabiya, 1.150 € / $1,240) |
| `excursions` | 4 | **Luxor en un día desde Hurghada** (Hurghada, 14 h) · **Snorkel en las islas Giftun desde Hurghada** (Hurghada, 7 h) · **Snorkel en Abu Dabbab desde Marsa Alam** (Marsa Alam, 6 h) · **Pirámides de Guiza y la Esfinge desde El Cairo** (El Cairo, 8 h) |
| `destinations` | 6 | El Cairo y Guiza (El Cairo y el Norte) · Luxor · Asuán · Abu Simbel (Alto Egipto) · Hurghada · Marsa Alam (Mar Rojo) |
| `guides` | 3 | **Cuándo viajar a Egipto: el tiempo mes a mes** (Planificar el viaje) · **Qué ver en Luxor en dos días** (Qué ver) · **Snorkel en el Mar Rojo: lo que conviene saber** (Mar Rojo y buceo) |
| `media` | ≥ 30 | branded placeholders (§4) |

So `pnpm -s hola:samples count` must report `tours` 3/3, `cruises` 2/2, `excursions` 4/4, `destinations` 6/6, `guides` 3/3 (es/en) and `media` ≥ 30.

**English titles:** natural equivalents, e.g. *Classic Egypt in 8 days: Cairo, the Nile and Abu Simbel*. **Slugs:** natural per language (e.g. `egipto-clasico-8-dias` / `classic-egypt-8-days`), never a numeric suffix.

**How full each sample must be:**

- **Trips:** every field of its type is filled with plausible values.
    - The itinerary has one entry per day (or one per time slot for excursions).
    - 4–8 highlights, 4–6 includes and 4–6 excludes.
    - 3 FAQ items.
    - A 5-image gallery.
    - `related_trips` set; `destinations` set in route order.
    - `last_reviewed` = today.
- **Destinations:** every field filled (`best_months`, `days_recommended`, `how_to_get_there`, 4 `top_sights`, real approximate `lat`/`lng`, `nearby`, `region`).
- **Guides:** 900–1,300 words per language with H2 sections, one `trip-card` block and one `tip-box` block.

Place names, geography and historical facts must be correct.

## §3 Never invent (use a visible placeholder instead)

- **Social proof:** ratings, review counts, testimonials, numbers of travellers, years of experience, awards, partner logos.
- **Company details:** names, addresses, phone numbers, emails, registration or licence numbers.
- **People:** names, photos or biographies of team members or guides. Use "Nombre pendiente · Rol pendiente".
- **Supplier brands:** hotel, ship or airline brand names. Use "Hotel 5★ (pendiente)".
- **Guarantees:** "free cancellation", "pay on arrival", "best price", "24/7", safety guarantees. Never write these phrases at all, not even negated ("no ofrecemos cancelación gratuita"); the acceptance script rejects them anywhere in visible text.
- **Changeable facts:** visa and entry rules, fees, ticket prices, opening hours, flight times.
    - In guides, write general guidance and mark any such fact `[verificar]` / `[verify]`.

Placeholder format: `[pendiente]` / `[pending]`, rendered with a dashed `terracotta-ink` outline so it is impossible to miss in review.

## §4 Placeholder images

There are no real photos, and nothing may be downloaded from the web. `pnpm hola:placeholders` generates JPEGs (quality 82) with `sharp` from an SVG composed in code:

- **Background:** the `deep` or `teal` pattern tile from `kit/brand/03-pattern/` at 2× scale, tiled.
- **Overlay:** a centred `papyrus` label block:
    - small caps line `FOTO DE MUESTRA · SAMPLE PHOTO`
    - the subject on a second line, e.g. `Luxor · Templo de Karnak`
- **Font:** text in the SVG uses a generic `sans-serif` family (sharp renders it with the system fonts), or text outlined with any available tool. Do not depend on Google Fonts.
- **Sizes:**
    - hero 2400×1350
    - card 1600×1200 (4:3)
    - tile 1200×1600 (3:4)
    - gallery 2000×1333
- **Alt text** (localized `alt` on the media document): `Foto de muestra: Templo de Karnak, Luxor` / `Sample photo: Karnak Temple, Luxor`.

They must never look like real photos.

## §5 Home, trust bar and band copy

- **Hero H1:** ES `Tu viaje a Egipto, planificado con gente de aquí` · EN `Your Egypt trip, planned with people who live here`. List it as "draft copy for owner review" in the report.
- **Hero lead:** one sentence on tours, Nile cruises and Red Sea excursions in Spanish and English.
- **Stats strip** (from the owner's mockup):

| Value | ES label | EN label |
| --- | --- | --- |
| 2026 | Guías de viaje actualizadas | Fresh local travel guides |
| 100% | Contenido en español e inglés | Content in Spanish & English |
| Mar Rojo / Red Sea | Nuestra base | Where we're based |

- **Trust bar (only these, all true):**
    - Atención en español e inglés / Support in Spanish & English
    - Equipo local en el Mar Rojo / Local team on the Red Sea
    - Guías actualizadas en 2026 / Guides updated in 2026
    - Do **not** add a rating, "free cancellation" or "pay online / on arrival".
- **Booking band:**
    - badge `Próximamente` / `Coming soon`
    - title `Las reservas online están en camino` / `Online booking is on its way`
    - text adapted from the mockup ("We're finishing our first verified excursions… we'll reply personally")
    - buttons: Plan my trip + WhatsApp (WhatsApp only when the number is set)
- **Destinations section** (from the mockup):
    - eyebrow `Destinos` / `Destinations`
    - H2 `Los rincones de Egipto que vale la pena incluir en tu viaje` / `The corners of Egypt worth building your trip around`
- **Why Hola Egipto:** 3 columns (local team on the Red Sea; everything in Spanish and English; trips shaped around you). Mark them as draft copy.

## §6 Fixed pages

- **About:** story `[pendiente]`, a team block with 3 placeholder members (pattern as photo, "Nombre pendiente"), "How we work" in 3 steps (draft), and a licence line `[pendiente]`.
- **Contact:** contact methods read from `site-settings`. An empty field shows `[pendiente]` only to a logged-in admin and is hidden for everyone else (preview-cookie visitors count as everyone else).
- **FAQ:** 4 groups × 3 questions (before booking, payments, during the trip, cancellations). General planning questions with answers that make no guarantees.
- **Legal pages:** headings from spec "Legal". Body text is `[Texto legal pendiente: lo aporta el propietario]` / `[Legal text pending: supplied by the owner]`. The cookie policy also lists the site's own cookies (`hola_consent`, `hola_preview`, `payload-token`).
